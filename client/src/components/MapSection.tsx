/*
  MTEX PARTS – Map Section
  Design: Full-width Google Maps with location marker
  Shows MTEX PARTS location in Varna, Bulgaria
*/

import { useRef, useEffect } from "react";
import { MapView } from "./Map";
import { MapPin } from "lucide-react";

const MTEX_LOCATION = {
  lat: 43.2141,
  lng: 27.9147,
  name: "MTEX PARTS",
  address: "Варна, България",
};

export default function MapSection() {
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;

    // Add marker to the map
    if (window.google && window.google.maps && window.google.maps.marker) {
      new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: MTEX_LOCATION,
        title: MTEX_LOCATION.name,
      });
    }
  };

  return (
    <section
      style={{
        background: "#0d0e10",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Map container with rounded corners */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "3rem 2rem",
          position: "relative",
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            className="section-tag"
            style={{ marginBottom: "1rem" }}
          >
            Намерете нас
          </div>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              color: "#f0f0ee",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Местоположение на MTEX PARTS
          </h2>
        </div>

        {/* Map wrapper with border and shadow */}
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 16px 64px rgba(0,0,0,0.5)",
            height: 500,
            position: "relative",
          }}
        >
          <MapView
            initialCenter={MTEX_LOCATION}
            initialZoom={16}
            onMapReady={handleMapReady}
            className="w-full h-full"
          />
        </div>

        {/* Location info card below map */}
        <div
          style={{
            marginTop: "2rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Address info */}
          <div
            style={{
              padding: "1.5rem",
              background: "#15171a",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f59e0b",
                flexShrink: 0,
              }}
            >
              <MapPin size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.25rem",
                }}
              >
                Адрес
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#f0f0ee",
                  lineHeight: 1.5,
                }}
              >
                Варна, България
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                  marginTop: "0.5rem",
                }}
              >
                Централно местоположение в град Варна
              </div>
            </div>
          </div>

          {/* Directions info */}
          <div
            style={{
              padding: "1.5rem",
              background: "#15171a",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.75rem",
              }}
            >
              Отворено за посещение
            </div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.95rem",
                color: "#9ca3af",
                lineHeight: 1.8,
              }}
            >
              <p style={{ margin: "0 0 0.5rem 0" }}>
                <strong style={{ color: "#f0f0ee" }}>Телефон:</strong>{" "}
                <a
                  href="tel:+359898606626"
                  style={{ color: "#60a5fa", textDecoration: "none" }}
                >
                  +359 898 606 626
                </a>
              </p>
              <p style={{ margin: "0 0 0.5rem 0" }}>
                <strong style={{ color: "#f0f0ee" }}>Имейл:</strong>{" "}
                <a
                  href="mailto:mtexnika.parts@gmail.com"
                  style={{ color: "#60a5fa", textDecoration: "none" }}
                >
                  mtexnika.parts@gmail.com
                </a>
              </p>
              <p style={{ margin: "0" }}>
                <strong style={{ color: "#f0f0ee" }}>Достъп:</strong> По
                предварително договаряне
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
