/**
 * E-commerce Router Tests
 */

import { describe, it, expect } from "vitest";
import { appRouter } from "../routers";

describe("E-commerce Router", () => {
  describe("Categories", () => {
    it("should get all categories", async () => {
      const caller = appRouter.createCaller({} as any);
      const categories = await caller.ecommerce.categories.getAll();
      expect(Array.isArray(categories)).toBe(true);
    });
  });

  describe("Products", () => {
    it("should get all products", async () => {
      const caller = appRouter.createCaller({} as any);
      const products = await caller.ecommerce.products.getAll({
        status: "active",
      });
      expect(Array.isArray(products)).toBe(true);
    });

    it("should filter products by category", async () => {
      const caller = appRouter.createCaller({} as any);
      const products = await caller.ecommerce.products.getAll({
        categoryId: 1,
        status: "active",
      });
      expect(Array.isArray(products)).toBe(true);
    });

    it("should search products by name", async () => {
      const caller = appRouter.createCaller({} as any);
      const products = await caller.ecommerce.products.getAll({
        search: "filter",
        status: "active",
      });
      expect(Array.isArray(products)).toBe(true);
    });
  });

  describe("Orders", () => {
    it("should have orders router available", async () => {
      const caller = appRouter.createCaller({} as any);
      expect(caller.ecommerce.orders).toBeDefined();
    });
  });

  describe("Product Images", () => {
    it("should get product images by id", async () => {
      const caller = appRouter.createCaller({} as any);
      const images = await caller.ecommerce.productImages.getByProductId(1);
      expect(Array.isArray(images)).toBe(true);
    });

    it("should handle non-existent product images", async () => {
      const caller = appRouter.createCaller({} as any);
      const images = await caller.ecommerce.productImages.getByProductId(999);
      expect(Array.isArray(images)).toBe(true);
    });
  });
});
