export interface CheckoutPricingItem {
  price: string;
  quantity: number;
}

export interface CheckoutTotals {
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
}

export interface CheckoutValidationInput {
  customerName: string;
  customerPhone: string;
  econtOffice: string;
  cartLength: number;
  selectedCity: string;
  shippingCost: number;
}

export function parseCheckoutPrice(price: string): number {
  return parseFloat(price.replace(/[^\d.-]/g, "")) || 0;
}

export function calculateCheckoutTotals(
  cart: CheckoutPricingItem[],
  isB2BApproved: boolean,
  shippingCost: number
): CheckoutTotals {
  const subtotal = cart.reduce(
    (sum, item) => sum + parseCheckoutPrice(item.price) * item.quantity,
    0
  );
  const discountAmount = isB2BApproved ? subtotal * 0.15 : 0;
  const totalPrice = subtotal - discountAmount + shippingCost;

  return { subtotal, discountAmount, totalPrice };
}

export function validateCheckoutInput(input: CheckoutValidationInput): string | null {
  if (!input.customerName.trim()) return "customerName";
  if (!input.customerPhone.trim()) return "customerPhone";
  if (!input.econtOffice.trim()) return "econtOffice";
  if (input.cartLength === 0) return "cart";
  if (!input.selectedCity) return "city";
  if (input.shippingCost === 0) return "shippingCost";
  return null;
}
