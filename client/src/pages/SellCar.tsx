/*
  MTEX PARTS – Sell Your Car Page
  Продай своя автомобил
*/

import GlobalNavigation from "@/components/GlobalNavigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { useState, useEffect } from "react";
import { setSEOMetadata, SEO_PAGES } from "@/lib/seo";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const CAR_CONDITIONS = [
  "Отличен",
  "Много добър",
  "Добър",
  "Задоволителен",
  "Нуждае се от ремонт",
];

export default function SellCar() {
  useEffect(() => {
    setSEOMetadata(SEO_PAGES.sellCar);
  }, []);

  const [formData, setFormData] = useState({
    ownerName: "",
    phone: "",
    email: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
    description: "",
  });

  const notifyMutation = trpc.system.notifyOwner.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.ownerName ||
      !formData.phone ||
      !formData.brand ||
      !formData.model
    ) {
      toast.error("Моля, попълнете всички задължителни полета");
      return;
    }

    try {
      await notifyMutation.mutateAsync({
        title: "Нова заявка за продажба на автомобил",
        content: `Собственик: ${formData.ownerName}\nТелефон: ${formData.phone}\nИмейл: ${formData.email}\nМарка: ${formData.brand}\nМодел: ${formData.model}\nГодина: ${formData.year}\nПробег: ${formData.mileage} км\nСъстояние: ${formData.condition}\nОписание: ${formData.description}`,
      });

      toast.success("Заявката е изпратена успешно! Ще се свържем с вас скоро.");
      setFormData({
        ownerName: "",
        phone: "",
        email: "",
        brand: "",
        model: "",
        year: "",
        mileage: "",
        condition: "",
        description: "",
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
          { label: "Продай автомобила" },
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
          💰 ПРОДАЙ СВОЯ АВТОМОБИЛ
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#9ca3af",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Бързо и лесно продай своя BMW или Mercedes-Benz. Ние ти дадим
          справедлива оценка.
        </p>
      </div>

      {/* Benefits */}
      <section
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.55rem, 4vw, 1.8rem)",
              fontWeight: 700,
              color: "#f0f0ee",
              marginBottom: "2rem",
              textAlign: "center",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            ЗАЩО ДА ПРОДАДЕШ НА MTEXPARTS?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
              gap: "2rem",
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: "⚡", title: "Бързо", desc: "Оценка в 24 часа" },
              {
                icon: "💵",
                title: "Справедлива цена",
                desc: "Пазарна оценка без скрити намаления",
              },
              {
                icon: "📋",
                title: "Лесна процедура",
                desc: "Минимум документи и формалности",
              },
              {
                icon: "🔒",
                title: "Сигурност",
                desc: "Защитени финансови трансакции",
              },
              {
                icon: "🚗",
                title: "Преглед",
                desc: "Професионален технически преглед",
              },
              {
                icon: "✅",
                title: "Гарантирана покупка",
                desc: "Ако одобрим, ние купуваме",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "clamp(1.25rem, 4vw, 2rem)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                  {benefit.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#f0f0ee",
                    marginBottom: "0.5rem",
                  }}
                >
                  {benefit.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section
        style={{
          padding: "clamp(2.5rem, 7vw, 4rem) 1rem",
          maxWidth: 900,
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
          ПОПЪЛНИ ФОРМАТА
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "clamp(1.25rem, 4vw, 2rem)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Owner Info */}
          <div
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#60a5fa",
                marginBottom: "1rem",
              }}
            >
              ИНФОРМАЦИЯ ЗА СОБСТВЕНИКА
            </h3>

            <div
              className="sell-car-form-row"
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
                  Име *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={e =>
                    setFormData({ ...formData, ownerName: e.target.value })
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
                  Телефон *
                </label>
                <input
                  type="tel"
                  required
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
            </div>

            <div style={{ marginTop: "1rem" }}>
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
          </div>

          {/* Car Info */}
          <div
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#60a5fa",
                marginBottom: "1rem",
              }}
            >
              ИНФОРМАЦИЯ ЗА АВТОМОБИЛА
            </h3>

            <div
              className="sell-car-form-row"
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
                  Марка *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={e =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="BMW, Mercedes-Benz..."
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
                  Модел *
                </label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={e =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  placeholder="E90, C-Class..."
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
                  Година
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={e =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  placeholder="2020"
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
                  Пробег (км)
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={e =>
                    setFormData({ ...formData, mileage: e.target.value })
                  }
                  placeholder="150000"
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

            <div style={{ marginTop: "1rem" }}>
              <label
                style={{
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Състояние
              </label>
              <select
                value={formData.condition}
                onChange={e =>
                  setFormData({ ...formData, condition: e.target.value })
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
                <option value="">Изберете състояние</option>
                {CAR_CONDITIONS.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                color: "#9ca3af",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Допълнително описание
            </label>
            <textarea
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Опишете състоянието, историята на ремонти, специални характеристики..."
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#f0f0ee",
                fontSize: "1rem",
                minHeight: 120,
                fontFamily: "inherit",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={notifyMutation.isPending}
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
            {notifyMutation.isPending ? "Изпращане..." : "Изпрати заявка"}
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
}
