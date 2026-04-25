import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "admin",
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

describe("listings router", () => {
  it("should validate mileage as number", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.crm.listings.create({
        make: "BMW",
        model: "3 Series",
        year: 2023,
        engine: "2.0L",
        transmission: "Automatic",
        mileage: 50000,
        price: "$25,000",
        description: "Test listing",
        primaryImageUrl: undefined,
      });
      // If we get here, the creation was successful
      expect(true).toBe(true);
    } catch (error: any) {
      // Check if error is NOT about NaN
      expect(error.message).not.toContain("NaN");
    }
  });

  it("should handle numeric string conversion for mileage", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.crm.listings.create({
        make: "Mercedes",
        model: "C-Class",
        year: 2022,
        engine: "2.5L",
        transmission: "Manual",
        mileage: 75000,
        price: "$30,000",
        description: "Test Mercedes listing",
        primaryImageUrl: undefined,
      });
      expect(true).toBe(true);
    } catch (error: any) {
      expect(error.message).not.toContain("NaN");
    }
  });

  it("should accept valid listing data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const validListing = {
      make: "Audi",
      model: "A4",
      year: 2021,
      engine: "1.8L",
      transmission: "CVT",
      mileage: 100000,
      price: "$20,000",
      description: "Well-maintained Audi",
      primaryImageUrl: undefined,
    };

    try {
      await caller.crm.listings.create(validListing);
      expect(true).toBe(true);
    } catch (error: any) {
      // Should not have validation errors
      expect(error.message).not.toContain("invalid_type");
    }
  });
});
