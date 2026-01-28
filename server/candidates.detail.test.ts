import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): { ctx: TrpcContext } {
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
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("candidates.detail", () => {
  beforeAll(async () => {
    // 确保数据库连接正常
    const db = await getDb();
    expect(db).toBeTruthy();
  });

  it("should return candidate detail with related data", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // 获取第一个候选人的详情（ID为1）
    const result = await caller.candidates.detail({ id: 1 });

    expect(result).toBeDefined();
    expect(result).not.toBeNull();

    // 验证候选人基本信息
    expect(result?.candidate).toBeDefined();
    expect(result?.candidate.id).toBe(1);
    expect(result?.candidate.name).toBeDefined();
    expect(result?.candidate.position).toBeDefined();

    // 验证关联数据
    expect(result?.workExperiences).toBeDefined();
    expect(Array.isArray(result?.workExperiences)).toBe(true);

    expect(result?.educations).toBeDefined();
    expect(Array.isArray(result?.educations)).toBe(true);

    expect(result?.projects).toBeDefined();
    expect(Array.isArray(result?.projects)).toBe(true);

    expect(result?.skills).toBeDefined();
    expect(Array.isArray(result?.skills)).toBe(true);
  });

  it("should return null for non-existent candidate", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.detail({ id: 99999 });

    expect(result).toBeNull();
  });

  it("should include work experience details", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.detail({ id: 1 });

    expect(result?.workExperiences.length).toBeGreaterThan(0);

    const firstWork = result?.workExperiences[0];
    expect(firstWork).toHaveProperty("company");
    expect(firstWork).toHaveProperty("position");
    expect(firstWork).toHaveProperty("startDate");
    expect(firstWork).toHaveProperty("endDate");
    expect(firstWork).toHaveProperty("description");
  });
});
