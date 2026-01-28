import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
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

describe("candidates.batchImport", () => {
  it("should successfully import multiple candidates", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const candidates = [
      {
        name: "测试候选人1",
        position: "销售经理",
        email: "test1@example.com",
        phone: "13800138001",
        yearsOfExperience: 5,
        location: "北京",
        expectedSalary: "20-30K",
        summary: "5年销售经验",
      },
      {
        name: "测试候选人2",
        position: "销售主管",
        email: "test2@example.com",
        phone: "13800138002",
        yearsOfExperience: 3,
        location: "上海",
        expectedSalary: "15-25K",
        summary: "3年销售经验",
      },
    ];

    const result = await caller.candidates.batchImport({ candidates });

    expect(result.success).toBe(true);
    expect(result.total).toBe(2);
    expect(result.successCount).toBe(2);
    expect(result.failureCount).toBe(0);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].success).toBe(true);
    expect(result.results[1].success).toBe(true);
  });

  it("should import all valid candidates when input passes validation", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const candidates = [
      {
        name: "有效候选人1",
        position: "销售经理",
        email: "valid1@example.com",
        phone: "13800138001",
        yearsOfExperience: 5,
      },
      {
        name: "有效候选人2",
        position: "销售主管",
        email: "valid2@example.com",
        phone: "13800138002",
        yearsOfExperience: 3,
      },
    ];

    const result = await caller.candidates.batchImport({ candidates });

    expect(result.success).toBe(true);
    expect(result.total).toBe(2);
    expect(result.successCount).toBe(2);
    expect(result.failureCount).toBe(0);
  });

  it("should reject invalid input at validation layer", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const candidates = [
      {
        name: "测试候选人",
        position: "", // 无效：职位为空
        email: "test@example.com",
      },
    ];

    // 应该在验证层就报错，不会进入处理逻辑
    await expect(caller.candidates.batchImport({ candidates })).rejects.toThrow();
  });

  it("should handle empty candidate list", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.batchImport({ candidates: [] });

    expect(result.success).toBe(true);
    expect(result.total).toBe(0);
    expect(result.successCount).toBe(0);
    expect(result.failureCount).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it("should import candidates with optional fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const candidates = [
      {
        name: "简单候选人",
        position: "销售",
        // 仅包含必填字段
      },
    ];

    const result = await caller.candidates.batchImport({ candidates });

    expect(result.success).toBe(true);
    expect(result.successCount).toBe(1);
    expect(result.failureCount).toBe(0);
  });
});
