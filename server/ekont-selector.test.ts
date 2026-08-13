import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const selectorSource = readFileSync(
  resolve(import.meta.dirname, "../client/src/components/EkontSelector.tsx"),
  "utf8"
);
const checkoutSource = readFileSync(
  resolve(import.meta.dirname, "../client/src/components/ShoppingCartSidebarB2B.tsx"),
  "utf8"
);

describe("EkontSelector checkout wiring", () => {
  it("loads cities, offices, and shipping through the ecommerce Ekont router", () => {
    expect(selectorSource).toContain("trpc.ecommerce.ekont.getCities.useQuery()");
    expect(selectorSource).toContain("trpc.ecommerce.ekont.getOffices.useQuery(selectedCity");
    expect(selectorSource).toContain("trpc.ecommerce.ekont.calculateShipping.useQuery");
  });

  it("resets the office when city changes and forwards callback values", () => {
    expect(selectorSource).toContain('setSelectedOffice("")');
    expect(selectorSource).toContain("onCityChange?.(cityId, city.name)");
    expect(selectorSource).toContain("onOfficeChange?.(officeId, office.name)");
    expect(selectorSource).toContain("onShippingCostChange?.(shippingQuery.data.cost)");
  });

  it("passes selected Ekont values into the B2B checkout state", () => {
    expect(checkoutSource).toContain("onShippingCostChange={(cost) => setShippingCost(cost)}");
    expect(checkoutSource).toContain("setSelectedCity(cityId)");
    expect(checkoutSource).toContain("setFormData({ ...formData, econtOffice: \"\" })");
    expect(checkoutSource).toContain("setFormData({ ...formData, econtOffice: officeName })");
    expect(checkoutSource).toContain("validateCheckoutInput");
  });
});
