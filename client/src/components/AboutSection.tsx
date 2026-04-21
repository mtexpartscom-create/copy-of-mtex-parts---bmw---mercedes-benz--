/*
  MTEX PARTS – About Section
  Design: Asymmetric layout, image left + content right
  Includes: company story, values, trust badges
*/

import { useEffect, useRef } from "react";
import { Shield, Truck, Star, Users, CheckCircle2, Award } from "lucide-react";

const VALUES = [
  {
    icon: <Shield size={20} strokeWidth={1.5} />,
    title: "OEM Авточасти",
    desc: "Оригинални части от разглобени автомобили с гарантирано качество",
    color: "#1c69d4",
  },
  {
    icon: <CheckCircle2 size={20} strokeWidth={1.5} />,
    title: "Проверено Качество",
    desc: "Всяка авточаст е проверена и тествана преди продажба",
    color: "#10b981",
  },
  {
    icon: <Truck size={20} strokeWidth={1.5} />,
    title: "Бърза Доставка",
    desc: "Изпращаме из цяла България с надеждни куриерски услуги",
    color: "#f59e0b",
  },
  {
    icon: <Users size={20} strokeWidth={1.5} />,
    title: "Експертна Консултация",
    desc: "Помагаме да намерите точната авточаст за вашия модел",
    color: "#8b5cf6",
  },
];

const TRUST_BADGES = [
  { icon: <Award size={22} />, label: "10+ Години опит", color: "#f59e0b" },
  { icon: <Star size={22} />, label: "3,000+ Клиента", color: "#1c69d4" },
  { icon: <Shield size={22} />, label: "OEM Качество", color: "#10b981" },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
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
      id="about"
      ref={sectionRef}
      style={{
        background: "#0d0e10",
        padding: "7rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "30%",
        right: "-10%",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(28,105,212,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", position: "relative" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}
          className="about-grid"
        >
          {/* Left: Visual */}
          <div className="fade-up" style={{ position: "relative" }}>
            {/* Main image */}
            <div style={{
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              aspectRatio: "4/3",
            }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663583206229/hqNh2jLriKqMKmwGEXEYuv/about_bg-6xSQAdxdaKmiyckGqwbJsG.webp"
                alt="BMW Engine"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Floating secondary image */}
            <div style={{
              position: "absolute",
              bottom: -32,
              right: -32,
              width: 200,
              height: 150,
              borderRadius: 14,
              overflow: "hidden",
              border: "3px solid #0d0e10",
              boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
            }}>
              <img
                src="/manus-storage/photo_dashboard_58a52a0b.webp"
                alt="BMW Dashboard"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Experience badge */}
            <div style={{
              position: "absolute",
              top: -20,
              left: -20,
              background: "linear-gradient(135deg, #1c69d4, #2d7de8)",
              borderRadius: 16,
              padding: "1.25rem 1.5rem",
              boxShadow: "0 12px 40px rgba(28,105,212,0.4)",
              textAlign: "center",
              minWidth: 110,
            }}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "2rem",
                color: "#fff",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}>10+</div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 500,
                marginTop: "0.2rem",
                lineHeight: 1.3,
              }}>Години<br />Опит</div>
            </div>

            {/* Trust badges row */}
            <div style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "3.5rem",
              flexWrap: "wrap",
            }}>
              {TRUST_BADGES.map((b, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: "#15171a",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 9999,
                  color: b.color,
                }}>
                  {b.icon}
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#f0f0ee",
                  }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <div className="fade-up delay-200">
              <div className="section-tag" style={{ marginBottom: "1.25rem" }}>Нашата История</div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)",
                color: "#f0f0ee",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}>
                Специалисти в BMW<br />и Mercedes-Benz
              </h2>

              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "1rem",
                color: "#9ca3af",
                lineHeight: 1.75,
                marginBottom: "1.25rem",
              }}>
                <strong style={{ color: "#f0f0ee" }}>MTEX PARTS</strong> е водеща автоморга за качествени употребявани авточасти,
                специализирана изключително в марките <strong style={{ color: "#60a5fa" }}>BMW и Mercedes-Benz</strong>.
                Намираме се в <strong style={{ color: "#f0f0ee" }}>Варна, България</strong> и обслужваме клиенти от цялата страна.
              </p>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "1rem",
                color: "#9ca3af",
                lineHeight: 1.75,
                marginBottom: "2.5rem",
              }}>
                Нашата мисия е да предоставяме <strong style={{ color: "#f0f0ee" }}>OEM качество</strong> на достъпни цени.
                Всяка авточаст преминава проверка преди продажба, за да сме сигурни, че получавате
                надеждна и функционираща компонента за вашия автомобил.
              </p>
            </div>

            {/* Values */}
            <div className="fade-up delay-300" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}>
              {VALUES.map((v, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "0.75rem",
                  padding: "1rem",
                  background: "#15171a",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${v.color}40`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${v.color}15`,
                    border: `1px solid ${v.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: v.color,
                    flexShrink: 0,
                  }}>
                    {v.icon}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "#f0f0ee",
                      marginBottom: "0.2rem",
                    }}>{v.title}</div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.78rem",
                      color: "#6b7280",
                      lineHeight: 1.5,
                    }}>{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="fade-up delay-400">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("contact");
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.85rem 1.75rem",
                  background: "#1c69d4",
                  color: "#fff",
                  borderRadius: 10,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#2d7de8";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(28,105,212,0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#1c69d4";
                  (e.currentTarget as HTMLElement).style.transform = "none";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                Свържете се с нас
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
