/*
 * Product Catalog Page
 * Каталог на авточасти за продажба
 * Same design as Home page for consistent UX
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Search, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import ProductDetailModal from "@/components/ProductDetailModal";
import ShoppingCartSidebar from "@/components/ShoppingCartSidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

const brands = ["BMW", "Mercedes-Benz"];

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch categories
  const { data: categories = [] } = trpc.ecommerce.categories.getAll.useQuery();

  // Fetch products
  const { data: products = [] } = trpc.ecommerce.products.getAll.useQuery({
    categoryId: selectedCategory,
    search: searchQuery,
    status: "active",
  });

  // Filter products by brand
  const filteredProducts = products.filter((p) => {
    if (selectedBrand === "all") return true;
    return p.compatibleBrands?.includes(selectedBrand);
  });

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: any) => {
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.primaryImageUrl || "",
        },
      ]);
    }
    toast.success(`${product.name} добавена в кошницата`);
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <div style={{ background: "#0d0e10", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #1a1d22 0%, #15171a 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "clamp(2rem, 5vh, 4rem) 0",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
          position: "relative",
          zIndex: 1,
        }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.75rem, 5vw, 5rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "#f0f0ee",
            marginBottom: "1rem",
          }}>
            Каталог<br />
            <span style={{ color: "#2563eb" }}>Авточасти</span>
          </h1>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
            color: "#9ca3af",
            lineHeight: 1.6,
            maxWidth: "600px",
          }}>
            Качествени OEM авточасти за BMW и Mercedes-Benz. Намерете нужната вам част от нашия богат склад.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        background: "#0d0e10",
        padding: "2rem 0",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
        }}>
          <style>{`
            @media (min-width: 768px) {
              .catalog-grid {
                grid-template-columns: 1fr 3fr !important;
                gap: 2rem !important;
              }
            }
          `}</style>
          <div className="catalog-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
          }}>
            {/* Sidebar - Filters */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "1.5rem",
              height: "fit-content",
              position: "sticky",
              top: "1rem",
            }}>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#f0f0ee",
                marginBottom: "1rem",
              }}>
                Филтри
              </h3>

              {/* Search */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                  marginBottom: "0.5rem",
                }}>
                  Търсене
                </label>
                <div style={{ position: "relative" }}>
                  <Search size={16} style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "0.75rem",
                    color: "#6b7280",
                  }} />
                  <Input
                    placeholder="Търси части..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      paddingLeft: "2.25rem",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      color: "#f0f0ee",
                    }}
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                  marginBottom: "0.5rem",
                }}>
                  Марка
                </label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    color: "#f0f0ee",
                  }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всички марки</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                  marginBottom: "0.5rem",
                }}>
                  Категория
                </label>
                <Select
                  value={selectedCategory?.toString() || "all"}
                  onValueChange={(val) =>
                    setSelectedCategory(val === "all" ? undefined : parseInt(val))
                  }
                >
                  <SelectTrigger style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    color: "#f0f0ee",
                  }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всички категории</SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cart Summary */}
              <Button
                onClick={() => setIsCartOpen(true)}
                style={{
                  width: "100%",
                  background: "#2563eb",
                  color: "#f0f0ee",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <ShoppingCart size={18} />
                Кошница ({cart.length})
              </Button>
            </div>

            {/* Main Content - Products Grid */}
            <div>
              {filteredProducts.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "3rem",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "1.1rem",
                    color: "#9ca3af",
                  }}>
                    Няма намерени части. Опитайте други филтри.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "1.5rem",
                }}>
                  {filteredProducts.map((product: any) => (
                    <div
                      key={product.id}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(37,99,235,0.5)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      }}
                    >
                      {/* Product Image */}
                      <div style={{
                        background: "rgba(255,255,255,0.02)",
                        height: "200px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        {product.primaryImageUrl ? (
                          <img
                            src={product.primaryImageUrl}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div style={{
                            color: "#6b7280",
                            fontSize: "0.875rem",
                          }}>
                            Няма изображение
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div style={{ padding: "1rem" }}>
                        <h3 style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#f0f0ee",
                          marginBottom: "0.5rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {product.name}
                        </h3>

                        <p style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "0.875rem",
                          color: "#9ca3af",
                          marginBottom: "1rem",
                          lineHeight: 1.4,
                          minHeight: "2.4rem",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}>
                          {product.description || "Качествена авточаст"}
                        </p>

                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}>
                          <span style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            color: "#2563eb",
                          }}>
                            {product.price} лв.
                          </span>
                          {product.compatibleBrands && (
                            <span style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              background: "rgba(255,255,255,0.05)",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "4px",
                            }}>
                              {product.compatibleBrands.join(", ")}
                            </span>
                          )}
                        </div>

                        <div style={{
                          display: "flex",
                          gap: "0.5rem",
                        }}>
                          <Button
                            onClick={() => handleViewDetails(product)}
                            style={{
                              flex: 1,
                              background: "rgba(37,99,235,0.1)",
                              color: "#2563eb",
                              border: "1px solid rgba(37,99,235,0.3)",
                              padding: "0.5rem",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                            }}
                          >
                            Детайли
                          </Button>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            style={{
                              flex: 1,
                              background: "#2563eb",
                              color: "#f0f0ee",
                              border: "none",
                              padding: "0.5rem",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <ShoppingCart size={14} />
                            Добави
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      {isCartOpen && (
        <ShoppingCartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateCart={setCart}
        />
      )}

      <Footer />
    </div>
  );
}
