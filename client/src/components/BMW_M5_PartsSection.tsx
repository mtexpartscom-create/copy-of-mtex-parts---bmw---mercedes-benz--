/**
 * BMW M5 Popular Parts Section
 * Displays most searched spare parts for BMW M5
 */

import { ArrowRight, Zap, Gauge, Shield, Wrench } from "lucide-react";

const POPULAR_PARTS = [
  {
    id: 1,
    name: "Спортен Издув",
    category: "Издув",
    icon: Zap,
    color: "#ef4444",
    description: "Оригинален M5 издув система",
    price: "2,499 лв.",
  },
  {
    id: 2,
    name: "M Спортни Спирачки",
    category: "Спирачна система",
    icon: Shield,
    color: "#3b82f6",
    description: "Керамични спирачни дискове",
    price: "1,899 лв.",
  },
  {
    id: 3,
    name: "Турбо Компресор",
    category: "Двигател",
    icon: Gauge,
    color: "#f59e0b",
    description: "Оригинален BMW турбо",
    price: "3,299 лв.",
  },
  {
    id: 4,
    name: "Спортни Амортисьори",
    category: "Окачване",
    icon: Wrench,
    color: "#10b981",
    description: "M Sport окачване комплект",
    price: "1,599 лв.",
  },
  {
    id: 5,
    name: "Въздушен Филтър",
    category: "Филтри",
    icon: Zap,
    color: "#8b5cf6",
    description: "Спортен въздушен филтър",
    price: "299 лв.",
  },
  {
    id: 6,
    name: "Масло за Двигател",
    category: "Течности",
    icon: Gauge,
    color: "#ec4899",
    description: "Синтетично BMW M5 масло",
    price: "89 лв.",
  },
];

export default function BMW_M5_PartsSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(3rem, 8vw, 6rem) 1rem",
        background: "#0d0e10",
        borderTop: "1px solid rgba(37,99,235,0.1)",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 1rem",
              borderRadius: 9999,
              background: "rgba(37,99,235,0.15)",
              border: "1px solid rgba(37,99,235,0.4)",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#2563eb",
                boxShadow: "0 0 8px #2563eb",
              }}
            />
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#60a5fa",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              BMW M5 Резервни Части
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#f0f0ee",
              marginBottom: "1rem",
            }}
          >
            Най-търсени части за BMW M5
          </h2>

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              color: "#9ca3af",
              lineHeight: 1.6,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Оригинални OEM резервни части за BMW M5 с гарантия и бърза доставка
          </p>
        </div>

        {/* Parts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {POPULAR_PARTS.map((part) => {
            const IconComponent = part.icon;
            return (
              <div
                key={part.id}
                style={{
                  padding: "1.5rem",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.03) 100%)",
                  border: "1px solid rgba(37,99,235,0.15)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.08) 100%)";
                  el.style.borderColor = "rgba(37,99,235,0.3)";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.03) 100%)";
                  el.style.borderColor = "rgba(37,99,235,0.15)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: `${part.color}20`,
                    marginBottom: "1rem",
                  }}
                >
                  <IconComponent size={24} color={part.color} />
                </div>

                {/* Content */}
                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#f0f0ee",
                    marginBottom: "0.5rem",
                  }}
                >
                  {part.name}
                </h3>

                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.85rem",
                    color: "#60a5fa",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {part.category}
                </p>

                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.9rem",
                    color: "#9ca3af",
                    lineHeight: 1.5,
                    marginBottom: "1rem",
                  }}
                >
                  {part.description}
                </p>

                {/* Price and CTA */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(37,99,235,0.1)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "#2563eb",
                    }}
                  >
                    {part.price}
                  </span>
                  <ArrowRight size={18} color="#60a5fa" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#inventory"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("inventory");
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.75rem",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 10,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              transition: "all 0.3s ease",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1d4ed8";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#2563eb";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Виж всички части
            <ArrowRight size={18} />
          </a>

          <a
            href="tel:+359898606626"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.75rem",
              background: "transparent",
              color: "#60a5fa",
              borderRadius: 10,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              transition: "all 0.3s ease",
              border: "1px solid rgba(37,99,235,0.3)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.1)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.3)";
            }}
          >
            Обади се
          </a>
        </div>
      </div>
    </section>
  );
}
