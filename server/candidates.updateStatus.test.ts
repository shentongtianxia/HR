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

describe("candidates.updateStatus", () => {
  it("should update candidate status successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.updateStatus({
      candidateId: 1,
      status: "reviewing",
    });

    expect(result).toEqual({ success: true });
  });

  it("should accept all valid status values", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const statuses: Array<"pending" | "reviewing" | "interviewed" | "offered" | "rejected"> = [
      "pending",
      "reviewing",
      "interviewed",
      "offered",
      "rejected",
    ];

    for (const status of statuses) {
      const result = await caller.candidates.updateStatus({
        candidateId: 1,
        status,
      });

      expect(result).toEqual({ success: true });
    }
  });

  it("should reject invalid status values", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.candidates.updateStatus({
        candidateId: 1,
        status: "invalid_status" as any,
      })
    ).rejects.toThrow();
  });
});

describe("candidates.batchUpdateStatus", () => {
  it("should batch update multiple candidates successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.batchUpdateStatus({
      candidateIds: [1, 2, 3],
      status: "interviewed",
    });

    expect(result).toEqual({
      success: true,
      updatedCount: 3,
    });
  });

  it("should handle empty candidate list", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.candidates.batchUpdateStatus({
      candidateIds: [],
      status: "reviewing",
    });

    expect(result).toEqual({
      success: true,
      updatedCount: 0,
    });
  });

  it("should reject invalid status in batch update", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.candidates.batchUpdateStatus({
        candidateIds: [1, 2],
        status: "invalid" as any,
      })
    ).rejects.toThrow();
  });
});
