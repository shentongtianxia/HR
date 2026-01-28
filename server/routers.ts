import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getCandidates, getCandidateDetail, getCandidateSkills, getAiEvaluation, upsertAiEvaluation, importCandidate } from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  candidates: router({
    /**
     * 获取候选人列表，支持搜索和筛选
     */
    list: publicProcedure
      .input(
        z.object({
          search: z.string().optional(),
          position: z.string().optional(),
          minExperience: z.number().optional(),
          maxExperience: z.number().optional(),
          status: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        const candidateList = await getCandidates(input);
        
        // 为每个候选人获取技能标签
        const candidatesWithSkills = await Promise.all(
          candidateList.map(async (candidate) => {
            const skillList = await getCandidateSkills(candidate.id);
            return {
              ...candidate,
              skills: skillList,
            };
          })
        );

        return candidatesWithSkills;
      }),

    /**
     * 获取候选人详细信息
     */
    detail: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getCandidateDetail(input.id);
      }),

    /**
     * 获取AI评价
     */
    evaluation: publicProcedure
      .input(z.object({ candidateId: z.number() }))
      .query(async ({ input }) => {
        return await getAiEvaluation(input.candidateId);
      }),

    /**
     * 生成AI评价
     */
    generateEvaluation: publicProcedure
      .input(z.object({ candidateId: z.number() }))
      .mutation(async ({ input }) => {
        // 获取候选人详细信息
        const detail = await getCandidateDetail(input.candidateId);
        if (!detail) {
          throw new Error("候选人不存在");
        }

        const { candidate, workExperiences, educations, projects, skills } = detail;

        // 构建候选人信息提示词
        const prompt = `
请作为一名资深HR，对以下候选人进行全面评价：

**基本信息：**
- 姓名：${candidate.name}
- 应聘职位：${candidate.position}
- 工作年限：${candidate.yearsOfExperience}年
- 所在地：${candidate.location}
- 期望薪资：${candidate.expectedSalary}
- 个人总结：${candidate.summary}

**工作经历：**
${workExperiences.map(w => `
- ${w.company} | ${w.position} | ${w.startDate} - ${w.endDate}
  ${w.description}
  成就：${w.achievements}
`).join('\n')}

**教育背景：**
${educations.map(e => `
- ${e.school} | ${e.degree} | ${e.major} | ${e.startDate} - ${e.endDate}
`).join('\n')}

**项目经验：**
${projects.map(p => `
- ${p.name} | ${p.role} | ${p.startDate} - ${p.endDate}
  ${p.description}
  技术栈：${p.technologies}
  成果：${p.achievements}
`).join('\n')}

**技能标签：**
${skills.map(s => `${s.name}(${s.level})`).join('、')}

请按照以下JSON格式返回评价结果：
{
  "overallScore": "综合评分（0-100的数字）",
  "strengths": ["核心优势1", "核心优势2", "核心优势3"],
  "risks": ["潜在风险1", "潜在风险2"],
  "suggestions": ["面试建议1", "面试建议2", "面试建议3"],
  "detailedAnalysis": "详细分析文本，200字左右"
}
`;

        // 调用LLM生成评价
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "你是一名资深HR专家，擅长候选人评估和面试建议。请客观、专业地分析候选人的优势和风险。",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "candidate_evaluation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  overallScore: { type: "string", description: "综合评分0-100" },
                  strengths: {
                    type: "array",
                    items: { type: "string" },
                    description: "核心优势列表",
                  },
                  risks: {
                    type: "array",
                    items: { type: "string" },
                    description: "潜在风险列表",
                  },
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "面试建议列表",
                  },
                  detailedAnalysis: { type: "string", description: "详细分析" },
                },
                required: ["overallScore", "strengths", "risks", "suggestions", "detailedAnalysis"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== 'string') {
          throw new Error("AI评价生成失败");
        }

        const evaluation = JSON.parse(content);

        // 保存到数据库
        await upsertAiEvaluation({
          candidateId: input.candidateId,
          overallScore: evaluation.overallScore,
          strengths: JSON.stringify(evaluation.strengths),
          risks: JSON.stringify(evaluation.risks),
          suggestions: JSON.stringify(evaluation.suggestions),
          detailedAnalysis: evaluation.detailedAnalysis,
        });

        return evaluation;
      }),

    /**
     * 导入候选人信息
     */
    importCandidate: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "姓名不能为空"),
          phone: z.string().optional(),
          email: z.string().email("邮箱格式不正确").optional(),
          position: z.string().min(1, "应聘职位不能为空"),
          yearsOfExperience: z.number().min(0).optional(),
          location: z.string().optional(),
          expectedSalary: z.string().optional(),
          summary: z.string().optional(),
          workExperiences: z.array(
            z.object({
              company: z.string().min(1, "公司名称不能为空"),
              position: z.string().min(1, "职位不能为空"),
              startDate: z.string().optional(),
              endDate: z.string().optional(),
              description: z.string().optional(),
              achievements: z.string().optional(),
            })
          ).optional(),
          educations: z.array(
            z.object({
              school: z.string().min(1, "学校名称不能为空"),
              degree: z.string().optional(),
              major: z.string().optional(),
              startDate: z.string().optional(),
              endDate: z.string().optional(),
            })
          ).optional(),
          skills: z.array(
            z.object({
              name: z.string().min(1, "技能名称不能为空"),
              level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
            })
          ).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const candidateId = await importCandidate(input);
        return { success: true, candidateId };
      }),
  }),
});

export type AppRouter = typeof appRouter;
