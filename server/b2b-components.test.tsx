// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import B2BRegistrationModal from "@/components/B2BRegistrationModal";
import B2BUsersManagement from "@/components/B2BUsersManagement";
import EkontSelector from "@/components/EkontSelector";
import ShoppingCartSidebarB2B from "@/components/ShoppingCartSidebarB2B";
import GlobalNavigation from "@/components/GlobalNavigation";

const mocks = vi.hoisted(() => ({
  auth: {
    user: null as any,
    isAuthenticated: false,
  },
  register: vi.fn(),
  approve: vi.fn(),
  reject: vi.fn(),
  refetch: vi.fn(),
  order: vi.fn(),
  b2bUsers: [] as any[],
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => mocks.auth,
}));

vi.mock("wouter", () => ({
  useLocation: () => ["/", vi.fn()],
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    ecommerce: {
      b2b: {
        register: {
          useMutation: () => ({ isPending: false, mutateAsync: mocks.register }),
        },
        getAllUsers: {
          useQuery: () => ({
            data: mocks.b2bUsers,
            isLoading: false,
            error: null,
            refetch: mocks.refetch,
          }),
        },
        approve: {
          useMutation: (options?: { onSuccess?: () => void }) => ({
            isPending: false,
            mutateAsync: async (userId: number) => {
              const result = await mocks.approve(userId);
              options?.onSuccess?.();
              return result;
            },
          }),
        },
        reject: {
          useMutation: (options?: { onSuccess?: () => void }) => ({
            isPending: false,
            mutateAsync: async (userId: number) => {
              const result = await mocks.reject(userId);
              options?.onSuccess?.();
              return result;
            },
          }),
        },
      },
      ekont: {
        getCities: {
          useQuery: () => ({
            data: [
              { id: "1", name: "София" },
              { id: "3", name: "Варна" },
            ],
            isLoading: false,
            error: null,
          }),
        },
        getOffices: {
          useQuery: (cityId: string) => ({
            data: cityId ? [{ id: `${cityId}-office`, name: `Еконт ${cityId}`, address: "Център" }] : [],
            isLoading: false,
            error: null,
          }),
        },
        calculateShipping: {
          useQuery: (input: { cityId: string }) => ({
            data: input?.cityId ? { cost: 8.49 } : undefined,
            isLoading: false,
            error: null,
          }),
        },
      },
      orders: {
        create: {
          useMutation: () => ({ isPending: false, mutateAsync: mocks.order }),
        },
      },
    },
  },
}));

function resetMocks() {
  mocks.auth.user = {
    id: 22,
    userType: "b2b",
    b2bApprovalStatus: "approved",
  };
  mocks.auth.isAuthenticated = true;
  mocks.register.mockReset().mockResolvedValue({});
  mocks.approve.mockReset().mockResolvedValue({});
  mocks.reject.mockReset().mockResolvedValue({});
  mocks.refetch.mockReset().mockResolvedValue(undefined);
  mocks.order.mockReset().mockResolvedValue({ id: 99 });
  mocks.b2bUsers = [
    {
      id: 7,
      name: "Иван Петров",
      email: "ivan@example.com",
      companyName: "Варна Ауто ООД",
      companyTaxId: "BG123456789",
      b2bApprovalStatus: "pending",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
  ];
}

beforeEach(() => {
  resetMocks();
  HTMLElement.prototype.hasPointerCapture = () => false;
  HTMLElement.prototype.setPointerCapture = () => {};
  HTMLElement.prototype.releasePointerCapture = () => {};
  HTMLElement.prototype.scrollIntoView = () => {};
  window.matchMedia = window.matchMedia || (() => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
});

afterEach(() => {
  cleanup();
});

describe("Rendered B2B and Ekont workflows", () => {
  it("opens and closes the mobile navigation menu", async () => {
    const user = userEvent.setup();
    render(<GlobalNavigation />);

    const menuButton = screen.getByRole("button");
    await user.click(menuButton);
    const servicesButton = screen.getByRole("button", { name: /УСЛУГИ/ });
    await user.click(servicesButton);
    expect(screen.getAllByText("АВТОЧАСТИ").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("ПЪТНА ПОМОЩ").length).toBeGreaterThanOrEqual(1);

    await user.click(servicesButton);
    await user.click(menuButton);
    expect(screen.queryByText("АВТОЧАСТИ")).toBeNull();
  });

  it("submits the real B2B registration modal and closes on success", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    render(
      <B2BRegistrationModal
        isOpen
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    await user.type(screen.getByPlaceholderText("Вашата компания"), "Варна Ауто ООД");
    await user.type(screen.getByPlaceholderText("BG123456789"), "BG987654321");
    await user.click(screen.getByRole("button", { name: "Регистрирай се" }));

    await waitFor(() => expect(mocks.register).toHaveBeenCalledWith({
      userType: "b2b",
      companyName: "Варна Ауто ООД",
      companyTaxId: "BG987654321",
    }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("renders pending users and calls admin approve and reject actions", async () => {
    const user = userEvent.setup();

    render(<B2BUsersManagement />);

    expect(screen.getByText("Варна Ауто ООД")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Одобри/ }));
    await user.click(screen.getByRole("button", { name: /Отхвърли/ }));

    expect(mocks.approve).toHaveBeenCalledWith(7);
    expect(mocks.reject).toHaveBeenCalledWith(7);
    expect(mocks.refetch).toHaveBeenCalled();
  });

  it("selects an Ekont city, resets office state, and forwards office and shipping callbacks", async () => {
    const user = userEvent.setup();
    const onCityChange = vi.fn();
    const onOfficeChange = vi.fn();
    const onShippingCostChange = vi.fn();

    render(
      <EkontSelector
        onCityChange={onCityChange}
        onOfficeChange={onOfficeChange}
        onShippingCostChange={onShippingCostChange}
      />
    );

    const citySelect = screen.getByRole("combobox");
    await user.click(citySelect);
    await user.click(screen.getByRole("option", { name: "Варна" }));

    await waitFor(() => expect(onCityChange).toHaveBeenCalledWith("3", "Варна"));
    await waitFor(() => expect(onShippingCostChange).toHaveBeenCalledWith(8.49));

    const officeSelect = screen.getAllByRole("combobox")[1];
    await user.click(officeSelect);
    await user.click(screen.getByRole("option", { name: /Еконт 3/ }));

    expect(onOfficeChange).toHaveBeenCalledWith("3-office", "Еконт 3");

    await user.click(citySelect);
    await user.click(screen.getByRole("option", { name: "София" }));
    await waitFor(() => expect(onCityChange).toHaveBeenCalledWith("1", "София"));
  });

  it("completes the actual B2B checkout with Ekont shipping and the 15% discount", async () => {
    const user = userEvent.setup();
    const onUpdateCart = vi.fn();
    const onClose = vi.fn();

    render(
      <ShoppingCartSidebarB2B
        isOpen
        onClose={onClose}
        onUpdateCart={onUpdateCart}
        cart={[{ productId: 1, name: "BMW фар", price: "100 лв.", quantity: 1, image: "" }]}
      />
    );

    await user.click(screen.getByRole("button", { name: "Оформи поръчка" }));
    await user.type(screen.getByPlaceholderText("Вашето име"), "Иван Петров");
    await user.type(screen.getByPlaceholderText("+359 888 123 456"), "+359 888 111 222");

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Варна" }));
    await waitFor(() => expect(screen.getAllByRole("combobox")).toHaveLength(2));
    await user.click(screen.getAllByRole("combobox")[1]);
    await user.click(screen.getByRole("option", { name: /Еконт 3/ }));

    expect(screen.getByText("B2B отстъпка (15%):")).toBeTruthy();
    expect(screen.getAllByText("8.49 лв.").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("93.49 лв.")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Потвърди поръчка" }));

    await waitFor(() => expect(mocks.order).toHaveBeenCalledWith(expect.objectContaining({
      customerName: "Иван Петров",
      customerPhone: "+359 888 111 222",
      econtOffice: "Еконт 3",
      totalPrice: "93.49",
    })));
    expect(onUpdateCart).toHaveBeenCalledWith([]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
