/*
  MTEX PARTS – Services Section
  Design: Three service cards with image, icon, feature list
  Services: Авточасти, Автосервиз, Пътна Помощ
*/

import { useEffect, useRef } from "react";
import { Settings, Wrench, Truck, ArrowRight, CheckCircle2, Zap, Cog, Shield } from "lucide-react";

const SERVICES = [
  {
    id: "parts",
    icon: <Settings size={28} strokeWidth={1.5} />,
    iconColor: "#1c69d4",
    iconBg: "rgba(28,105,212,0.12)",
    title: "АВТОМОРГА",
    subtitle: "OEM Употребявани Части",
    image: "/manus-storage/DTC_JPG_WEB_FORMAAT_Tweede_Keuze00064_4da18195.jpg",
    description: "Широк асортимент от употребявани OEM авточасти за BMW и Mercedes-Benz. Двигатели, скоростни кутии, ходова, електроника и каросерия.",
    features: [
      "Двигатели и агрегати",
      "Скоростни кутии",
      "Ходова и спирачна система",
      "Електроника и оптика",
      "Каросерийни части",
      "Интериор и екстериор",
    ],
    cta: { label: "Каталог с автомобили за части", href: "#contact" },
    featured: false,
  },
  {
    id: "service",
    icon: <Wrench size={28} strokeWidth={1.5} />,
    iconColor: "#c41230",
    iconBg: "rgba(196,18,48,0.12)",
    title: "АВТОСЕРВИЗ",
    subtitle: "Професионален Ремонт",
    image: "/manus-storage/DTC_JPG_WEB_FORMAAT_Tweede_Keuze00064_4da18195.jpg",
    description: "Професионален сервиз за BMW и Mercedes-Benz. Диагностика, ремонт и поддръжка от опитни техници с богат опит.",
    features: [
      "Компютърна диагностика",
      "Ремонт на двигатели",
      "Смяна на масло и филтри",
      "Ремонт на ходова",
      "Спирачна система",
      "Електрически системи",
    ],
    cta: { label: "Разбери повече", href: "#contact" },
    featured: true,
  },
  {
    id: "roadside",
    icon: <Truck size={28} strokeWidth={1.5} />,
    iconColor: "#f59e0b",
    iconBg: "rgba(245,158,11,0.12)",
    title: "ПЪТНА ПОМОЩ",
    subtitle: "24/7 При Нужда",
    image: "/manus-storage/post_bmw_drive_da575e6f.webp",
    description: "Бърза и надеждна пътна помощ при нужда. Налични 24/7 за спешни случаи в Варна и региона.",
    features: [
      "Пътна помощ 24/7",
      "Теглене на автомобил",
      "Помощ при аварии",
      "Бърза реакция",
      "Покритие на Варна",
      "Спешни случаи",
    ],
    cta: { label: "Обади се сега", href: "tel:+359898606626" },
    featured: false,
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    const els = sectionRef.current?.querySelectorAll(".fade-up");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        background: "#0d0e10",
        padding: "7rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(circle at 80% 20%, rgba(28,105,212,0.04) 0%, transparent 50%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", position: "relative" }}>
        {/* Section header */}
        <div className="fade-up" style={{ marginBottom: "4rem", maxWidth: 600 }}>
          <div className="section-tag" style={{ marginBottom: "1.25rem" }}>Нашите Услуги</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "#f0f0ee",
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
            lineHeight: 1.1,
          }}>
            Всичко за Вашия BMW<br />и Mercedes-Benz
          </h2>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "1.05rem",
            color: "#9ca3af",
            lineHeight: 1.7,
          }}>
            Предлагаме пълен набор от услуги – от продажба на авточасти до пътна помощ.
            Специализирани изключително в BMW и Mercedes-Benz.
          </p>
        </div>

        {/* Services grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}>
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              className={`fade-up delay-${(i + 1) * 100}`}
              style={{
                background: service.featured ? "#15171a" : "#15171a",
                border: service.featured
                  ? "1px solid rgba(28,105,212,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                overflow: "hidden",
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                position: "relative",
                boxShadow: service.featured ? "0 0 40px rgba(28,105,212,0.08)" : "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = service.featured
                  ? "0 20px 60px rgba(28,105,212,0.2)"
                  : "0 20px 60px rgba(0,0,0,0.5)";
                el.style.borderColor = service.featured
                  ? "rgba(28,105,212,0.5)"
                  : "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.boxShadow = service.featured ? "0 0 40px rgba(28,105,212,0.08)" : "none";
                el.style.borderColor = service.featured
                  ? "rgba(28,105,212,0.3)"
                  : "rgba(255,255,255,0.06)";
              }}
            >
              {/* Featured badge */}
              {service.featured && (
                <div style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 2,
                  padding: "0.25rem 0.75rem",
                  background: "#1c69d4",
                  color: "#fff",
                  borderRadius: 9999,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  Популярно
                </div>
              )}

              {/* Service image */}
              <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                <img
                  src={service.image}
                  alt={service.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(21,23,26,0.9) 0%, rgba(21,23,26,0.2) 60%, transparent 100%)",
                }} />
                {/* Icon overlay */}
                <div style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: service.iconBg,
                  border: `1px solid ${service.iconColor}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: service.iconColor,
                  backdropFilter: "blur(8px)",
                }}>
                  {service.icon}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "1.5rem" }}>
                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: service.iconColor,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}>
                    {service.subtitle}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "#f0f0ee",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.75rem",
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.9rem",
                  color: "#9ca3af",
                  lineHeight: 1.65,
                  marginBottom: "1.25rem",
                }}>
                  {service.description}
                </p>

                {/* Feature list */}
                <ul style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.4rem",
                  marginBottom: "1.5rem",
                }}>
                  {service.features.map((feat, j) => (
                    <li key={j} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.8rem",
                      color: "#9ca3af",
                    }}>
                      <CheckCircle2 size={13} color={service.iconColor} strokeWidth={2} style={{ flexShrink: 0 }} />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={service.cta.href}
                  onClick={service.cta.href.startsWith("#") ? (e) => {
                    e.preventDefault();
                    const el = document.querySelector(service.cta.href);
                    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
                  } : undefined}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: service.iconColor,
                    textDecoration: "none",
                    transition: "gap 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.gap = "0.65rem")}
                  onMouseLeave={(e) => (e.currentTarget.style.gap = "0.4rem")}
                >
                  {service.cta.label}
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
