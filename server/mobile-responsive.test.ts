import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("Mobile responsiveness contracts", () => {
  it("keeps the mobile hamburger menu and desktop navigation breakpoints", () => {
    const navigation = readProjectFile(
      "client/src/components/GlobalNavigation.tsx"
    );

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
    const servicePage = readProjectFile(
      "client/src/pages/AutoServiceDetail.tsx"
    );

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
  it("uses mobile-safe hero typography and compressed vertical rhythm", () => {
    const hero = readProjectFile("client/src/components/HeroSection.tsx");

    expect(hero).toContain("clamp(1.65rem, 8vw, 3.5rem)");
    expect(hero).toContain("clamp(1.5rem, 7vh, 5rem)");
    expect(hero).toContain("clamp(1.75rem, 6vw, 2.5rem)");
  });

  it("prevents narrow testimonial columns and oversized social-bar spacing", () => {
    const reviews = readProjectFile("client/src/components/ReviewsSection.tsx");

    expect(reviews).toContain(
      "repeat(auto-fit, minmax(min(100%, 280px), 1fr))"
    );
    expect(reviews).toContain("clamp(1.25rem, 5vw, 2.5rem)");
    expect(reviews).toContain("clamp(2rem, 6vh, 4rem)");
  });

  it("stacks checkout and VIN-derived fields on phones", () => {
    const checkout = readProjectFile("client/src/pages/Checkout.tsx");
    const contact = readProjectFile(
      "client/src/components/ContactFormWithVin.tsx"
    );

    expect(checkout).toContain("grid-cols-1 gap-4 sm:grid-cols-2");
    expect(contact).toContain(
      "grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
    );
  });

  it("keeps the responsive image contract and breakpoint layers in the global stylesheet", () => {
    const stylesheet = readProjectFile("client/src/index.css");

    expect(stylesheet).toContain("max-width: 100%;");
    expect(stylesheet).toContain("height: auto;");
    expect(stylesheet).toContain("@media (min-width: 640px)");
    expect(stylesheet).toContain("@media (min-width: 768px)");
    expect(stylesheet).toContain("@media (min-width: 1024px)");
  });

  it("stacks public service form rows before the sm breakpoint", () => {
    const stylesheet = readProjectFile("client/src/index.css");
    const acService = readProjectFile("client/src/pages/ACService.tsx");
    const sellCar = readProjectFile("client/src/pages/SellCar.tsx");
    const about = readProjectFile("client/src/components/AboutSection.tsx");
    const map = readProjectFile("client/src/components/MapSection.tsx");
    const services = readProjectFile(
      "client/src/components/ServicesSection.tsx"
    );
    const vin = readProjectFile("client/src/components/VinDecoderInput.tsx");
    const whyUs = readProjectFile("client/src/components/WhyUsStrip.tsx");

    expect(acService).toContain('className="service-date-row"');
    expect(sellCar).toContain('className="sell-car-form-row"');
    expect(stylesheet).toContain(".service-date-row");
    expect(stylesheet).toContain(".sell-car-form-row");
    expect(stylesheet).toContain(
      "grid-template-columns: repeat(2, minmax(0, 1fr));"
    );
    expect(about).toContain("about-values-grid");
    expect(map).toContain('className="map-location-grid"');
    expect(services).toContain('className="service-feature-grid"');
    expect(vin).toContain("grid-cols-1 gap-4 text-sm sm:grid-cols-2");
    expect(map).toContain('height: "clamp(280px, 70vw, 500px)"');
    expect(whyUs).toContain("why-us-features-grid");
    expect(whyUs).toContain("min(100%, 160px)");
    expect(whyUs).not.toContain("width: '1280px'");
  });
});
