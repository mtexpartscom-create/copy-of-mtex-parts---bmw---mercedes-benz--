/*
  MTEX PARTS – Inventory Section
  Design: Filterable car grid with specs overlay
  Cars: BMW E-series, X-series, 7-series
*/

import { useState, useEffect, useRef } from "react";
import { ExternalLink, ArrowRight, Facebook } from "lucide-react";

const CARS = [
  {
    id: "e65",
    model: "BMW E65 740D",
    series: "7-серия",
    category: "7-series",
    image: "/manus-storage/e65_740d_front_d073d350.webp",
    specs: { engine: "M67 740D", type: "Седан", year: "2004+", photos: "26 бр." },
    fbLink: "https://www.facebook.com/media/set/?set=a.1111311181007495&type=3",
    status: "Налично",
  },
  {
    id: "x5e53",
    model: "BMW X5 E53 4.4",
    series: "X-серия",
    category: "x-series",
    image: "/manus-storage/x5_e53_front_fffac406.webp",
    specs: { engine: "M62B44TU", type: "SUV", year: "2001", photos: "25 бр." },
    fbLink: "https://www.facebook.com/media/set/?set=a.508376954634257&type=3",
    status: "Налично",
  },
  {
    id: "e39-530d",
    model: "BMW E39 530D",
    series: "5-серия",
    category: "e-series",
    image: "/manus-storage/e39_530d_front_ed8e0d10.webp",
    specs: { engine: "M57D30 193кс.", type: "Комби Фейс", year: "2003", photos: "18 бр." },
    fbLink: "https://www.facebook.com/media/set/?set=a.748449997293617&type=3",
    status: "Налично",
  },
  {
    id: "e46-320d",
    model: "BMW E46 320D",
    series: "3-серия",
    category: "e-series",
    image: "/manus-storage/e46_320d_front_80d2d783.webp",
    specs: { engine: "M47N", type: "Седан", year: "–", photos: "19 бр." },
    fbLink: "https://www.facebook.com/media/set/?set=a.610803454391606&type=3",
    status: "Налично",
  },
  {
    id: "e46-320i-coupe",
    model: "BMW E46 320i Купе",
    series: "3-серия",
    category: "e-series",
    image: "/manus-storage/e46_320i_coupe_front_9bb323c9.webp",
    specs: { engine: "–", type: "Купе", year: "–", photos: "12 бр." },
    fbLink: "https://www.facebook.com/media/set/?set=a.1121560456649234&type=3",
    status: "Налично",
  },
  {
    id: "e46-318i-coupe",
    model: "BMW E46 318i Купе",
    series: "3-серия",
    category: "e-series",
    image: "/manus-storage/e46_318i_coupe_front_038d6161.webp",
    specs: { engine: "–", type: "Купе", year: "–", photos: "19 бр." },
    fbLink: "https://www.facebook.com/media/set/?set=a.1121411246664155&type=3",
    status: "Налично",
  },
  {
    id: "e61",
    model: "BMW E61 N53B25",
    series: "5-серия",
    category: "e-series",
    image: "/manus-storage/e61_front_full_dc099fea.webp",
    specs: { engine: "N53B25", type: "Комби", year: "–", photos: "30 бр." },
    fbLink: "https://www.facebook.com/media/set/?set=a.1163208149151131&type=3",
    status: "Налично",
  },
  {
    id: "e39-525d",
    model: "BMW E39 525D",
    series: "5-серия",
    category: "e-series",
    image: "/manus-storage/e39_525d_front_a5873610.webp",
    specs: { engine: "M57D25", type: "Седан", year: "–", photos: "19 бр." },
    fbLink: "https://www.facebook.com/mtexparts/photos_albums",
    status: "Налично",
  },
];

const FILTERS = [
  { key: "all", label: "Всички" },
  { key: "e-series", label: "E-серия" },
  { key: "x-series", label: "X-серия" },
  { key: "7-series", label: "7-серия" },
];

export default function InventorySection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = activeFilter === "all" ? CARS : CARS.filter((c) => c.category === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const els = sectionRef.current?.querySelectorAll(".fade-up");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="inventory"
      ref={sectionRef}
      style={{
        background: "#15171a",
        padding: "7rem 0",
        position: "relative",
      }}
    >
      {/* Top edge decoration */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(28,105,212,0.4), transparent)",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: "3rem" }}>
          <div className="section-tag" style={{ marginBottom: "1.25rem" }}>Налични Автомобили</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#f0f0ee",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "0.75rem",
              }}>
                Автомобили на Части
              </h2>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "1rem",
                color: "#9ca3af",
                lineHeight: 1.65,
                maxWidth: 520,
              }}>
                Разгледайте нашите налични автомобили. Всяка кола е разглобена за части –
                намерете нужната ви. Над 926 снимки в нашия Facebook архив.
              </p>
            </div>
            <a
              href="https://www.facebook.com/mtexparts/photos_albums"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.25rem",
                background: "rgba(24,119,242,0.12)",
                border: "1px solid rgba(24,119,242,0.25)",
                borderRadius: 10,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#60a5fa",
                textDecoration: "none",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(24,119,242,0.2)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(24,119,242,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(24,119,242,0.12)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(24,119,242,0.25)";
              }}
            >
              <Facebook size={15} />
              Виж всички в Facebook
            </a>
          </div>
        </div>

        {/* Filter bar */}
        <div className="fade-up delay-100" style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
        }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: 9999,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: activeFilter === f.key
                  ? "1px solid #1c69d4"
                  : "1px solid rgba(255,255,255,0.1)",
                background: activeFilter === f.key
                  ? "#1c69d4"
                  : "rgba(255,255,255,0.04)",
                color: activeFilter === f.key ? "#fff" : "#9ca3af",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cars grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}>
          {filtered.map((car, i) => (
            <div
              key={car.id}
              className={`fade-up delay-${Math.min((i % 4 + 1) * 100, 400)}`}
              style={{
                background: "#1e2025",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-4px)";
                el.style.borderColor = "rgba(28,105,212,0.3)";
                el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.borderColor = "rgba(255,255,255,0.06)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                <img
                  src={car.image}
                  alt={car.model}
                  loading="lazy"
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
                  background: "linear-gradient(to top, rgba(30,32,37,0.8) 0%, transparent 60%)",
                }} />
                {/* Status badge */}
                <div style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  padding: "0.2rem 0.65rem",
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: 9999,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#34d399",
                  letterSpacing: "0.04em",
                }}>
                  {car.status}
                </div>
                {/* Series badge */}
                <div style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  padding: "0.2rem 0.65rem",
                  background: "rgba(28,105,212,0.15)",
                  border: "1px solid rgba(28,105,212,0.25)",
                  borderRadius: 9999,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#60a5fa",
                }}>
                  {car.series}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "1.25rem" }}>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "#f0f0ee",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.85rem",
                }}>
                  {car.model}
                </h3>

                {/* Specs grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                  marginBottom: "1.1rem",
                  padding: "0.85rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  {Object.entries(car.specs).map(([key, val]) => (
                    <div key={key}>
                      <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "0.68rem",
                        color: "#6b7280",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "0.15rem",
                      }}>
                        {key === "engine" ? "Двигател" : key === "type" ? "Тип" : key === "year" ? "Год." : "Снимки"}
                      </div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.8rem",
                        color: "#f0f0ee",
                        fontWeight: 500,
                      }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById("contact");
                      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
                    }}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                      padding: "0.6rem",
                      background: "#1c69d4",
                      color: "#fff",
                      borderRadius: 8,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#2d7de8";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#1c69d4";
                    }}
                  >
                    <ArrowRight size={13} />
                    Запитване
                  </a>
                  <a
                    href={car.fbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                      padding: "0.6rem 0.85rem",
                      background: "rgba(24,119,242,0.1)",
                      border: "1px solid rgba(24,119,242,0.2)",
                      color: "#60a5fa",
                      borderRadius: 8,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(24,119,242,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(24,119,242,0.1)";
                    }}
                  >
                    <ExternalLink size={13} />
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="fade-up" style={{
          marginTop: "3.5rem",
          padding: "2.5rem",
          background: "linear-gradient(135deg, rgba(28,105,212,0.08) 0%, rgba(28,105,212,0.03) 100%)",
          border: "1px solid rgba(28,105,212,0.15)",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "#f0f0ee",
              marginBottom: "0.4rem",
            }}>
              Не намирате нужната ви кола?
            </h3>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.9rem",
              color: "#9ca3af",
            }}>
              Имаме над 926 снимки в нашия Facebook архив. Свържете се с нас директно.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a
              href="https://www.facebook.com/mtexparts/photos_albums"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                background: "#1877F2",
                color: "#fff",
                borderRadius: 10,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#2d86f5";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#1877F2";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <Facebook size={16} />
              Виж всички в Facebook
            </a>
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
                padding: "0.75rem 1.5rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#f0f0ee",
                borderRadius: 10,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              Свържете се с нас
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
