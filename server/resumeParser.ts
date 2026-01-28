import mammoth from "mammoth";
import { invokeLLM } from "./_core/llm";

/**
 * 从PDF文件中提取文本
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for pdf-parse
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = (pdfParseModule as any).default || pdfParseModule;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("[PDF Parser] Error extracting text from PDF:", error);
    throw new Error("PDF文件解析失败");
  }
}

/**
 * 从Word文件中提取文本
 */
export async function extractTextFromWord(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("[Word Parser] Error extracting text from Word:", error);
    throw new Error("Word文件解析失败");
  }
}

/**
 * 使用AI从简历文本中提取结构化信息
 */
export async function extractResumeInfo(resumeText: string) {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "你是一个专业的简历解析助手。请从简历文本中提取关键信息，并以JSON格式返回。",
        },
        {
          role: "user",
          content: `请从以下简历文本中提取关键信息：

${resumeText}

请提取以下信息并以JSON格式返回：
1. 基本信息：姓名、邮箱、电话、所在地、期望职位、工作年限、期望薪资
2. 个人总结：候选人的自我介绍或职业目标
3. 工作经历：公司名称、职位、开始时间、结束时间、工作内容
4. 教育背景：学校名称、专业、学历、开始时间、结束时间
5. 技能标签：候选人掌握的技能列表

注意：
- 如果某些信息在简历中没有提供，请设置为null
- 时间格式使用YYYY-MM格式
- 工作年限如果无法确定，可以根据工作经历推算
- 技能标签提取候选人简历中提到的关键技能`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "resume_info",
          strict: true,
          schema: {
            type: "object",
            properties: {
              name: { type: "string", description: "候选人姓名" },
              email: { type: ["string", "null"], description: "邮箱地址" },
              phone: { type: ["string", "null"], description: "电话号码" },
              location: { type: ["string", "null"], description: "所在地" },
              position: { type: ["string", "null"], description: "期望职位" },
              yearsOfExperience: { type: ["number", "null"], description: "工作年限" },
              expectedSalary: { type: ["string", "null"], description: "期望薪资" },
              summary: { type: ["string", "null"], description: "个人总结" },
              workExperiences: {
                type: "array",
                description: "工作经历列表",
                items: {
                  type: "object",
                  properties: {
                    company: { type: "string", description: "公司名称" },
                    position: { type: "string", description: "职位" },
                    startDate: { type: "string", description: "开始时间（YYYY-MM）" },
                    endDate: { type: ["string", "null"], description: "结束时间（YYYY-MM），null表示至今" },
                    description: { type: ["string", "null"], description: "工作内容" },
                  },
                  required: ["company", "position", "startDate"],
                  additionalProperties: false,
                },
              },
              educations: {
                type: "array",
                description: "教育背景列表",
                items: {
                  type: "object",
                  properties: {
                    school: { type: "string", description: "学校名称" },
                    major: { type: ["string", "null"], description: "专业" },
                    degree: { type: ["string", "null"], description: "学历" },
                    startDate: { type: ["string", "null"], description: "开始时间（YYYY-MM）" },
                    endDate: { type: ["string", "null"], description: "结束时间（YYYY-MM）" },
                  },
                  required: ["school"],
                  additionalProperties: false,
                },
              },
              skills: {
                type: "array",
                description: "技能标签列表",
                items: {
                  type: "string",
                },
              },
            },
            required: [
              "name",
              "email",
              "phone",
              "location",
              "position",
              "yearsOfExperience",
              "expectedSalary",
              "summary",
              "workExperiences",
              "educations",
              "skills",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const message = response.choices[0]?.message;
    if (!message || !message.content) {
      throw new Error("AI未返回有效的解析结果");
    }

    const content = typeof message.content === "string" ? message.content : JSON.stringify(message.content);
    return JSON.parse(content);
  } catch (error) {
    console.error("[AI Parser] Error extracting resume info:", error);
    throw new Error("简历信息提取失败");
  }
}

/**
 * 解析简历文件并提取结构化信息
 */
export async function parseResumeFile(buffer: Buffer, filename: string) {
  // 根据文件扩展名判断文件类型
  const ext = filename.toLowerCase().split(".").pop();

  let resumeText: string;

  if (ext === "pdf") {
    resumeText = await extractTextFromPDF(buffer);
  } else if (ext === "doc" || ext === "docx") {
    resumeText = await extractTextFromWord(buffer);
  } else {
    throw new Error("不支持的文件格式，仅支持PDF和Word文档");
  }

  // 使用AI提取结构化信息
  const resumeInfo = await extractResumeInfo(resumeText);

  return resumeInfo;
}
