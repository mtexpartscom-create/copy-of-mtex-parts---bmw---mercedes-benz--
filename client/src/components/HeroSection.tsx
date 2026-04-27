/*
  MTEX PARTS – Hero Section
  Design: Full-bleed dark hero with BMW/Mercedes workshop image
  Left-aligned content, animated stats, dual CTA
*/

import { useEffect, useRef, useState } from "react";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";

const STATS = [
  { num: 631, suffix: "+", label: "СЕРВИЗНИ РЕМОНТА" },
  { num: 12351, suffix: "+", label: "ДОСТАВЕНИ АВТОЧАСТИ" },
  { num: 10, suffix: "+", label: "Години опит" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = count >= 1000 ? (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + "K" : count.toString();

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  const scrollToNext = () => {
    const next = document.getElementById("services");
    if (next) {
      const top = next.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0d0e10",
      }}
    >
      {/* Background image */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}>
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663583206229/hqNh2jLriKqMKmwGEXEYuv/hero_workshop_final-6wBtFo6FbgbCQ84JYX8JQ9.webp"
          alt="MTEX PARTS Workshop"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        {/* Multi-layer overlay for text readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(105deg, rgba(13,14,16,0.92) 0%, rgba(13,14,16,0.75) 50%, rgba(13,14,16,0.4) 100%)",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(13,14,16,0.9) 0%, transparent 50%)",
        }} />
      </div>

      {/* Decorative blue glow */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "-5%",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(28,105,212,0.12) 0%, transparent 70%)",
        zIndex: 1,
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 2rem",
        width: "100%",
        paddingTop: "6rem",
        paddingBottom: "6rem",
      }}>
        <div style={{ maxWidth: 680 }}>
          {/* Badge */}
          <div
            className="fade-up visible"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 1rem",
              borderRadius: 9999,
              background: "rgba(28,105,212,0.12)",
              border: "1px solid rgba(28,105,212,0.3)",
              marginBottom: "1.75rem",
            }}
          >
            <span style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#1c69d4",
              boxShadow: "0 0 8px #1c69d4",
              flexShrink: 0,
              animation: "pulse 2s infinite",
            }} />
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#60a5fa",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              Специализирани в BMW &amp; Mercedes-Benz
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "#f0f0ee",
            marginBottom: "1.5rem",
          }}>
            Качествени<br />
            <span style={{
              background: "linear-gradient(135deg, #1c69d4 0%, #60a5fa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              OEM Авточасти
            </span><br />
            на Достъпни Цени
          </h1>

          {/* Description */}
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "1.1rem",
            color: "#9ca3af",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            maxWidth: 520,
          }}>
            Автоморга за употребявани OEM авточасти и автомобили на части.
            Намерете нужната ви авточаст от нашия богат склад – BMW и Mercedes-Benz.
            Обслужваме клиенти от цяла България.
          </p>

          {/* Stats */}
          <div style={{
            display: "flex",
            gap: "2.5rem",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <span style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "2rem",
                  color: "#f0f0ee",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}>
                  <CountUp target={stat.num} suffix={stat.suffix} />
                </span>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.78rem",
                  color: "#6b7280",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
                background: "#1c69d4",
                color: "#fff",
                borderRadius: 10,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "all 0.25s ease",
                border: "2px solid #1c69d4",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#2d7de8";
                (e.currentTarget as HTMLElement).style.borderColor = "#2d7de8";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(28,105,212,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#1c69d4";
                (e.currentTarget as HTMLElement).style.borderColor = "#1c69d4";
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              Виж Наличността
              <ArrowRight size={16} />
            </a>
            <a
              href="tel:+359898606626"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 1.75rem",
                background: "transparent",
                color: "#f0f0ee",
                borderRadius: 10,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "all 0.25s ease",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <Phone size={16} />
              Обади се
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToNext}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#6b7280",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
      >
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "0.7rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          Scroll
        </span>
        <ChevronDown size={18} style={{ animation: "bounce 2s infinite" }} />
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </section>
  );
}
