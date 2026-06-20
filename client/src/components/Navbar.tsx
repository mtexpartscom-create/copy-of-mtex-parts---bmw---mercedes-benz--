/*
  MTEX PARTS – Navbar Component
  Design: Premium Dark Automotive Corporate
  Fixed top nav with scroll-triggered background, mobile hamburger menu
*/

import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "#home", label: "Начало" },
  { href: "#services", label: "Услуги" },
  { href: "#inventory", label: "Наличност" },
  { href: "#about", label: "За нас" },
  { href: "#reviews", label: "Отзиви" },
  { href: "#contact", label: "Контакт" },
];

const CATALOG_LINKS = [
  { href: "/catalog", label: "Каталог: Авточасти" },
  { href: "/vehicles-for-parts", label: "Автомобили за части" },
  { href: "/auto-service", label: "Автосервиз" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          background: scrolled
            ? "rgba(10,10,10,0.96)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: scrolled ? 60 : 70,
            transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleLinkClick("#home"); }}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}
          >
            <img
              src="/manus-storage/profile_logo_9d43d216.webp"
              alt="MTEX PARTS"
              style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }}
            />
            <div style={{ lineHeight: 1.1 }}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
                color: "#f0f0ee",
                letterSpacing: "-0.02em",
              }}>
                MTEX PARTS
              </div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.55rem, 1.5vw, 0.68rem)",
                color: "#60a5fa",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                BMW &amp; Mercedes-Benz
              </div>
            </div>
          </a>

          {/* Desktop nav */}
          <ul style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                  style={{
                    display: "block",
                    padding: "0.5rem 0.85rem",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    borderRadius: 8,
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "#f0f0ee";
                    (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "#9ca3af";
                    (e.target as HTMLElement).style.background = "transparent";
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li style={{ height: 20, width: 1, background: "rgba(255,255,255,0.1)", margin: "0 0.5rem" }} />
            {CATALOG_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "0.5rem 0.85rem",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    borderRadius: 8,
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "#f0f0ee";
                    (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "#9ca3af";
                    (e.target as HTMLElement).style.background = "transparent";
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + Mobile toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <a
              href="tel:+359898606626"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 0.8rem",
                background: "#FF0000",
                color: "#fff",
                borderRadius: 6,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                textDecoration: "none",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#FF3333";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(255,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#FF0000";
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <Phone size={14} />
              <span className="hidden sm:inline">Обади се</span>
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "0.5rem",
                color: "#f0f0ee",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: "rgba(13,14,16,0.98)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "1rem 1.5rem 1.5rem",
          }}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                    style={{
                      display: "block",
                      padding: "0.75rem 1rem",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: "1rem",
                      color: "#9ca3af",
                      borderRadius: 8,
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = "#f0f0ee";
                      (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = "#9ca3af";
                      (e.target as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <a
                href="tel:+359898606626"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.85rem",
                  background: "#1c69d4",
                  color: "#fff",
                  borderRadius: 10,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                <Phone size={16} />
                +359 898 606 626
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
