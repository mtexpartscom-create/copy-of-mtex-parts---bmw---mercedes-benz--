/*
  MTEX PARTS – Reviews & Social Proof Section
  Design: Review cards + Facebook social stats + trust indicators
*/

import { useEffect, useRef } from "react";
import { Star, Facebook, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Иван Петров",
    role: "BMW E46 собственик",
    avatar: "И",
    avatarColor: "#1c69d4",
    text: "Намерих точно частта, която търсех за моето BMW E46. Бърза реакция, добра цена и качествена авточаст. Препоръчвам на всеки собственик на BMW!",
    rating: 5,
    featured: false,
  },
  {
    name: "Мартин Георгиев",
    role: "BMW E39 собственик",
    avatar: "М",
    avatarColor: "#8b5cf6",
    text: "Страхотен сервиз! Поръчах двигател за E39 и пристигна бързо, добре опакован. Работи перфектно. Ще поръчам отново без колебание!",
    rating: 5,
    featured: true,
  },
  {
    name: "Георги Николов",
    role: "Mercedes-Benz собственик",
    avatar: "Г",
    avatarColor: "#10b981",
    text: "Много добри цени за OEM части. Персоналът е компетентен и помага да намериш точно нужното. Доволен съм от покупката и бързата доставка.",
    rating: 5,
    featured: false,
  },
  {
    name: "Стефан Димитров",
    role: "BMW X5 E53 собственик",
    avatar: "С",
    avatarColor: "#f59e0b",
    text: "Намерих рядка авточаст за X5 E53, която не можех да открия никъде другаде. Отлично обслужване и бърза доставка до Пловдив.",
    rating: 5,
    featured: false,
  },
  {
    name: "Николай Стоянов",
    role: "BMW E61 собственик",
    avatar: "Н",
    avatarColor: "#c41230",
    text: "Закупих скоростна кутия за E61. Проверена, работеща, добра цена. Монтирах я без проблем. Препоръчвам MTEX PARTS на всички BMW фенове!",
    rating: 5,
    featured: false,
  },
  {
    name: "Валентин Иванов",
    role: "Mercedes-Benz W211 собственик",
    avatar: "В",
    avatarColor: "#06b6d4",
    text: "Бърза и компетентна помощ при намирането на части за Mercedes. Честни цени, качествени OEM части. Ще се върна отново!",
    rating: 5,
    featured: false,
  },
];

export default function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
      id="reviews"
      ref={sectionRef}
      style={{
        background: "#15171a",
        padding: "7rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <div className="fade-up" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="section-tag" style={{ marginBottom: "1.25rem", display: "inline-flex" }}>Доволни Клиенти</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "#f0f0ee",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}>
            Какво казват нашите клиенти
          </h2>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "1.05rem",
            color: "#9ca3af",
            lineHeight: 1.7,
            maxWidth: 520,
            margin: "0 auto",
          }}>
            Над 2,900 харесвания и 3,000 последователи в Facebook.
            Ето какво споделят нашите клиенти.
          </p>
        </div>

        {/* Reviews grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.25rem",
          marginBottom: "4rem",
        }}>
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className={`fade-up delay-${Math.min((i % 3 + 1) * 100, 300)}`}
              style={{
                background: review.featured ? "#1e2025" : "#1e2025",
                border: review.featured
                  ? "1px solid rgba(28,105,212,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "1.75rem",
                position: "relative",
                transition: "all 0.3s ease",
                boxShadow: review.featured ? "0 0 40px rgba(28,105,212,0.08)" : "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-4px)";
                el.style.borderColor = review.featured
                  ? "rgba(28,105,212,0.5)"
                  : "rgba(255,255,255,0.12)";
                el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.borderColor = review.featured
                  ? "rgba(28,105,212,0.3)"
                  : "rgba(255,255,255,0.06)";
                el.style.boxShadow = review.featured ? "0 0 40px rgba(28,105,212,0.08)" : "none";
              }}
            >
              {/* Quote icon */}
              <div style={{
                position: "absolute",
                top: 20,
                right: 20,
                color: "rgba(255,255,255,0.05)",
              }}>
                <Quote size={36} />
              </div>

              {/* Stars */}
              <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1rem" }}>
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>

              {/* Text */}
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.925rem",
                color: "#9ca3af",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                fontStyle: "italic",
              }}>
                "{review.text}"
              </p>

              {/* Reviewer */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: `${review.avatarColor}20`,
                  border: `2px solid ${review.avatarColor}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: review.avatarColor,
                  flexShrink: 0,
                }}>
                  {review.avatar}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#f0f0ee",
                  }}>
                    {review.name}
                  </div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.78rem",
                    color: "#6b7280",
                  }}>
                    {review.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Facebook social bar */}
        <div className="fade-up" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "3rem",
          padding: "2.5rem",
          background: "linear-gradient(135deg, rgba(24,119,242,0.08) 0%, rgba(24,119,242,0.03) 100%)",
          border: "1px solid rgba(24,119,242,0.15)",
          borderRadius: 16,
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(24,119,242,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Facebook size={24} color="#1877F2" />
            </div>
            <div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "1.75rem",
                color: "#f0f0ee",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}>2,900+</div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.8rem",
                color: "#9ca3af",
                fontWeight: 500,
              }}>Харесвания</div>
            </div>
          </div>

          <div style={{
            width: 1,
            height: 48,
            background: "rgba(255,255,255,0.08)",
          }} className="hidden sm:block" />

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(24,119,242,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Facebook size={24} color="#1877F2" />
            </div>
            <div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "1.75rem",
                color: "#f0f0ee",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}>3,000+</div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.8rem",
                color: "#9ca3af",
                fontWeight: 500,
              }}>Последователи</div>
            </div>
          </div>

          <a
            href="https://www.facebook.com/mtexparts"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.75rem",
              background: "#1877F2",
              color: "#fff",
              borderRadius: 10,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#2d86f5";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(24,119,242,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1877F2";
              (e.currentTarget as HTMLElement).style.transform = "none";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <Facebook size={16} />
            Последвайте ни
          </a>
        </div>
      </div>
    </section>
  );
}
