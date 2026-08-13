/*
  MTEX PARTS – Home Page (Restructured)
  Design: Premium Dark Automotive Corporate
  Clean entry point with 6 service cards
  All detailed content moved to subpages
*/

import GlobalNavigation from "@/components/GlobalNavigation";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const SERVICE_CARDS = [
  {
    id: 1,
    title: "АВТОМОРГА",
    description: "Каталог автомобили за части",
    buttonText: "Разгледай автомобилите",
    href: "/catalog",
    icon: "🚗",
    color: "#3b82f6",
  },
  {
    id: 2,
    title: "АВТОЧАСТИ",
    description: "Онлайн магазин за авточасти",
    buttonText: "Към онлайн магазина",
    href: "/parts-shop",
    icon: "⚙️",
    color: "#06b6d4",
  },
  {
    id: 3,
    title: "АВТОСЕРВИЗ",
    description: "Ремонт, диагностика и поддръжка на автомобили",
    buttonText: "Запази час",
    href: "/auto-service-detail",
    icon: "🔧",
    color: "#8b5cf6",
  },
  {
    id: 4,
    title: "АВТОКЛИМАТИЦИ",
    description: "Зареждане и обслужване на автомобилни климатични системи",
    buttonText: "Виж услугата",
    href: "/ac-service",
    icon: "❄️",
    color: "#ec4899",
  },
  {
    id: 5,
    title: "ПЪТНА ПОМОЩ",
    description: "Бърза пътна помощ и транспорт на автомобили",
    buttonText: "Повикай пътна помощ",
    href: "/road-assistance",
    icon: "🚨",
    color: "#f59e0b",
  },
  {
    id: 6,
    title: "ПРОДАЙ АВТОМОБИЛА СИ",
    description: "Изпрати информация за автомобила си и получи предложение",
    buttonText: "Изпрати автомобила",
    href: "/sell-car",
    icon: "💰",
    color: "#10b981",
  },
];

export default function HomeRestructured() {
  return (
    <div style={{ background: "#0d0e10", minHeight: "100vh" }}>
      <GlobalNavigation />
      <HeroSection />

      {/* Services Cards Section */}
      <section
        id="services"
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 5vw, 2.5rem)",
              fontWeight: 800,
              color: "#f0f0ee",
              marginBottom: "1rem",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            НАШИ УСЛУГИ
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#9ca3af",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Всичко което трябва на вашия BMW или Mercedes-Benz
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "2rem",
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICE_CARDS.map(card => (
            <a
              key={card.id}
              href={card.href}
              style={{
                display: "block",
                textDecoration: "none",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "2rem",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,0.04)";
                el.style.borderColor = card.color;
                el.style.transform = "translateY(-8px)";
                el.style.boxShadow = `0 20px 40px ${card.color}20`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,0.02)";
                el.style.borderColor = "rgba(255,255,255,0.08)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                }}
              >
                {card.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#f0f0ee",
                  marginBottom: "0.5rem",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#9ca3af",
                  marginBottom: "1.5rem",
                  lineHeight: 1.6,
                }}
              >
                {card.description}
              </p>

              {/* Button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: card.color,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  transition: "gap 0.3s ease",
                }}
              >
                {card.buttonText}
                <ArrowRight size={16} />
              </div>

              {/* Accent Line */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: card.color,
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.3s ease",
                }}
              />
            </a>
          ))}
        </div>
      </section>

      {/* Why Us Section */}
      <section
        id="about"
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 5vw, 2.5rem)",
              fontWeight: 800,
              color: "#f0f0ee",
              marginBottom: "2rem",
              textAlign: "center",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            ЗАЩО MTEXPARTS
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
            {[
              {
                title: "Оригинални части",
                desc: "Само оригинални BMW и Mercedes-Benz части",
              },
              {
                title: "Експертна поддръжка",
                desc: "Професионален екип с години опит",
              },
              {
                title: "Бърза доставка",
                desc: "Доставка в рамките на 24-48 часа",
              },
              { title: "Конкурентни цени", desc: "Най-добрите цени на пазара" },
              { title: "24/7 Поддръжка", desc: "Винаги готови да помогнем" },
              { title: "Гаранция", desc: "Гаранция на всички услуги и части" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "1.5rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#60a5fa",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#9ca3af",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 5vw, 2.5rem)",
              fontWeight: 800,
              color: "#f0f0ee",
              marginBottom: "1rem",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            НУЖНА ВИ ПОМОЩ?
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#9ca3af",
              marginBottom: "2rem",
              lineHeight: 1.8,
            }}
          >
            Свържете се с нас днес и получете професионална консултация за вашия
            автомобил
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="tel:+359898606626"
              style={{
                padding: "0.75rem 2rem",
                background: "#60a5fa",
                color: "#0d0e10",
                textDecoration: "none",
                borderRadius: 8,
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "#3b82f6";
                (e.currentTarget as HTMLElement).style.transform =
                  "scale(1.05)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "#60a5fa";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              📞 Обади се
            </a>
            <a
              href="mailto:mtex.parts.service@gmail.com"
              style={{
                padding: "0.75rem 2rem",
                background: "rgba(255,255,255,0.1)",
                color: "#f0f0ee",
                textDecoration: "none",
                borderRadius: 8,
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.15)";
                (e.currentTarget as HTMLElement).style.transform =
                  "scale(1.05)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              ✉️ Изпрати имейл
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
