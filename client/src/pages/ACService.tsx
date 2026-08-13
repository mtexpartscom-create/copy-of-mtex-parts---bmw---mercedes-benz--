/*
  MTEX PARTS – AC Service Page
  Автоклиматици - Зареждане и обслужване
*/

import GlobalNavigation from "@/components/GlobalNavigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Phone, CheckCircle2, Thermometer, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { setSEOMetadata, SEO_PAGES } from "@/lib/seo";

const FREON_TYPES = [
  {
    name: "R134a",
    description: "Стандартен фреон за BMW и Mercedes-Benz",
    price: "89 лв.",
  },
  { name: "R1234yf", description: "Нов екологичен фреон", price: "129 лв." },
  {
    name: "R744 (CO2)",
    description: "Екологичен фреон за нови модели",
    price: "149 лв.",
  },
];

const AC_SERVICES = [
  { title: "Зареждане на фреон", price: "89 лв.", icon: "❄️" },
  { title: "Диагностика", price: "49 лв.", icon: "🔍" },
  { title: "Откривање на течове", price: "69 лв.", icon: "🔧" },
  { title: "Смяна на компресор", price: "399 лв.", icon: "⚙️" },
  { title: "Смяна на кондензатор", price: "299 лв.", icon: "🌡️" },
  { title: "Смяна на вентилатор", price: "199 лв.", icon: "💨" },
];

export default function ACService() {
  useEffect(() => {
    setSEOMetadata(SEO_PAGES.acService);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    carModel: "",
    date: "",
    time: "",
    service: "",
  });

  const bookingMutation = trpc.system.notifyOwner.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.date ||
      !formData.service
    ) {
      toast.error("Моля, попълнете всички полета");
      return;
    }

    try {
      await bookingMutation.mutateAsync({
        title: "Нова резервация за автоклиматици",
        content: `Име: ${formData.name}\nТелефон: ${formData.phone}\nИмейл: ${formData.email}\nМодел: ${formData.carModel}\nУслуга: ${formData.service}\nДата: ${formData.date}\nВреме: ${formData.time}`,
      });

      toast.success("Резервацията е изпратена! Ще се свържем с вас скоро.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        carModel: "",
        date: "",
        time: "",
        service: "",
      });
    } catch (error) {
      toast.error("Грешка при изпращане. Моля, опитайте отново.");
    }
  };

  return (
    <div style={{ background: "#0d0e10", minHeight: "100vh" }}>
      <GlobalNavigation />
      <Breadcrumb
        items={[
          { label: "Начало", href: "/" },
          { label: "Услуги", href: "#" },
          { label: "Автоклиматици" },
        ]}
      />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1d22 0%, #15171a 100%)",
          padding: "clamp(4.5rem, 10vw, 6rem) 1rem clamp(2.5rem, 7vw, 4rem)",
          textAlign: "center",
          marginTop: 70,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.7rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "#f0f0ee",
            marginBottom: "1rem",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          ❄️ АВТОКЛИМАТИЦИ
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#9ca3af",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Профессионално зареждане и обслужване на автомобилни климатични
          системи
        </p>
      </div>

      {/* Services Grid */}
      <section
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.55rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "#f0f0ee",
            marginBottom: "2rem",
            textAlign: "center",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          УСЛУГИ И ЦЕНИ
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "2rem",
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {AC_SERVICES.map((service, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "1.5rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(96,165,250,0.1)";
                (e.currentTarget as HTMLElement).style.borderColor = "#60a5fa";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.08)";
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                {service.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#f0f0ee",
                  marginBottom: "0.5rem",
                }}
              >
                {service.title}
              </h3>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#60a5fa",
                }}
              >
                {service.price}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Freon Types */}
      <section
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.55rem, 4vw, 2rem)",
              fontWeight: 700,
              color: "#f0f0ee",
              marginBottom: "2rem",
              textAlign: "center",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            ВИДОВЕ ФРЕОН
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "2rem",
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FREON_TYPES.map((freon, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "2rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#60a5fa",
                    marginBottom: "0.5rem",
                  }}
                >
                  {freon.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#9ca3af",
                    marginBottom: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  {freon.description}
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#10b981",
                  }}
                >
                  {freon.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.55rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "#f0f0ee",
            marginBottom: "2rem",
            textAlign: "center",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          ЗАПАЗИ ЧАС
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div>
            <label
              style={{
                color: "#9ca3af",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Име
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#f0f0ee",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: "#9ca3af",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Телефон
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#f0f0ee",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: "#9ca3af",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Имейл
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#f0f0ee",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: "#9ca3af",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Модел на автомобила
            </label>
            <input
              type="text"
              value={formData.carModel}
              onChange={e =>
                setFormData({ ...formData, carModel: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#f0f0ee",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: "#9ca3af",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Услуга
            </label>
            <select
              value={formData.service}
              onChange={e =>
                setFormData({ ...formData, service: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#f0f0ee",
                fontSize: "1rem",
              }}
            >
              <option value="">Изберете услуга</option>
              {AC_SERVICES.map(s => (
                <option key={s.title} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div
            className="service-date-row"
            style={{ display: "grid", gap: "1rem" }}
          >
            <div>
              <label
                style={{
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Дата
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={e =>
                  setFormData({ ...formData, date: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#f0f0ee",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Време
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={e =>
                  setFormData({ ...formData, time: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#f0f0ee",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={bookingMutation.isPending}
            style={{
              padding: "1rem",
              background: "#60a5fa",
              color: "#0d0e10",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#3b82f6";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "#60a5fa";
            }}
          >
            {bookingMutation.isPending ? "Изпращане..." : "Запази час"}
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
}
