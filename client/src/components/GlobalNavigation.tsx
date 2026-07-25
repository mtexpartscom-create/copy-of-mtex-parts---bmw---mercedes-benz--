/*
  MTEX PARTS – Global Navigation Component
  Design: Premium Dark Automotive Corporate
  Fixed top nav with dropdown Services menu, mobile hamburger menu
  Used on all public pages
*/

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

const SERVICES_MENU = [
  { href: "/catalog", label: "АВТОМОРГА" },
  { href: "/parts-shop", label: "АВТОЧАСТИ" },
  { href: "/auto-service-detail", label: "АВТОСЕРВИЗ" },
  { href: "/ac-service", label: "АВТОКЛИМАТИЦИ" },
  { href: "/road-assistance", label: "ПЪТНА ПОМОЩ" },
  { href: "/sell-car", label: "ПРОДАЙ АВТОМОБИЛА СИ" },
];

const NAV_LINKS = [
  { href: "/", label: "НАЧАЛО" },
  { href: "#services", label: "УСЛУГИ", dropdown: true },
  { href: "#about", label: "ЗА НАС" },
  { href: "#contact", label: "КОНТАКТИ" },
];

export default function GlobalNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [location] = useLocation();
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        background: scrolled ? "rgba(13,14,16,0.96)" : "transparent",
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
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}
        >
          <img
            src="/manus-storage/profile_logo_9d43d216.webp"
            alt="MTEX PARTS"
            style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
                color: "#f0f0ee",
                letterSpacing: "-0.02em",
              }}
            >
              MTEX PARTS
            </div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.65rem",
                color: "#60a5fa",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              BMW & MERCEDES-BENZ
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "2.5rem",
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map((link) => (
            <div key={link.href} style={{ position: "relative" }}>
              {link.dropdown ? (
                <div ref={servicesRef}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    style={{
                      background: "none",
                      border: "none",
                      color: isActive(link.href) ? "#60a5fa" : "#9ca3af",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      transition: "color 0.2s ease",
                      padding: "0.5rem 0",
                    }}
                    onMouseEnter={() => setServicesOpen(true)}
                  >
                    {link.label}
                    <ChevronDown
                      size={16}
                      style={{
                        transition: "transform 0.2s ease",
                        transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {servicesOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        background: "rgba(13,14,16,0.98)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        marginTop: "0.5rem",
                        minWidth: 240,
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      }}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      {SERVICES_MENU.map((item, i) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setServicesOpen(false);
                            setMobileOpen(false);
                          }}
                          style={{
                            display: "block",
                            padding: "0.75rem 1rem",
                            color: isActive(item.href) ? "#60a5fa" : "#9ca3af",
                            textDecoration: "none",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            transition: "all 0.2s ease",
                            borderBottom: i < SERVICES_MENU.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                            background: isActive(item.href) ? "rgba(96,165,250,0.1)" : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.15)";
                            (e.currentTarget as HTMLElement).style.color = "#60a5fa";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = isActive(item.href)
                              ? "rgba(96,165,250,0.1)"
                              : "transparent";
                            (e.currentTarget as HTMLElement).style.color = isActive(item.href) ? "#60a5fa" : "#9ca3af";
                          }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("#")) {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }
                  }}
                  style={{
                    color: isActive(link.href) ? "#60a5fa" : "#9ca3af",
                    textDecoration: "none",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    transition: "color 0.2s ease",
                    padding: "0.5rem 0",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#60a5fa";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = isActive(link.href) ? "#60a5fa" : "#9ca3af";
                  }}
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "flex",
            background: "none",
            border: "none",
            color: "#f0f0ee",
            cursor: "pointer",
            padding: "0.5rem",
          }}
          className="md:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            display: "block",
            background: "rgba(13,14,16,0.98)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
          className="md:hidden"
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1rem" }}>
            {NAV_LINKS.map((link) => (
              <div key={link.href}>
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        color: "#9ca3af",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 0",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        style={{
                          transition: "transform 0.2s ease",
                          transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>
                    {servicesOpen && (
                      <div style={{ paddingLeft: "1rem", background: "rgba(96,165,250,0.05)" }}>
                        {SERVICES_MENU.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setServicesOpen(false);
                              setMobileOpen(false);
                            }}
                            style={{
                              display: "block",
                              padding: "0.5rem 0",
                              color: "#9ca3af",
                              textDecoration: "none",
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontSize: "0.85rem",
                              transition: "color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#60a5fa";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#9ca3af";
                            }}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith("#")) {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }
                      setMobileOpen(false);
                    }}
                    style={{
                      display: "block",
                      padding: "0.75rem 0",
                      color: "#9ca3af",
                      textDecoration: "none",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#60a5fa";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#9ca3af";
                    }}
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
