/*
  MTEX PARTS – Parts Shop Page
  Online store for automotive parts
  Displays parts catalog with filters and search
*/

import GlobalNavigation from "@/components/GlobalNavigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { useEffect } from "react";
import { setSEOMetadata, SEO_PAGES } from "@/lib/seo";
import { Search, Filter, ShoppingCart } from "lucide-react";

export default function PartsShop() {
  useEffect(() => {
    setSEOMetadata(SEO_PAGES.partsShop || {
      title: "Онлайн магазин за авточасти | MTEX PARTS",
      description: "Разгледайте нашия каталог с авточасти за BMW и Mercedes-Benz. Оригинални и качествени части.",
      keywords: "авточасти, онлайн магазин, BMW, Mercedes-Benz, части за автомобили",
    });
  }, []);

  const PARTS_CATEGORIES = [
    { name: "Двигател", icon: "🔧", count: 245 },
    { name: "Спирачна система", icon: "🛑", count: 189 },
    { name: "Ходова част", icon: "🚗", count: 312 },
    { name: "Електрика", icon: "⚡", count: 156 },
    { name: "Охлаждане", icon: "❄️", count: 98 },
    { name: "Издув", icon: "💨", count: 67 },
  ];

  const FEATURED_PARTS = [
    {
      id: 1,
      name: "Спортни спирачки M Performance",
      brand: "BMW",
      price: "1,899 лв.",
      image: "🛑",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Турбо компресор",
      brand: "Mercedes-Benz",
      price: "3,299 лв.",
      image: "⚡",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Амортисьори спортни",
      brand: "BMW",
      price: "1,599 лв.",
      image: "🚗",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Масло за двигател 5W-30",
      brand: "Motul",
      price: "89 лв.",
      image: "🔧",
      rating: 4.6,
    },
  ];

  return (
    <div style={{ background: "#0d0e10", minHeight: "100vh" }}>
      <GlobalNavigation />
      <Breadcrumb items={[
        { label: "Начало", href: "/" },
        { label: "Услуги", href: "#" },
        { label: "Авточасти" },
      ]} />

      {/* Hero Section */}
      <section
        style={{
          padding: "4rem 1rem",
          maxWidth: 1280,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "#f0f0ee",
            marginBottom: "1rem",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Онлайн магазин за авточасти
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#9ca3af",
            marginBottom: "2rem",
            maxWidth: 600,
            margin: "0 auto 2rem",
          }}
        >
          Качествени оригинални и аналогни части за BMW и Mercedes-Benz
        </p>

        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            maxWidth: 600,
            margin: "0 auto 3rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 250,
              display: "flex",
              alignItems: "center",
              background: "#1a1b1f",
              border: "1px solid #2d2e34",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
            }}
          >
            <Search size={20} style={{ color: "#60a5fa", marginRight: "0.5rem" }} />
            <input
              type="text"
              placeholder="Търси части..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "#f0f0ee",
                fontSize: "1rem",
              }}
            />
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "#2563eb";
            }}
          >
            <Filter size={18} />
            Филтри
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section
        style={{
          padding: "2rem 1rem",
          maxWidth: 1280,
          margin: "0 auto",
          marginBottom: "3rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#f0f0ee",
            marginBottom: "2rem",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Категории
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          {PARTS_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              style={{
                padding: "1.5rem",
                background: "#1a1b1f",
                border: "1px solid #2d2e34",
                borderRadius: "0.75rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#252a33";
                el.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#1a1b1f";
                el.style.borderColor = "#2d2e34";
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {cat.icon}
              </div>
              <div style={{ color: "#f0f0ee", fontWeight: 600, marginBottom: "0.25rem" }}>
                {cat.name}
              </div>
              <div style={{ color: "#60a5fa", fontSize: "0.875rem" }}>
                {cat.count} части
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Parts */}
      <section
        style={{
          padding: "2rem 1rem",
          maxWidth: 1280,
          margin: "0 auto",
          marginBottom: "3rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#f0f0ee",
            marginBottom: "2rem",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Препоръчани части
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {FEATURED_PARTS.map((part) => (
            <div
              key={part.id}
              style={{
                background: "#1a1b1f",
                border: "1px solid #2d2e34",
                borderRadius: "0.75rem",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#2563eb";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#2d2e34";
                el.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  padding: "2rem",
                  background: "#252a33",
                  textAlign: "center",
                  fontSize: "3rem",
                }}
              >
                {part.image}
              </div>
              <div style={{ padding: "1.5rem" }}>
                <div style={{ color: "#60a5fa", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  {part.brand}
                </div>
                <h3
                  style={{
                    color: "#f0f0ee",
                    fontWeight: 600,
                    marginBottom: "1rem",
                    minHeight: "2.5rem",
                  }}
                >
                  {part.name}
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ color: "#2563eb", fontSize: "1.25rem", fontWeight: 700 }}>
                    {part.price}
                  </div>
                  <div style={{ color: "#f59e0b", fontSize: "0.875rem" }}>
                    ⭐ {part.rating}
                  </div>
                </div>
                <button
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background = "#1d4ed8";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background = "#2563eb";
                  }}
                >
                  <ShoppingCart size={18} />
                  Добави в кошница
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "3rem 1rem",
          maxWidth: 1280,
          margin: "0 auto",
          textAlign: "center",
          marginBottom: "3rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#f0f0ee",
            marginBottom: "1rem",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Не намираш каквото ти трябва?
        </h2>
        <p
          style={{
            color: "#9ca3af",
            marginBottom: "2rem",
          }}
        >
          Свържи се с нас и ние ще ти помогнем да намериш точната част
        </p>
        <button
          style={{
            padding: "0.75rem 2rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1rem",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.background = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.background = "#2563eb";
          }}
        >
          Свържи се с нас
        </button>
      </section>

      <Footer />
    </div>
  );
}
