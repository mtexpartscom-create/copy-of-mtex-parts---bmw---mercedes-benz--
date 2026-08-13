import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("Mobile responsiveness contracts", () => {
  it("keeps the mobile hamburger menu and desktop navigation breakpoints", () => {
    const navigation = readProjectFile("client/src/components/GlobalNavigation.tsx");

    expect(navigation).toContain('className="md:hidden"');
    expect(navigation).toContain('className="hidden md:flex"');
    expect(navigation).toContain("setMobileOpen(!mobileOpen)");
    expect(navigation).toContain("setMobileOpen(false)");
  });

  it("uses mobile-first contact form rows and restores two columns at the sm breakpoint", () => {
    const stylesheet = readProjectFile("client/src/index.css");
    const contact = readProjectFile("client/src/components/ContactSection.tsx");

    expect(contact).toContain('className="contact-form-row"');
    expect(stylesheet).toContain(".contact-form-row");
    expect(stylesheet).toContain("grid-template-columns: 1fr;");
    expect(stylesheet).toContain("grid-template-columns: 1fr 1fr;");
  });

  it("keeps service-page advantages and hero actions usable on narrow screens", () => {
    const stylesheet = readProjectFile("client/src/index.css");
    const servicePage = readProjectFile("client/src/pages/AutoServiceDetail.tsx");

    expect(servicePage).toContain('className="advantages-grid"');
    expect(servicePage).toContain('className="service-hero-cta"');
    expect(stylesheet).toContain(".advantages-grid");
    expect(stylesheet).toContain(".service-hero-cta > button");
    expect(stylesheet).toContain("width: 100%;");
  });

  it("loads the hero image eagerly while preserving lazy loading for below-the-fold images", () => {
    const lazyImage = readProjectFile("client/src/components/LazyImage.tsx");
    const hero = readProjectFile("client/src/components/HeroSection.tsx");

    expect(lazyImage).toContain("priority?: boolean");
    expect(lazyImage).toContain('loading={priority ? "eager" : "lazy"}');
    expect(lazyImage).toContain('fetchPriority={priority ? "high" : "auto"}');
    expect(hero).toContain("priority");
  });
});
