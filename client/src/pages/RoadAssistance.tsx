/*
  MTEX PARTS – Road Assistance Page
  Пътна помощ 24/7
*/

import GlobalNavigation from "@/components/GlobalNavigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Phone, AlertCircle, Clock, MapPin, Zap } from "lucide-react";
import { useEffect } from "react";
import { setSEOMetadata, SEO_PAGES } from "@/lib/seo";

const SERVICES = [
  { title: "Техническа помощ", icon: "🔧", desc: "Авариен ремонт на място" },
  { title: "Буксиране", icon: "🚗", desc: "Безопасно буксиране до сервиз" },
  { title: "Смяна на гума", icon: "🛞", desc: "Бързо решение на място" },
  { title: "Батерия", icon: "🔋", desc: "Смяна или зареждане" },
  { title: "Гориво", icon: "⛽", desc: "Доставка на гориво" },
  { title: "Заключване", icon: "🔐", desc: "Отключване на автомобил" },
];

export default function RoadAssistance() {
  useEffect(() => {
    setSEOMetadata(SEO_PAGES.roadAssistance);
  }, []);

  return (
    <div style={{ background: "#0d0e10", minHeight: "100vh" }}>
      <GlobalNavigation />
      <Breadcrumb
        items={[
          { label: "Начало", href: "/" },
          { label: "Услуги", href: "#" },
          { label: "Пътна помощ" },
        ]}
      />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1d22 0%, #15171a 100%)",
          padding: "clamp(4.5rem, 10vw, 6rem) 1rem clamp(2.5rem, 7vw, 4rem)",
          textAlign: "center",
          marginTop: 70,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.7rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "#f0f0ee",
            marginBottom: "1rem",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          🚨 ПЪТНА ПОМОЩ 24/7
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#9ca3af",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Професионална помощ при всякакви технически проблеми на пътя
        </p>
      </div>

      {/* Emergency Call Section */}
      <section
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          background: "rgba(239, 68, 68, 0.1)",
          borderTop: "2px solid rgba(239, 68, 68, 0.3)",
          borderBottom: "2px solid rgba(239, 68, 68, 0.3)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#ef4444",
              marginBottom: "1rem",
            }}
          >
            ⚠️ СПЕШНА ПОМОЩ
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#9ca3af",
              marginBottom: "2rem",
            }}
          >
            Ако имате проблем на пътя, обадете се веднага:
          </p>
          <a
            href="tel:+359898606626"
            style={{
              display: "inline-block",
              padding: "1rem clamp(1.25rem, 6vw, 3rem)",
              background: "#ef4444",
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: 700,
              borderRadius: 12,
              textDecoration: "none",
              transition: "all 0.3s ease",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#dc2626";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "#ef4444";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            📞 +359 898 606 626
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.55rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "#f0f0ee",
            marginBottom: "2rem",
            textAlign: "center",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          УСЛУГИ
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "2rem",
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "clamp(1.25rem, 4vw, 2rem)",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(239, 68, 68, 0.1)";
                (e.currentTarget as HTMLElement).style.borderColor = "#ef4444";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.08)";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                {service.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#f0f0ee",
                  marginBottom: "0.5rem",
                }}
              >
                {service.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.55rem, 4vw, 2rem)",
              fontWeight: 700,
              color: "#f0f0ee",
              marginBottom: "2rem",
              textAlign: "center",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            КАК РАБОТИ
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
              gap: "2rem",
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  background: "#60a5fa",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.5rem",
                }}
              >
                1️⃣
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#f0f0ee",
                  marginBottom: "0.5rem",
                }}
              >
                Обадете се
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                Позвънете на номера за спешна помощ
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  background: "#60a5fa",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.5rem",
                }}
              >
                2️⃣
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#f0f0ee",
                  marginBottom: "0.5rem",
                }}
              >
                Дайте локация
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                Съобщете точното си местоположение
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  background: "#60a5fa",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.5rem",
                }}
              >
                3️⃣
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#f0f0ee",
                  marginBottom: "0.5rem",
                }}
              >
                Пристигаме
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                Екипажът ни пристига в 15-30 минути
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.55rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "#f0f0ee",
            marginBottom: "2rem",
            textAlign: "center",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          ЦЕНИ
        </h2>

        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span style={{ color: "#9ca3af" }}>Техническа помощ</span>
            <span style={{ color: "#10b981", fontWeight: 600 }}>49 лв.</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span style={{ color: "#9ca3af" }}>Буксиране (до 50км)</span>
            <span style={{ color: "#10b981", fontWeight: 600 }}>99 лв.</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span style={{ color: "#9ca3af" }}>Смяна на гума</span>
            <span style={{ color: "#10b981", fontWeight: 600 }}>39 лв.</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#9ca3af" }}>Доставка на гориво</span>
            <span style={{ color: "#10b981", fontWeight: 600 }}>29 лв.</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
