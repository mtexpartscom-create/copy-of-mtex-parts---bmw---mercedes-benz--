import { Phone } from "lucide-react";

export default function RoadAssistanceSection() {
  return (
    <section
      id="road-assistance"
      style={{
        padding: "clamp(2rem, 8vw, 5rem) 1rem",
        background: "#0d0e10",
        borderTop: "1px solid rgba(51, 204, 255, 0.1)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
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
            Денонощна Пътна Помощ
          </h2>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "1rem",
              color: "#9ca3af",
              lineHeight: 1.7,
              maxWidth: 700,
            }}
          >
            Бърза реакция и сигурност на пътя. Ние сме тук за вас 24/7.
          </p>
        </div>

        {/* Services List */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {[
            {
              title: "Репатриране",
              desc: "Репатриране на катастрофирали, повредени или блокирали автомобили, джипове и бусове",
              icon: "🚗",
            },
            {
              title: "Съдействие на място",
              desc: "Подаване на ток, смяна на гуми, доставка на гориво",
              icon: "🔋",
            },
            {
              title: "Превоз до сервиз",
              desc: "Превоз на превозни средства до наш сервиз или избран адрес",
              icon: "🚚",
            },
            {
              title: "Денонощна услуга",
              desc: "Достъпна всеки ден, всеки час - без почивни дни",
              icon: "⏰",
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
                  margin: 0,
                }}
              >
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Emergency CTA Button */}
        <div style={{ textAlign: "center" }}>
          <a
            href="tel:+359898606626"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1.25rem 2.5rem",
              background: "#003399",
              color: "#fff",
              borderRadius: 10,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              textDecoration: "none",
              transition: "all 0.3s ease",
              border: "2px solid #003399",
              animation: "pulse 2s infinite",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#0052CC";
              (e.currentTarget as HTMLElement).style.borderColor = "#0052CC";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 12px 32px rgba(0, 51, 153, 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#003399";
              (e.currentTarget as HTMLElement).style.borderColor = "#003399";
              (e.currentTarget as HTMLElement).style.transform = "none";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <Phone size={24} />
            Позвъни за Пътна Помощ
          </a>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </section>
  );
}
