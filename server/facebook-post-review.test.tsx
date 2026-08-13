// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import FacebookPostReview from "@/components/FacebookPostReview";

const mocks = vi.hoisted(() => ({
  posts: [{
    id: 7,
    vehicleId: 3,
    postId: null,
    imageUrl: "https://cdn.example.com/original.jpg",
    caption: "BMW X5 OEM части",
    status: "draft" as const,
    createdAt: new Date("2026-08-12T10:00:00Z"),
    publishedAt: null,
  }],
  listings: [{ id: 3, make: "BMW", model: "X5", year: 2020, engine: "3.0d" }],
  refetchPosts: vi.fn().mockResolvedValue(undefined),
  createDraft: vi.fn().mockResolvedValue(undefined),
  updateDraft: vi.fn().mockResolvedValue(undefined),
  publish: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    crm: {
      listings: { listAdmin: { useQuery: () => ({ data: mocks.listings, isLoading: false }) } },
      facebook: {
        list: { useQuery: () => ({ data: mocks.posts, isLoading: false, isFetching: false, refetch: mocks.refetchPosts }) },
        createDraft: { useMutation: () => ({ mutateAsync: mocks.createDraft, isPending: false }) },
        updateDraft: { useMutation: () => ({ mutateAsync: mocks.updateDraft, isPending: false }) },
        publish: { useMutation: () => ({ mutateAsync: mocks.publish, isPending: false }) },
      },
    },
  },
}));

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ url: "https://cdn.example.com/replacement.jpg" }) }));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  mocks.updateDraft.mockClear();
  mocks.publish.mockClear();
});

describe("FacebookPostReview", () => {
  it("renders a reviewable draft and saves an explicit image removal", async () => {
    render(<FacebookPostReview />);

    expect(screen.getByText("BMW X5")).toBeTruthy();
    expect(screen.getByDisplayValue("BMW X5 OEM части")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Премахни изображение" }));
    fireEvent.click(screen.getByRole("button", { name: /Запази$/i }));

    await waitFor(() => expect(mocks.updateDraft).toHaveBeenCalledWith({ id: 7, caption: "BMW X5 OEM части", imageUrl: null }));
  });

  it("uploads a replacement image and persists it with the edited draft", async () => {
    render(<FacebookPostReview />);

    const input = screen.getByLabelText("Замени изображението") as HTMLInputElement;
    const replacement = new File(["image"], "replacement.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [replacement] } });
    await waitFor(() => expect((screen.getByAltText("Facebook публикация") as HTMLImageElement).getAttribute("src")).toBe("https://cdn.example.com/replacement.jpg"));
    fireEvent.click(screen.getByRole("button", { name: /Запази$/i }));

    await waitFor(() => expect(mocks.updateDraft).toHaveBeenCalledWith({ id: 7, caption: "BMW X5 OEM части", imageUrl: "https://cdn.example.com/replacement.jpg" }));
  });

  it("surfaces publish errors without losing the editable draft", async () => {
    mocks.publish.mockRejectedValueOnce(new Error("Facebook unavailable"));
    render(<FacebookPostReview />);
    fireEvent.click(screen.getByRole("button", { name: /Публикувай/ }));

    await waitFor(() => expect(screen.getByDisplayValue("BMW X5 OEM части")).toBeTruthy());
    expect(mocks.publish).toHaveBeenCalled();
  });
});
