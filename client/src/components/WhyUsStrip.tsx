/*
  MTEX PARTS – Why Us Strip
  Design: Horizontal stats/features band between sections
  Shows key differentiators with icons and numbers
*/

import { useEffect, useRef } from "react";
import { Shield, Zap, MapPin, Package, Clock, Star } from "lucide-react";

const FEATURES = [
  {
    icon: <Shield size={22} strokeWidth={1.5} />,
    label: "OEM Качество",
    desc: "Оригинални части",
    color: "#1c69d4",
  },
  {
    icon: <Package size={22} strokeWidth={1.5} />,
    label: "3,000+ Части",
    desc: "Голям склад",
    color: "#10b981",
  },
  {
    icon: <Zap size={22} strokeWidth={1.5} />,
    label: "Бърза Доставка",
    desc: "Цяла България",
    color: "#f59e0b",
  },
  {
    icon: <Clock size={22} strokeWidth={1.5} />,
    label: "Пътна Помощ 24/7",
    desc: "Винаги на линия",
    color: "#c41230",
  },
  {
    icon: <MapPin size={22} strokeWidth={1.5} />,
    label: "Варна, България",
    desc: "Централно местоположение",
    color: "#8b5cf6",
  },
  {
    icon: <Star size={22} strokeWidth={1.5} />,
    label: "10+ Години Опит",
    desc: "Доверен партньор",
    color: "#06b6d4",
  },
];

export default function WhyUsStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );
    const els = ref.current?.querySelectorAll(".fade-up");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: "#15171a",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "3rem 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div
          className="fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                padding: "0.75rem",
                borderRadius: 12,
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: `${feat.color}12`,
                border: `1px solid ${feat.color}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: feat.color,
                flexShrink: 0,
              }}>
                {feat.icon}
              </div>
              <div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#f0f0ee",
                  lineHeight: 1.2,
                  marginBottom: "0.15rem",
                }}>
                  {feat.label}
                </div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.75rem",
                  color: "#6b7280",
                }}>
                  {feat.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
