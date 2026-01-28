import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("candidates.importCandidate", () => {
  it("should import a candidate with basic information", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.importCandidate({
      name: "测试候选人",
      position: "软件工程师",
      email: "test@example.com",
      phone: "13800138000",
      yearsOfExperience: 5,
      location: "北京",
      expectedSalary: "20-30K",
      summary: "5年软件开发经验，熟悉React和Node.js",
    });

    expect(result.success).toBe(true);
    expect(result.candidateId).toBeTypeOf("number");
    expect(result.candidateId).toBeGreaterThan(0);
  });

  it("should import a candidate with work experiences", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.importCandidate({
      name: "张三",
      position: "销售经理",
      email: "zhangsan@example.com",
      yearsOfExperience: 8,
      workExperiences: [
        {
          company: "阿里巴巴",
          position: "高级销售经理",
          startDate: "2020-01",
          endDate: "至今",
          description: "负责华东区域大客户销售",
          achievements: "年度销售额突破5000万",
        },
        {
          company: "腾讯",
          position: "销售专员",
          startDate: "2016-06",
          endDate: "2019-12",
          description: "负责企业客户开发与维护",
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.candidateId).toBeGreaterThan(0);
  });

  it("should import a candidate with education and skills", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.importCandidate({
      name: "李四",
      position: "产品经理",
      educations: [
        {
          school: "清华大学",
          degree: "本科",
          major: "计算机科学与技术",
          startDate: "2012-09",
          endDate: "2016-06",
        },
      ],
      skills: [
        { name: "产品设计", level: "expert" },
        { name: "用户研究", level: "advanced" },
        { name: "项目管理", level: "advanced" },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.candidateId).toBeGreaterThan(0);
  });

  it("should reject import with missing required fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.candidates.importCandidate({
        name: "",
        position: "软件工程师",
      })
    ).rejects.toThrow();
  });

  it("should reject import with invalid email format", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.candidates.importCandidate({
        name: "测试用户",
        position: "软件工程师",
        email: "invalid-email",
      })
    ).rejects.toThrow();
  });
});
