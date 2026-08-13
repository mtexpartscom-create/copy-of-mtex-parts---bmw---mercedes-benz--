// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import HeaderQuickActions from "@/components/HeaderQuickActions";
import { CartProvider } from "@/contexts/CartContext";

const authState = {
  user: { userType: "b2b", b2bApprovalStatus: "approved" },
  isAuthenticated: true,
};

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => authState,
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    ecommerce: {
      favorites: {
        getIds: {
          useQuery: () => ({ data: [101, 102], isLoading: false, isError: false }),
        },
      },
    },
  },
}));

afterEach(() => cleanup());

function renderActions(mobile = false) {
  return render(
    <CartProvider>
      <HeaderQuickActions mobile={mobile} />
    </CartProvider>
  );
}

describe("HeaderQuickActions", () => {
  it("shows B2B fast order, favorites count, cart, phone, and WhatsApp on desktop", () => {
    renderActions();

    expect(screen.getByRole("link", { name: /Бърза поръчка/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Любими продукти: 2/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Количка: 0 артикула/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Телефон на MTEX PARTS/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Пиши в WhatsApp/i })).toBeTruthy();
  });

  it("shows stacked fast-order and contact actions on mobile", () => {
    renderActions(true);

    expect(screen.getByRole("link", { name: /Бърза поръчка/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Обади се на MTEX PARTS/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Пиши в WhatsApp/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Количка: 0 артикула/i })).toBeTruthy();
  });
});
