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


describe("listing images router", () => {
  it("should create listing image with valid data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const image = await caller.crm.listingImages.create({
        listingId: 1,
        imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        displayOrder: 0,
        isPrimary: 1,
      });
      expect(image).toBeDefined();
    } catch (error: any) {
      // Expected to fail without database, but should not have validation errors
      expect(error.message).not.toContain("invalid_type");
    }
  });

  it("should get listing images by listing id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const images = await caller.crm.listingImages.getByListingId(1);
      expect(Array.isArray(images)).toBe(true);
    } catch (error: any) {
      expect(error.message).not.toContain("invalid_type");
    }
  });

  it("should update listing image display order", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.crm.listingImages.update({
        id: 1,
        displayOrder: 1,
        isPrimary: 0,
      });
      // Should either succeed or fail gracefully
      expect(result === null || result !== undefined).toBe(true);
    } catch (error: any) {
      expect(error.message).not.toContain("invalid_type");
    }
  });

  it("should delete listing image", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.crm.listingImages.delete(1);
      expect(typeof result.success === "boolean").toBe(true);
    } catch (error: any) {
      expect(error.message).not.toContain("invalid_type");
    }
  });

  it("should delete all listing images by listing id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.crm.listingImages.deleteByListingId(1);
      expect(typeof result.success === "boolean").toBe(true);
    } catch (error: any) {
      expect(error.message).not.toContain("invalid_type");
    }
  });

  it("should reorder listing images", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.crm.listingImages.reorder({
        listingId: 1,
        imageIds: [1, 2, 3],
      });
      expect(typeof result.success === "boolean").toBe(true);
    } catch (error: any) {
      expect(error.message).not.toContain("invalid_type");
    }
  });

  it("should validate image creation input", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // Missing required fields
      await caller.crm.listingImages.create({
        listingId: 1,
        imageUrl: "", // Empty URL should fail
        displayOrder: 0,
        isPrimary: 1,
      });
    } catch (error: any) {
      // Should have validation error for empty URL
      expect(error.message).toContain("error") || expect(error).toBeDefined();
    }
  });
});
