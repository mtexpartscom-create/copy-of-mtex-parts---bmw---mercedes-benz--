import { Phone } from "lucide-react";

export default function ACServiceSection() {
  return (
    <section
      id="ac-service"
      style={{
        padding: "clamp(2rem, 8vw, 5rem) 1rem",
        background: "#0d0e10",
        borderTop: "1px solid rgba(51, 204, 255, 0.1)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              fontWeight: 800,
              color: "#f0f0ee",
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Автоклиматици
          </h2>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "1rem",
              color: "#9ca3af",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Професионална диагностика и ремонт на системи за климатизация
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {[
            {
              title: "Зареждане с фреон",
              desc: "R134a и HFO-1234yf",
              icon: "❄️",
            },
            {
              title: "Диагностика за течове",
              desc: "Тестване с вакуум или UV оцветител",
              icon: "🔍",
            },
            {
              title: "Ремонт на компресори",
              desc: "Подмяна и ремонт на всички компоненти",
              icon: "🔧",
            },
            {
              title: "Подмяна на маркучи",
              desc: "Оригинални и качествени части",
              icon: "🛠️",
            },
          ].map((service, i) => (
            <div
              key={i}
              style={{
                padding: "1.5rem",
                background: "rgba(51, 204, 255, 0.05)",
                border: "1px solid rgba(51, 204, 255, 0.2)",
                borderRadius: 12,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(51, 204, 255, 0.1)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(51, 204, 255, 0.4)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(51, 204, 255, 0.05)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(51, 204, 255, 0.2)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {service.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#33CCFF",
                  marginBottom: "0.5rem",
                }}
              >
                {service.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.9rem",
                  color: "#9ca3af",
                  lineHeight: 1.5,
                }}
              >
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: "center" }}>
          <a
            href="tel:+359898606626"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem 2rem",
              background: "#003399",
              color: "#fff",
              borderRadius: 10,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              transition: "all 0.3s ease",
              border: "2px solid #003399",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#0052CC";
              (e.currentTarget as HTMLElement).style.borderColor = "#0052CC";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 24px rgba(0, 51, 153, 0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#003399";
              (e.currentTarget as HTMLElement).style.borderColor = "#003399";
              (e.currentTarget as HTMLElement).style.transform = "none";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <Phone size={20} />
            Запиши час за диагностика на климатик
          </a>
        </div>
      </div>
    </section>
  );
}
