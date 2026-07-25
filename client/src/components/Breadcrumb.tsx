/*
  Breadcrumb Navigation Component
  Навигация с пътеки за вътрешни страници
*/

import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      style={{
        padding: "1rem",
        background: "rgba(255,255,255,0.02)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      aria-label="Breadcrumb"
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {items.map((item, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {index > 0 && (
              <ChevronRight size={16} style={{ color: "#60a5fa", opacity: 0.6 }} />
            )}
            {item.href ? (
              <Link href={item.href}>
                <a
                  style={{
                    color: "#60a5fa",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#3b82f6";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#60a5fa";
                  }}
                >
                  {item.label}
                </a>
              </Link>
            ) : (
              <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
