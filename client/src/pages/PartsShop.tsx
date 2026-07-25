/*
  MTEX PARTS – Parts Shop Page
  Online store for automotive parts
  Displays parts catalog with advanced search and filters
*/

import GlobalNavigation from "@/components/GlobalNavigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { useEffect, useState, useMemo } from "react";
import { setSEOMetadata, SEO_PAGES } from "@/lib/seo";
import { Search, Filter, ShoppingCart, X, ChevronDown } from "lucide-react";

export default function PartsShop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSEOMetadata(SEO_PAGES.partsShop || {
      title: "Онлайн магазин за авточасти | MTEX PARTS",
      description: "Разгледайте нашия каталог с авточасти за BMW и Mercedes-Benz. Оригинални и качествени части.",
      keywords: "авточасти, онлайн магазин, BMW, Mercedes-Benz, части за автомобили",
    });
  }, []);

  const PARTS_CATEGORIES = [
    { name: "Двигател", icon: "🔧", count: 245 },
    { name: "Спирачна система", icon: "🛑", count: 189 },
    { name: "Ходова част", icon: "🚗", count: 312 },
    { name: "Електрика", icon: "⚡", count: 156 },
    { name: "Охлаждане", icon: "❄️", count: 98 },
    { name: "Издув", icon: "💨", count: 67 },
  ];

  const ALL_PARTS = [
    {
      id: 1,
      name: "Спортни спирачки M Performance",
      brand: "BMW",
      model: "M5",
      category: "Спирачна система",
      price: 1899,
      image: "🛑",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Турбо компресор",
      brand: "Mercedes-Benz",
      model: "AMG C63",
      category: "Двигател",
      price: 3299,
      image: "⚡",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Амортисьори спортни",
      brand: "BMW",
      model: "M3",
      category: "Ходова част",
      price: 1599,
      image: "🚗",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Масло за двигател 5W-30",
      brand: "Motul",
      model: "Universal",
      category: "Двигател",
      price: 89,
      image: "🔧",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Въздушен филтър",
      brand: "BMW",
      model: "M5",
      category: "Двигател",
      price: 299,
      image: "💨",
      rating: 4.5,
    },
    {
      id: 6,
      name: "Спирачни накладки",
      brand: "Mercedes-Benz",
      model: "E63 AMG",
      category: "Спирачна система",
      price: 450,
      image: "🛑",
      rating: 4.8,
    },
    {
      id: 7,
      name: "Радиатор охлаждане",
      brand: "BMW",
      model: "M3",
      category: "Охлаждане",
      price: 899,
      image: "❄️",
      rating: 4.7,
    },
    {
      id: 8,
      name: "Спортен издув",
      brand: "Mercedes-Benz",
      model: "C63",
      category: "Издув",
      price: 2499,
      image: "💨",
      rating: 4.9,
    },
  ];

  const BRANDS = ["BMW", "Mercedes-Benz", "Motul"];
  const MODELS = {
    BMW: ["M5", "M3", "M440i"],
    "Mercedes-Benz": ["AMG C63", "E63 AMG", "C63"],
    Motul: ["Universal"],
  };

  // Filter parts based on search and filters
  const filteredParts = useMemo(() => {
    return ALL_PARTS.filter((part) => {
      const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = !selectedBrand || part.brand === selectedBrand;
      const matchesModel = !selectedModel || part.model === selectedModel;
      const matchesPrice = part.price >= priceRange[0] && part.price <= priceRange[1];

      return matchesSearch && matchesBrand && matchesModel && matchesPrice;
    });
  }, [searchQuery, selectedBrand, selectedModel, priceRange]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBrand(null);
    setSelectedModel(null);
    setPriceRange([0, 5000]);
  };

  const activeFiltersCount = [
    searchQuery ? 1 : 0,
    selectedBrand ? 1 : 0,
    selectedModel ? 1 : 0,
    priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div style={{ background: "#0d0e10", minHeight: "100vh" }}>
      <GlobalNavigation />
      <Breadcrumb items={[
        { label: "Начало", href: "/" },
        { label: "Услуги", href: "#" },
        { label: "Авточасти" },
      ]} />

      {/* Hero Section */}
      <section
        style={{
          padding: "4rem 1rem",
          maxWidth: 1280,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "#f0f0ee",
            marginBottom: "1rem",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Онлайн магазин за авточасти
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#9ca3af",
            marginBottom: "2rem",
            maxWidth: 600,
            margin: "0 auto 2rem",
          }}
        >
          Качествени оригинални и аналогни части за BMW и Mercedes-Benz
        </p>

        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            maxWidth: 700,
            margin: "0 auto 3rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 250,
              display: "flex",
              alignItems: "center",
              background: "#1a1b1f",
              border: "1px solid #2d2e34",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
            }}
          >
            <Search size={20} style={{ color: "#60a5fa", marginRight: "0.5rem" }} />
            <input
              type="text"
              placeholder="Търси части по име..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "#f0f0ee",
                fontSize: "1rem",
              }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.3s ease",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#2563eb";
            }}
          >
            <Filter size={18} />
            Филтри
            {activeFiltersCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section
          style={{
            padding: "2rem 1rem",
            maxWidth: 1280,
            margin: "0 auto",
            marginBottom: "2rem",
            background: "#1a1b1f",
            borderRadius: "0.75rem",
            border: "1px solid #2d2e34",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ color: "#f0f0ee", fontWeight: 700 }}>Филтри</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                style={{
                  background: "transparent",
                  border: "1px solid #2563eb",
                  color: "#2563eb",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#2563eb";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#2563eb";
                }}
              >
                Нулирай филтри
              </button>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Brand Filter */}
            <div>
              <label style={{ color: "#f0f0ee", fontWeight: 600, marginBottom: "0.75rem", display: "block" }}>
                Марка
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {BRANDS.map((brand) => (
                  <label
                    key={brand}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      color: "#9ca3af",
                    }}
                  >
                    <input
                      type="radio"
                      name="brand"
                      value={brand}
                      checked={selectedBrand === brand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.checked ? brand : null);
                        setSelectedModel(null);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                    {brand}
                  </label>
                ))}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    color: "#9ca3af",
                  }}
                >
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === null}
                    onChange={() => {
                      setSelectedBrand(null);
                      setSelectedModel(null);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  Всички марки
                </label>
              </div>
            </div>

            {/* Model Filter */}
            <div>
              <label style={{ color: "#f0f0ee", fontWeight: 600, marginBottom: "0.75rem", display: "block" }}>
                Модел
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {selectedBrand && MODELS[selectedBrand as keyof typeof MODELS] ? (
                  <>
                    {MODELS[selectedBrand as keyof typeof MODELS].map((model) => (
                      <label
                        key={model}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                          color: "#9ca3af",
                        }}
                      >
                        <input
                          type="radio"
                          name="model"
                          value={model}
                          checked={selectedModel === model}
                          onChange={(e) => setSelectedModel(e.target.checked ? model : null)}
                          style={{ cursor: "pointer" }}
                        />
                        {model}
                      </label>
                    ))}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        color: "#9ca3af",
                      }}
                    >
                      <input
                        type="radio"
                        name="model"
                        checked={selectedModel === null}
                        onChange={() => setSelectedModel(null)}
                        style={{ cursor: "pointer" }}
                      />
                      Всички модели
                    </label>
                  </>
                ) : (
                  <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                    Изберете марка първо
                  </p>
                )}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label style={{ color: "#f0f0ee", fontWeight: 600, marginBottom: "0.75rem", display: "block" }}>
                Цена: {priceRange[0]} лв. - {priceRange[1]} лв.
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newMin = Math.min(Number(e.target.value), priceRange[1]);
                    setPriceRange([newMin, priceRange[1]]);
                  }}
                  style={{ width: "100%" }}
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newMax = Math.max(Number(e.target.value), priceRange[0]);
                    setPriceRange([priceRange[0], newMax]);
                  }}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Info */}
      <section
        style={{
          padding: "1rem 1rem",
          maxWidth: 1280,
          margin: "0 auto",
          marginBottom: "2rem",
        }}
      >
        <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
          Намерени {filteredParts.length} части
          {activeFiltersCount > 0 && ` (филтрирани по ${activeFiltersCount} критерий)`}
        </p>
      </section>

      {/* Categories Section */}
      <section
        style={{
          padding: "2rem 1rem",
          maxWidth: 1280,
          margin: "0 auto",
          marginBottom: "3rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#f0f0ee",
            marginBottom: "2rem",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Категории
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          {PARTS_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              style={{
                padding: "1.5rem",
                background: "#1a1b1f",
                border: "1px solid #2d2e34",
                borderRadius: "0.75rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#252a33";
                el.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#1a1b1f";
                el.style.borderColor = "#2d2e34";
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {cat.icon}
              </div>
              <div style={{ color: "#f0f0ee", fontWeight: 600, marginBottom: "0.25rem" }}>
                {cat.name}
              </div>
              <div style={{ color: "#60a5fa", fontSize: "0.875rem" }}>
                {cat.count} части
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Parts Grid */}
      <section
        style={{
          padding: "2rem 1rem",
          maxWidth: 1280,
          margin: "0 auto",
          marginBottom: "3rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#f0f0ee",
            marginBottom: "2rem",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {filteredParts.length > 0 ? "Резултати" : "Няма намерени части"}
        </h2>

        {filteredParts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredParts.map((part) => (
              <div
                key={part.id}
                style={{
                  background: "#1a1b1f",
                  border: "1px solid #2d2e34",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "#2563eb";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "#2d2e34";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    padding: "2rem",
                    background: "#252a33",
                    textAlign: "center",
                    fontSize: "3rem",
                  }}
                >
                  {part.image}
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ color: "#60a5fa", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                    {part.brand} • {part.model}
                  </div>
                  <h3
                    style={{
                      color: "#f0f0ee",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      minHeight: "2.5rem",
                      fontSize: "0.95rem",
                    }}
                  >
                    {part.name}
                  </h3>
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.875rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {part.category}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{ color: "#2563eb", fontSize: "1.25rem", fontWeight: 700 }}>
                      {part.price} лв.
                    </div>
                    <div style={{ color: "#f59e0b", fontSize: "0.875rem" }}>
                      ⭐ {part.rating}
                    </div>
                  </div>
                  <button
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#2563eb";
                    }}
                  >
                    <ShoppingCart size={18} />
                    Добави в кошница
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              background: "#1a1b1f",
              borderRadius: "0.75rem",
              border: "1px solid #2d2e34",
            }}
          >
            <p style={{ color: "#9ca3af", marginBottom: "1rem" }}>
              Няма части, които отговарят на вашите критерии за търсене.
            </p>
            <button
              onClick={handleResetFilters}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#2563eb";
              }}
            >
              Нулирай филтри
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
