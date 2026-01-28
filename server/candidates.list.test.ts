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

describe("candidates.list", () => {
  beforeAll(async () => {
    // 确保数据库连接正常
    const db = await getDb();
    expect(db).toBeTruthy();
  });

  it("should return a list of candidates", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // 验证候选人数据结构
    const firstCandidate = result[0];
    expect(firstCandidate).toHaveProperty("id");
    expect(firstCandidate).toHaveProperty("name");
    expect(firstCandidate).toHaveProperty("position");
    expect(firstCandidate).toHaveProperty("yearsOfExperience");
    expect(firstCandidate).toHaveProperty("matchScore");
    expect(firstCandidate).toHaveProperty("skills");
    expect(Array.isArray(firstCandidate.skills)).toBe(true);
  });

  it("should support search by name", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.list({ search: "窦" });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.name).toContain("窦");
  });

  it("should support search by position", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.list({ position: "销售" });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.position).toContain("销售");
  });

  it("should filter by experience range", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.list({
      minExperience: 10,
      maxExperience: 20,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // 验证所有候选人的经验都在范围内
    result.forEach((candidate) => {
      expect(candidate.yearsOfExperience).toBeGreaterThanOrEqual(10);
      expect(candidate.yearsOfExperience).toBeLessThanOrEqual(20);
    });
  });
});
