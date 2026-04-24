/*
  MTEX PARTS – Contact Section
  Design: Split layout - info panel left + form right
  Includes: contact details, inquiry form, map placeholder
*/

import { useState, useEffect, useRef } from "react";
import { Phone, Mail, MapPin, Facebook, Send, CheckCircle2, Clock, Truck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import VinDecoderInput from "./VinDecoderInput";

const CONTACT_ITEMS = [
  {
    icon: <Phone size={20} strokeWidth={1.5} />,
    label: "Телефон",
    value: "+359 898 606 626",
    href: "tel:+359898606626",
    color: "#1c69d4",
  },
  {
    icon: <Mail size={20} strokeWidth={1.5} />,
    label: "Имейл",
    value: "mtexnika.parts@gmail.com",
    href: "mailto:mtexnika.parts@gmail.com",
    color: "#10b981",
  },
  {
    icon: <MapPin size={20} strokeWidth={1.5} />,
    label: "Локация",
    value: "Варна, България",
    href: undefined,
    color: "#f59e0b",
  },
  {
    icon: <Facebook size={20} strokeWidth={1.5} />,
    label: "Facebook",
    value: "facebook.com/mtexparts",
    href: "https://www.facebook.com/mtexparts",
    color: "#1877F2",
  },
];

const QUICK_INFO = [
  { icon: <Clock size={16} />, text: "Отговаряме в рамките на 24 часа" },
  { icon: <Truck size={16} />, text: "Доставка из цяла България" },
  { icon: <CheckCircle2 size={16} />, text: "Безплатна консултация" },
];

const CAR_OPTIONS = [
  { value: "", label: "Изберете модел..." },
  { value: "bmw-e30", label: "BMW E30" },
  { value: "bmw-e36", label: "BMW E36" },
  { value: "bmw-e39", label: "BMW E39" },
  { value: "bmw-e46", label: "BMW E46" },
  { value: "bmw-e60", label: "BMW E60/E61" },
  { value: "bmw-e65", label: "BMW E65/E66" },
  { value: "bmw-x5-e53", label: "BMW X5 E53" },
  { value: "bmw-x5-e70", label: "BMW X5 E70" },
  { value: "bmw-f10", label: "BMW F10/F11" },
  { value: "bmw-f30", label: "BMW F30/F31" },
  { value: "mercedes-w203", label: "Mercedes W203 (C-Class)" },
  { value: "mercedes-w211", label: "Mercedes W211 (E-Class)" },
  { value: "mercedes-w220", label: "Mercedes W220 (S-Class)" },
  { value: "mercedes-w164", label: "Mercedes W164 (ML)" },
  { value: "other", label: "Друг модел" },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", car: "", message: "", vin: "", make: "", model: "", year: "", engine: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const els = sectionRef.current?.querySelectorAll(".fade-up");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const createCustomerMutation = trpc.crm.customers.create.useMutation();
  const createVehicleMutation = trpc.crm.vehicles.create.useMutation();
  const createInquiryMutation = trpc.crm.inquiries.create.useMutation();
  const notifyOwnerMutation = trpc.system.notifyOwner.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email) {
      toast.error("Име и имейл са задължителни");
      return;
    }

    setSubmitting(true);
    try {
      // Create or get customer
      const customer = await createCustomerMutation.mutateAsync({
        name: form.name,
        phone: form.phone,
        email: form.email,
      });

      // If VIN is provided, create vehicle
      let vehicleId: number | undefined;
      if (form.vin && customer) {
        try {
          const vehicle = await createVehicleMutation.mutateAsync({
            customerId: customer.id,
            vin: form.vin,
            make: form.make || undefined,
            model: form.model || undefined,
            year: form.year ? parseInt(form.year) : undefined,
            engine: form.engine || undefined,
          });
          vehicleId = vehicle.id;
        } catch (error) {
          console.log("Vehicle might already exist, continuing...");
        }
      }

      // Create parts inquiry
      if (form.message && customer) {
        const inquiry = await createInquiryMutation.mutateAsync({
          customerId: customer.id,
          vehicleId,
          partName: form.message.split("\n")[0] || "General Inquiry",
          vin: form.vin || undefined,
          notes: form.message,
          status: "pending",
        });

        // Notify owner about new inquiry
        try {
          const partText = form.message.split("\n")[0] || "General Inquiry";
          const phoneText = form.phone || "Not provided";
          const vinText = form.vin || "Not provided";
          
          await notifyOwnerMutation.mutateAsync({
            title: "New Parts Inquiry",
            content: `New inquiry from ${form.name} (${form.email})\n\nPart: ${partText}\nPhone: ${phoneText}\nVIN: ${vinText}`,
          });
        } catch (notifyError) {
          console.log("Failed to notify owner, but inquiry was created", notifyError);
        }
      }

      toast.success("Заявката е изпратена успешно! Ще се свържем с вас скоро.");
      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", car: "", message: "", vin: "", make: "", model: "", year: "", engine: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Грешка при изпращане на заявката");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "0.9rem",
    color: "#f0f0ee",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#9ca3af",
    marginBottom: "0.4rem",
    letterSpacing: "0.02em",
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        background: "#0d0e10",
        padding: "7rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute",
        bottom: "10%",
        left: "-5%",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(28,105,212,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", position: "relative" }}>
        {/* Section header */}
        <div className="fade-up" style={{ marginBottom: "4rem", maxWidth: 600 }}>
          <div className="section-tag" style={{ marginBottom: "1.25rem" }}>Свържете се с нас</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "#f0f0ee",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}>
            Намерете нужната<br />ви авточаст
          </h2>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "1.05rem",
            color: "#9ca3af",
            lineHeight: 1.7,
          }}>
            Свържете се с нас за запитване за конкретна авточаст или за информация за наличните автомобили.
            Отговаряме бързо!
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: "3rem",
          alignItems: "start",
        }}
          className="contact-grid"
        >
          {/* Left: Contact info */}
          <div className="fade-up">
            {/* Contact items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2.5rem" }}>
              {CONTACT_ITEMS.map((item, i) => (
                item.href ? (
                  <a
                    key={i}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem 1.25rem",
                      background: "#15171a",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 12,
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${item.color}40`;
                      (e.currentTarget as HTMLElement).style.background = "#1e2025";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLElement).style.background = "#15171a";
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "0.15rem",
                      }}>{item.label}</div>
                      <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.925rem",
                        color: "#f0f0ee",
                      }}>{item.value}</div>
                    </div>
                  </a>
                ) : (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem 1.25rem",
                      background: "#15171a",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 12,
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "0.15rem",
                      }}>{item.label}</div>
                      <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.925rem",
                        color: "#f0f0ee",
                      }}>{item.value}</div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Quick info */}
            <div style={{
              padding: "1.25rem",
              background: "rgba(28,105,212,0.06)",
              border: "1px solid rgba(28,105,212,0.15)",
              borderRadius: 12,
            }}>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#60a5fa",
                marginBottom: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Защо да изберете нас
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {QUICK_INFO.map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                  }}>
                    <span style={{ color: "#1c69d4", flexShrink: 0 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Parts warehouse image */}
            <div style={{
              marginTop: "1.5rem",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
              height: 180,
            }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663583206229/hqNh2jLriKqMKmwGEXEYuv/parts_hero-CmLPhe7Wbponc74krhSxJY.webp"
                alt="Parts Warehouse"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="fade-up delay-200">
            <div style={{
              background: "#15171a",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "2.5rem",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
            }}>
              {!submitted ? (
                <>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.35rem",
                    color: "#f0f0ee",
                    letterSpacing: "-0.02em",
                    marginBottom: "0.4rem",
                  }}>
                    Изпратете Запитване
                  </h3>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginBottom: "2rem",
                  }}>
                    Опишете нужната ви авточаст и ще се свържем с вас.
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={labelStyle}>Вашето Име *</label>
                        <input
                          type="text"
                          placeholder="Иван Петров"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          style={inputStyle}
                          onFocus={(e) => {
                            (e.target as HTMLInputElement).style.borderColor = "rgba(28,105,212,0.5)";
                            (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(28,105,212,0.1)";
                          }}
                          onBlur={(e) => {
                            (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)";
                            (e.target as HTMLInputElement).style.boxShadow = "none";
                          }}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Телефон</label>
                        <input
                          type="tel"
                          placeholder="+359 8XX XXX XXX"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          style={inputStyle}
                          onFocus={(e) => {
                            (e.target as HTMLInputElement).style.borderColor = "rgba(28,105,212,0.5)";
                            (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(28,105,212,0.1)";
                          }}
                          onBlur={(e) => {
                            (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)";
                            (e.target as HTMLInputElement).style.boxShadow = "none";
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Имейл адрес *</label>
                      <input
                        type="email"
                        placeholder="ivan@example.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = "rgba(28,105,212,0.5)";
                          (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(28,105,212,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>VIN номер (опционално)</label>
                      <VinDecoderInput 
                        onVinDecoded={(data) => setForm({ 
                          ...form, 
                          vin: data.vin,
                          make: data.make,
                          model: data.model,
                          year: data.year.toString(),
                          engine: data.engine
                        })}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Модел на автомобила</label>
                      <select
                        value={form.car}
                        onChange={(e) => setForm({ ...form, car: e.target.value })}
                        style={{
                          ...inputStyle,
                          cursor: "pointer",
                          appearance: "none" as const,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          paddingRight: "2.5rem",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(28,105,212,0.5)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(28,105,212,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        {CAR_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} style={{ background: "#15171a", color: "#f0f0ee" }}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Каква авточаст търсите? *</label>
                      <textarea
                        rows={4}
                        placeholder="Опишете нужната ви авточаст – номер, описание, или друга информация..."
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        style={{
                          ...inputStyle,
                          resize: "vertical",
                          minHeight: 100,
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(28,105,212,0.5)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(28,105,212,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,255,255,0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.9rem",
                        background: submitting ? "#2d7de8" : "#1c69d4",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all 0.25s ease",
                        opacity: submitting ? 0.8 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!submitting) {
                          (e.currentTarget as HTMLElement).style.background = "#2d7de8";
                          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(28,105,212,0.45)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = submitting ? "#2d7de8" : "#1c69d4";
                        (e.currentTarget as HTMLElement).style.transform = "none";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      }}
                    >
                      {submitting ? (
                        <>
                          <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
                          Изпращане...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Изпрати Запитване
                        </>
                      )}
                    </button>

                    <p style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.8rem",
                      color: "#6b7280",
                      textAlign: "center",
                    }}>
                      Или се свържете директно:{" "}
                      <a href="tel:+359898606626" style={{ color: "#60a5fa", fontWeight: 600 }}>
                        +359 898 606 626
                      </a>
                    </p>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(16,185,129,0.12)",
                    border: "2px solid rgba(16,185,129,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    color: "#34d399",
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "#f0f0ee",
                    marginBottom: "0.75rem",
                  }}>
                    Запитването е изпратено!
                  </h3>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "1rem",
                    color: "#9ca3af",
                    lineHeight: 1.65,
                    marginBottom: "2rem",
                  }}>
                    Ще се свържем с вас в рамките на 24 часа.
                    Можете да се свържете и директно на{" "}
                    <a href="tel:+359898606626" style={{ color: "#60a5fa", fontWeight: 600 }}>
                      +359 898 606 626
                    </a>
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", car: "", message: "", vin: "", make: "", model: "", year: "", engine: "" }); }}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "#9ca3af",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Ново запитване
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        select option {
          background: #15171a;
          color: #f0f0ee;
        }
      `}</style>
    </section>
  );
}
