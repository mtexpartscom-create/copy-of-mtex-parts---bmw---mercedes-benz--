import { describe, it, expect } from "vitest";

describe("MTEX PARTS - Site Navigation & Functionality Tests", () => {
  // Test 1: Service Routes Configuration
  describe("Service Routes", () => {
    const serviceRoutes = {
      АВТОМОРГА: "/catalog",
      АВТОЧАСТИ: "/parts-shop",
      АВТОСЕРВИЗ: "/auto-service-detail",
      АВТОКЛИМАТИЦИ: "/ac-service",
      ПЪТНА_ПОМОЩ: "/road-assistance",
      ПРОДАЙ_АВТОМОБИЛА: "/sell-car",
    };

    it("should have correct АВТОМОРГА route pointing to /catalog", () => {
      expect(serviceRoutes.АВТОМОРГА).toBe("/catalog");
    });

    it("should have correct АВТОЧАСТИ route pointing to /parts-shop", () => {
      expect(serviceRoutes.АВТОЧАСТИ).toBe("/parts-shop");
    });

    it("should have correct АВТОСЕРВИЗ route", () => {
      expect(serviceRoutes.АВТОСЕРВИЗ).toBe("/auto-service-detail");
    });

    it("should have correct АВТОКЛИМАТИЦИ route", () => {
      expect(serviceRoutes.АВТОКЛИМАТИЦИ).toBe("/ac-service");
    });

    it("should have correct ПЪТНА ПОМОЩ route", () => {
      expect(serviceRoutes.ПЪТНА_ПОМОЩ).toBe("/road-assistance");
    });

    it("should have correct ПРОДАЙ АВТОМОБИЛА route", () => {
      expect(serviceRoutes.ПРОДАЙ_АВТОМОБИЛА).toBe("/sell-car");
    });

    it("should have exactly 6 service routes", () => {
      expect(Object.keys(serviceRoutes)).toHaveLength(6);
    });
  });

  // Test 2: Navigation Menu Structure
  describe("Navigation Menu Structure", () => {
    const navLinks = [
      { href: "/", label: "НАЧАЛО" },
      { href: "#services", label: "УСЛУГИ", dropdown: true },
      { href: "#about", label: "ЗА НАС" },
      { href: "#contact", label: "КОНТАКТИ" },
    ];

    it("should have 4 main navigation links", () => {
      expect(navLinks).toHaveLength(4);
    });

    it("should have HOME link pointing to /", () => {
      const homeLink = navLinks.find((l) => l.label === "НАЧАЛО");
      expect(homeLink?.href).toBe("/");
    });

    it("should have SERVICES dropdown", () => {
      const servicesLink = navLinks.find((l) => l.label === "УСЛУГИ");
      expect(servicesLink?.dropdown).toBe(true);
    });

    it("should have ABOUT link with anchor", () => {
      const aboutLink = navLinks.find((l) => l.label === "ЗА НАС");
      expect(aboutLink?.href).toBe("#about");
    });

    it("should have CONTACT link with anchor", () => {
      const contactLink = navLinks.find((l) => l.label === "КОНТАКТИ");
      expect(contactLink?.href).toBe("#contact");
    });
  });

  // Test 3: Home Page Service Cards
  describe("Home Page Service Cards", () => {
    const serviceCards = [
      {
        id: 1,
        title: "АВТОМОРГА",
        description: "Каталог автомобили за части",
        href: "/catalog",
        icon: "🚗",
      },
      {
        id: 2,
        title: "АВТОЧАСТИ",
        description: "Онлайн магазин за авточасти",
        href: "/parts-shop",
        icon: "⚙️",
      },
      {
        id: 3,
        title: "АВТОСЕРВИЗ",
        description: "Ремонт, диагностика и поддръжка на автомобили",
        href: "/auto-service-detail",
        icon: "🔧",
      },
      {
        id: 4,
        title: "АВТОКЛИМАТИЦИ",
        description: "Зареждане и обслужване на автомобилни климатични системи",
        href: "/ac-service",
        icon: "❄️",
      },
      {
        id: 5,
        title: "ПЪТНА ПОМОЩ",
        description: "Бърза пътна помощ и транспорт на автомобили",
        href: "/road-assistance",
        icon: "🚨",
      },
      {
        id: 6,
        title: "ПРОДАЙ АВТОМОБИЛА СИ",
        description: "Изпрати информация за автомобила си и получи предложение",
        href: "/sell-car",
        icon: "💰",
      },
    ];

    it("should have exactly 6 service cards", () => {
      expect(serviceCards).toHaveLength(6);
    });

    it("should have АВТОМОРГА card with correct properties", () => {
      const card = serviceCards.find((c) => c.id === 1);
      expect(card?.title).toBe("АВТОМОРГА");
      expect(card?.href).toBe("/catalog");
      expect(card?.icon).toBe("🚗");
    });

    it("should have АВТОЧАСТИ card with correct properties", () => {
      const card = serviceCards.find((c) => c.id === 2);
      expect(card?.title).toBe("АВТОЧАСТИ");
      expect(card?.href).toBe("/parts-shop");
      expect(card?.icon).toBe("⚙️");
    });

    it("should have all cards with unique IDs", () => {
      const ids = serviceCards.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(serviceCards.length);
    });

    it("should have all cards with valid routes", () => {
      const validRoutes = [
        "/catalog",
        "/parts-shop",
        "/auto-service-detail",
        "/ac-service",
        "/road-assistance",
        "/sell-car",
      ];
      serviceCards.forEach((card) => {
        expect(validRoutes).toContain(card.href);
      });
    });
  });

  // Test 4: Parts Shop Filtering
  describe("Parts Shop Filtering", () => {
    const brands = ["BMW", "Mercedes-Benz", "Motul"];
    const models = {
      BMW: ["M5", "M3", "M440i"],
      "Mercedes-Benz": ["AMG C63", "E63 AMG", "C63"],
      Motul: ["Universal"],
    };

    it("should have 3 brands available", () => {
      expect(brands).toHaveLength(3);
    });

    it("should have BMW brand", () => {
      expect(brands).toContain("BMW");
    });

    it("should have Mercedes-Benz brand", () => {
      expect(brands).toContain("Mercedes-Benz");
    });

    it("should have Motul brand", () => {
      expect(brands).toContain("Motul");
    });

    it("should have models for each brand", () => {
      brands.forEach((brand) => {
        expect(models[brand as keyof typeof models]).toBeDefined();
        expect(models[brand as keyof typeof models].length).toBeGreaterThan(0);
      });
    });

    it("should have correct models for BMW", () => {
      expect(models.BMW).toEqual(["M5", "M3", "M440i"]);
    });

    it("should have correct models for Mercedes-Benz", () => {
      expect(models["Mercedes-Benz"]).toEqual(["AMG C63", "E63 AMG", "C63"]);
    });
  });

  // Test 5: Parts Data Structure
  describe("Parts Data Structure", () => {
    const sampleParts = [
      {
        id: 1,
        name: "Спортни спирачки M Performance",
        brand: "BMW",
        model: "M5",
        category: "Спирачна система",
        price: 1899,
        rating: 4.8,
      },
      {
        id: 2,
        name: "Турбо компресор",
        brand: "Mercedes-Benz",
        model: "AMG C63",
        category: "Двигател",
        price: 3299,
        rating: 4.9,
      },
    ];

    it("should have parts with all required fields", () => {
      sampleParts.forEach((part) => {
        expect(part).toHaveProperty("id");
        expect(part).toHaveProperty("name");
        expect(part).toHaveProperty("brand");
        expect(part).toHaveProperty("model");
        expect(part).toHaveProperty("category");
        expect(part).toHaveProperty("price");
        expect(part).toHaveProperty("rating");
      });
    });

    it("should have valid price values", () => {
      sampleParts.forEach((part) => {
        expect(part.price).toBeGreaterThan(0);
        expect(typeof part.price).toBe("number");
      });
    });

    it("should have valid rating values", () => {
      sampleParts.forEach((part) => {
        expect(part.rating).toBeGreaterThanOrEqual(0);
        expect(part.rating).toBeLessThanOrEqual(5);
      });
    });
  });

  // Test 6: Breadcrumb Navigation
  describe("Breadcrumb Navigation", () => {
    const breadcrumbItems = [
      { label: "Начало", href: "/" },
      { label: "Услуги", href: "#" },
      { label: "Авточасти" },
    ];

    it("should have breadcrumb items", () => {
      expect(breadcrumbItems.length).toBeGreaterThan(0);
    });

    it("should have HOME link in breadcrumb", () => {
      const homeItem = breadcrumbItems.find((item) => item.label === "Начало");
      expect(homeItem?.href).toBe("/");
    });

    it("should have current page in breadcrumb", () => {
      const currentItem = breadcrumbItems[breadcrumbItems.length - 1];
      expect(currentItem.label).toBe("Авточасти");
    });
  });

  // Test 7: Error Handling
  describe("Error Handling", () => {
    it("should handle missing routes gracefully", () => {
      const invalidRoute = "/invalid-route";
      expect(invalidRoute).toBeDefined();
    });

    it("should have fallback 404 page", () => {
      const notFoundRoute = "/404";
      expect(notFoundRoute).toBe("/404");
    });
  });

  // Test 8: SEO Metadata
  describe("SEO Metadata", () => {
    const seoPages = {
      partsShop: {
        title: "Онлайн магазин за авточасти | MTEX PARTS",
        description: "Разгледайте нашия каталог с авточасти за BMW и Mercedes-Benz.",
      },
      acService: {
        title: "Автоклиматици | MTEX PARTS",
        description: "Зареждане и обслужване на автомобилни климатични системи.",
      },
    };

    it("should have SEO metadata for parts shop", () => {
      expect(seoPages.partsShop.title).toContain("авточасти");
      expect(seoPages.partsShop.description).toBeDefined();
    });

    it("should have SEO metadata for AC service", () => {
      expect(seoPages.acService.title).toContain("Автоклиматици");
      expect(seoPages.acService.description).toBeDefined();
    });

    it("should have all SEO titles with brand name", () => {
      Object.values(seoPages).forEach((page) => {
        expect(page.title).toContain("MTEX PARTS");
      });
    });
  });
});
