import { describe, expect, it } from "vitest";
import { toCartItem } from "../client/src/pages/Favorites";
import { calculateCheckoutTotals } from "../shared/checkout";

describe("Favorites reorder adapter", () => {
  it("maps a saved product into the shared cart shape", () => {
    expect(toCartItem({
      productId: 25,
      name: "BMW air filter",
      price: "129,90",
      compatibleBrands: "BMW, Mercedes-Benz",
      compatibleModels: "F30, W205",
      primaryImageUrl: "/filter.webp",
    })).toEqual({
      id: 25,
      name: "BMW air filter",
      brand: "BMW",
      model: "F30",
      price: 129.9,
      quantity: 1,
      image: "/filter.webp",
    });
  });

  it("keeps a safe zero price for malformed catalog prices", () => {
    expect(toCartItem({
      productId: 26,
      name: "Unknown price part",
      price: "not-a-price",
      compatibleBrands: null,
      compatibleModels: null,
      primaryImageUrl: null,
    }).price).toBe(0);
  });

  it("preserves the 15% approved-B2B discount when a favorite is reordered", () => {
    const favoriteCartItem = toCartItem({
      productId: 27,
      name: "OEM alternator",
      price: "200.00",
      compatibleBrands: "BMW",
      compatibleModels: "G20",
      primaryImageUrl: null,
    });
    const totals = calculateCheckoutTotals(
      [{ price: favoriteCartItem.price.toString(), quantity: 2 }],
      true,
      5.99
    );

    expect(totals.subtotal).toBe(400);
    expect(totals.discountAmount).toBe(60);
    expect(totals.totalPrice).toBe(345.99);
  });
});
