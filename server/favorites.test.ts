import { describe, expect, it, beforeEach, vi } from "vitest";

const state = vi.hoisted(() => ({
  favorites: [] as Array<{ favoriteId: number; productId: number; name: string; stock: number; price: string }>,
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    getFavoriteProducts: vi.fn(async () => state.favorites),
    getFavoriteProduct: vi.fn(async (userId: number, productId: number) =>
      state.favorites.find((favorite) => favorite.productId === productId && userId === 42)
        ? { id: 1, userId, productId, createdAt: new Date() }
        : null
    ),
    getProductById: vi.fn(async (productId: number) => ({
      id: productId,
      status: "active",
      name: `Product ${productId}`,
      price: "100.00",
    })),
    createFavoriteProduct: vi.fn(async ({ userId, productId }: { userId: number; productId: number }) => {
      state.favorites.push({ favoriteId: state.favorites.length + 1, productId, name: `Product ${productId}`, stock: 3, price: "100.00" });
      return { id: state.favorites.length, userId, productId, createdAt: new Date() };
    }),
    deleteFavoriteProduct: vi.fn(async (_userId: number, productId: number) => {
      state.favorites = state.favorites.filter((favorite) => favorite.productId !== productId);
      return true;
    }),
  };
});

import { appRouter } from "./routers";

const approvedB2BContext = {
  user: {
    id: 42,
    role: "user",
    userType: "b2b",
    b2bApprovalStatus: "approved",
  },
} as any;

const pendingB2BContext = {
  user: {
    id: 42,
    role: "user",
    userType: "b2b",
    b2bApprovalStatus: "pending",
  },
} as any;

describe("B2B favorites router", () => {
  beforeEach(() => {
    state.favorites = [];
  });

  it("blocks unauthenticated and non-approved users", async () => {
    const unauthenticated = appRouter.createCaller({} as any);
    await expect(unauthenticated.ecommerce.favorites.getAll()).rejects.toMatchObject({ code: "UNAUTHORIZED" });

    const pending = appRouter.createCaller(pendingB2BContext);
    await expect(pending.ecommerce.favorites.getAll()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("toggles a valid active product on and off for an approved B2B customer", async () => {
    const caller = appRouter.createCaller(approvedB2BContext);

    const added = await caller.ecommerce.favorites.toggle({ productId: 7 });
    expect(added).toEqual({ isFavorite: true, productId: 7 });
    expect((await caller.ecommerce.favorites.getIds())).toEqual([7]);

    const removed = await caller.ecommerce.favorites.toggle({ productId: 7 });
    expect(removed).toEqual({ isFavorite: false, productId: 7 });
    expect(await caller.ecommerce.favorites.getIds()).toEqual([]);
  });

  it("returns saved product data in newest-first favorite order", async () => {
    state.favorites = [
      { favoriteId: 2, productId: 9, name: "Second", stock: 2, price: "20.00" },
      { favoriteId: 1, productId: 8, name: "First", stock: 4, price: "10.00" },
    ];
    const caller = appRouter.createCaller(approvedB2BContext);
    const favorites = await caller.ecommerce.favorites.getAll();
    expect(favorites.map((favorite) => favorite.productId)).toEqual([9, 8]);
    expect(favorites[0].stock).toBe(2);
  });

  it("removes a favorite explicitly and rejects invalid product ids", async () => {
    state.favorites = [{ favoriteId: 1, productId: 12, name: "Brake pad", stock: 5, price: "80.00" }];
    const caller = appRouter.createCaller(approvedB2BContext);

    await expect(caller.ecommerce.favorites.remove({ productId: 12 })).resolves.toEqual({ success: true, productId: 12 });
    await expect(caller.ecommerce.favorites.toggle({ productId: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
