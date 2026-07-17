/*
  MTEX PARTS – Footer Component
  Design: Dark footer with logo, nav columns, contact, social links
*/

import { Phone, Mail, MapPin, Facebook, ArrowRight } from "lucide-react";

const NAV_SERVICES = [
  { label: "Авточасти", href: "#services" },
  { label: "Автосервиз", href: "#services" },
  { label: "Пътна Помощ 24/7", href: "#services" },
  { label: "Запитване", href: "#contact" },
];

const NAV_INVENTORY = [
  { label: "BMW E-серия", href: "#inventory" },
  { label: "BMW X-серия", href: "#inventory" },
  { label: "BMW 7-серия", href: "#inventory" },
  { label: "Всички модели", href: "https://www.facebook.com/mtexparts/photos_albums" },
];

const scrollTo = (href: string) => {
  if (href.startsWith("http")) {
    window.open(href, "_blank");
    return;
  }
  const el = document.querySelector(href);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "#0a0b0d",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "5rem 0 2rem",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        {/* Main footer grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
          gap: "3rem",
          marginBottom: "4rem",
        }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <img
                src="/manus-storage/profile_logo_9d43d216.webp"
                alt="MTEX PARTS"
                style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }}
              />
              <div>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  color: "#f0f0ee",
                  letterSpacing: "-0.02em",
                }}>MTEX PARTS</div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.7rem",
                  color: "#60a5fa",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>BMW &amp; Mercedes-Benz</div>
              </div>
            </div>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.9rem",
              color: "#6b7280",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
              maxWidth: 280,
            }}>
              Специализирана автоморга за качествени употребявани OEM авточасти за BMW и Mercedes-Benz.
              Намираме се в Варна, обслужваме цяла България.
            </p>

            {/* Social */}
            <a
              href="https://www.facebook.com/mtexparts"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.1rem",
                background: "rgba(24,119,242,0.1)",
                border: "1px solid rgba(24,119,242,0.2)",
                borderRadius: 9999,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "#60a5fa",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(24,119,242,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(24,119,242,0.1)";
              }}
            >
              <Facebook size={15} />
              Facebook
            </a>
          </div>

          {/* Services column */}
          <div>
            <h4 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#f0f0ee",
              marginBottom: "1.25rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>
              Услуги
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {NAV_SERVICES.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                  >
                    <ArrowRight size={12} style={{ flexShrink: 0 }} />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Inventory column */}
          <div>
            <h4 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#f0f0ee",
              letterSpacing: "0.06em",
              marginBottom: "1.25rem",
              textTransform: "uppercase",
            }}>
              Наличност
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {NAV_INVENTORY.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    onClick={item.href.startsWith("http") ? undefined : (e) => { e.preventDefault(); scrollTo(item.href); }}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                  >
                    <ArrowRight size={12} style={{ flexShrink: 0 }} />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#f0f0ee",
              letterSpacing: "0.06em",
              marginBottom: "1.25rem",
              textTransform: "uppercase",
            }}>
              Контакт
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <a href="tel:+359898606626" style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.875rem",
                color: "#9ca3af",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0ee")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                <Phone size={14} color="#1c69d4" />
                +359 898 606 626
              </a>
              <a href="mailto:mtexnika.parts@gmail.com" style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.875rem",
                color: "#9ca3af",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0ee")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                <Mail size={14} color="#10b981" />
                mtexnika.parts@gmail.com
              </a>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.875rem",
                color: "#9ca3af",
              }}>
                <MapPin size={14} color="#f59e0b" />
                Варна, България
              </div>
            </div>

            {/* CTA */}
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                marginTop: "1.5rem",
                padding: "0.65rem 1.25rem",
                background: "#1c69d4",
                color: "#fff",
                borderRadius: 8,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#2d7de8";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#1c69d4";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              Изпрати Запитване
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: "rgba(255,255,255,0.06)",
          marginBottom: "2rem",
        }} />

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.8rem",
            color: "#4b5563",
          }}>
            &copy; {year} MTEX PARTS – BMW &amp; Mercedes-Benz Авточасти. Варна, България.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Начало", "Услуги", "Наличност", "За нас", "Контакт"].map((label, i) => {
              const hrefs = ["#home", "#services", "#inventory", "#about", "#contact"];
              return (
                <a
                  key={i}
                  href={hrefs[i]}
                  onClick={(e) => { e.preventDefault(); scrollTo(hrefs[i]); }}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.8rem",
                    color: "#4b5563",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
