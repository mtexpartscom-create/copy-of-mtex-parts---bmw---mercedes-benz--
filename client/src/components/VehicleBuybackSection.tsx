import { useState } from "react";
import { Upload } from "lucide-react";

export default function VehicleBuybackSection() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    condition: "",
    photos: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buyback form submitted:", formData);
    alert("Благодарим! Ще се свържем с вас скоро.");
    setFormData({ make: "", model: "", year: "", condition: "", photos: [] });
  };

  return (
    <section
      id="buyback"
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
            Продай автомобила си за части
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
            Бързо оценяване и изкупуване на вашия автомобил
          </p>
        </div>

        {/* Form */}
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "2rem",
            background: "rgba(51, 204, 255, 0.05)",
            border: "1px solid rgba(51, 204, 255, 0.2)",
            borderRadius: 12,
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Make */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#33CCFF",
                  marginBottom: "0.5rem",
                }}
              >
                Марка
              </label>
              <input
                type="text"
                placeholder="Напр. BMW, Mercedes, Audi"
                value={formData.make}
                onChange={(e) =>
                  setFormData({ ...formData, make: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(51, 204, 255, 0.3)",
                  borderRadius: 8,
                  color: "#f0f0ee",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Model */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#33CCFF",
                  marginBottom: "0.5rem",
                }}
              >
                Модел
              </label>
              <input
                type="text"
                placeholder="Напр. E46, C-Class, A4"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(51, 204, 255, 0.3)",
                  borderRadius: 8,
                  color: "#f0f0ee",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Year */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#33CCFF",
                  marginBottom: "0.5rem",
                }}
              >
                Година
              </label>
              <input
                type="number"
                placeholder="Напр. 2015"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(51, 204, 255, 0.3)",
                  borderRadius: 8,
                  color: "#f0f0ee",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Condition */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#33CCFF",
                  marginBottom: "0.5rem",
                }}
              >
                Състояние
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(51, 204, 255, 0.3)",
                  borderRadius: 8,
                  color: "#f0f0ee",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Изберете състояние</option>
                <option value="technical">Технически дефект</option>
                <option value="crashed">Катастрофирана</option>
                <option value="scrapped">За разбиране</option>
              </select>
            </div>

            {/* Photo Upload */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#33CCFF",
                  marginBottom: "0.5rem",
                }}
              >
                Снимки (до 5)
              </label>
              <div
                style={{
                  padding: "1.5rem",
                  border: "2px dashed rgba(51, 204, 255, 0.3)",
                  borderRadius: 8,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(51, 204, 255, 0.6)";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(51, 204, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(51, 204, 255, 0.3)";
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
                <Upload
                  size={24}
                  style={{ margin: "0 auto 0.5rem", color: "#33CCFF" }}
                />
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.9rem",
                    color: "#9ca3af",
                    margin: 0,
                  }}
                >
                  Кликнете или плъзнете снимки тук
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).slice(0, 5);
                    setFormData({ ...formData, photos: files });
                  }}
                  style={{
                    display: "none",
                  }}
                />
              </div>
              {formData.photos.length > 0 && (
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.85rem",
                    color: "#33CCFF",
                    marginTop: "0.5rem",
                  }}
                >
                  Избрани снимки: {formData.photos.length}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                padding: "1rem",
                background: "#003399",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#0052CC";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 24px rgba(0, 51, 153, 0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#003399";
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              Изпрати за оценка
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
