import { describe, expect, it } from "vitest";
import {
  calculateCheckoutTotals,
  validateCheckoutInput,
} from "../shared/checkout";

describe("B2B checkout and Ekont integration contract", () => {
  const cart = [
    { price: "45 лв.", quantity: 2 },
    { price: "25 лв.", quantity: 1 },
  ];

  it("applies the approved B2B discount before adding Ekont shipping", () => {
    const totals = calculateCheckoutTotals(cart, true, 12.5);

    expect(totals.subtotal).toBe(115);
    expect(totals.discountAmount).toBe(17.25);
    expect(totals.totalPrice).toBe(110.25);
  });

  it("does not apply the discount to pending or non-B2B users", () => {
    const totals = calculateCheckoutTotals(cart, false, 12.5);

    expect(totals.subtotal).toBe(115);
    expect(totals.discountAmount).toBe(0);
    expect(totals.totalPrice).toBe(127.5);
  });

  it("requires all Ekont checkout fields before order submission", () => {
    const base = {
      customerName: "Иван Петров",
      customerPhone: "+359 888 111 222",
      econtOffice: "Еконт - Варна Център",
      cartLength: 1,
      selectedCity: "3",
      shippingCost: 8.49,
    };

    expect(validateCheckoutInput(base)).toBeNull();
    expect(validateCheckoutInput({ ...base, econtOffice: "" })).toBe("econtOffice");
    expect(validateCheckoutInput({ ...base, selectedCity: "" })).toBe("city");
    expect(validateCheckoutInput({ ...base, shippingCost: 0 })).toBe("shippingCost");
    expect(validateCheckoutInput({ ...base, cartLength: 0 })).toBe("cart");
  });

  it("keeps the total deterministic for decimal prices and quantities", () => {
    const totals = calculateCheckoutTotals(
      [{ price: "199.99 лв.", quantity: 3 }],
      true,
      9.49
    );

    expect(totals.subtotal).toBeCloseTo(599.97, 2);
    expect(totals.discountAmount).toBeCloseTo(89.9955, 4);
    expect(totals.totalPrice).toBeCloseTo(519.4645, 4);
  });
});
