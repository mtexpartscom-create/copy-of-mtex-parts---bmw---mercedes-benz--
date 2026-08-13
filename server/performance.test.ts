import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("Frontend performance contracts", () => {
  it("lazy-loads non-home routes behind a Suspense fallback", () => {
    const app = readProjectFile("client/src/App.tsx");

    expect(app).toContain('lazy(() => import("./pages/ProductCatalog"))');
    expect(app).toContain('lazy(() => import("./pages/PartsShop"))');
    expect(app).toContain("<Suspense");
    expect(app).toContain("Зареждане...");
  });

  it("configures stable query caching and avoids mutation retries", () => {
    const main = readProjectFile("client/src/main.tsx");

    expect(main).toContain("staleTime: 60_000");
    expect(main).toContain("gcTime: 5 * 60_000");
    expect(main).toContain("refetchOnWindowFocus: false");
    expect(main).toContain("retry: 1");
    expect(main).toContain("mutations:");
    expect(main).toContain("retry: 0");
  });
});
