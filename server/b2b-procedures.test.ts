import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { appRouter } from "./routers";
import { getDb, getUserByOpenId, upsertUser } from "./db";
import { users } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

const TEST_OPEN_ID = `vitest-b2b-${Date.now()}`;

function createContext(user: User | null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Authenticated B2B procedure workflow", () => {
  let testUser: User | undefined;
  let database: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    database = await getDb();
    if (!database) return;

    await upsertUser({
      openId: TEST_OPEN_ID,
      name: "Vitest B2B User",
      email: `${TEST_OPEN_ID}@example.com`,
      loginMethod: "vitest",
      role: "user",
      userType: "b2c",
    });

    testUser = (await getUserByOpenId(TEST_OPEN_ID)) ?? undefined;
  });

  afterAll(async () => {
    if (database && testUser) {
      await database.delete(users).where(eq(users.id, testUser.id));
    }
  });

  it("requires authentication for B2B registration", async () => {
    const caller = appRouter.createCaller(createContext(null));

    await expect(
      caller.ecommerce.b2b.register({
        userType: "b2b",
        companyName: "Unauthenticated Company",
        companyTaxId: "BG000000000",
      })
    ).rejects.toBeDefined();
  });

  it("registers an authenticated user as a pending B2B account", async () => {
    if (!testUser) return;

    const caller = appRouter.createCaller(createContext(testUser));
    const result = await caller.ecommerce.b2b.register({
      userType: "b2b",
      companyName: "Vitest Parts Ltd",
      companyTaxId: "BG123456789",
    });

    expect(result?.userType).toBe("b2b");
    expect(result?.companyName).toBe("Vitest Parts Ltd");
    expect(result?.companyTaxId).toBe("BG123456789");
    expect(result?.b2bApprovalStatus).toBe("pending");
  });

  it("allows an admin to list, approve, and reject B2B accounts", async () => {
    if (!testUser) return;

    const admin: User = {
      ...testUser,
      id: testUser.id + 1000000,
      openId: `${TEST_OPEN_ID}-admin`,
      role: "admin",
      name: "Vitest Admin",
    };
    const caller = appRouter.createCaller(createContext(admin));

    const pending = await caller.ecommerce.b2b.getAllUsers({ approvalStatus: "pending" });
    expect(Array.isArray(pending)).toBe(true);

    const approved = await caller.ecommerce.b2b.approve(testUser.id);
    expect(approved?.b2bApprovalStatus).toBe("approved");

    const rejected = await caller.ecommerce.b2b.reject(testUser.id);
    expect(rejected?.b2bApprovalStatus).toBe("rejected");
  });

  it("rejects non-admin access to the B2B management list", async () => {
    if (!testUser) return;

    const caller = appRouter.createCaller(createContext(testUser));

    await expect(
      caller.ecommerce.b2b.getAllUsers({ approvalStatus: "pending" })
    ).rejects.toBeDefined();
  });
});
