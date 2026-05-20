/**
 * Product Catalog Page
 * Каталог на авточасти за продажба
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

interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

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

  const brands = ["BMW", "Mercedes"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Каталог на Авточасти</h1>
          <p className="text-blue-100">
            Качествени OEM авточасти за BMW и Mercedes-Benz
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 space-y-6 sticky top-4">
              <div>
                <h3 className="font-semibold mb-3">Търсене</h3>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Търси части..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Марка</h3>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
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

              <div>
                <h3 className="font-semibold mb-3">Категория</h3>
                <Select
                  value={selectedCategory?.toString() || "all"}
                  onValueChange={(val) =>
                    setSelectedCategory(val === "all" ? undefined : parseInt(val))
                  }
                >
                  <SelectTrigger>
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
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <Button
                  onClick={() => setIsCartOpen(true)}
                  className="w-full"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Кошница ({cart.length})
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content - Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Няма намерени части. Опитайте други филтри.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: any) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative bg-muted h-48 overflow-hidden">
                      {product.primaryImageUrl ? (
                        <img
                          src={product.primaryImageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Няма снимка
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">Изчерпана</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold line-clamp-2">{product.name}</h3>

                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {product.price}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {product.stock > 0 ? `${product.stock} в наличност` : "Изчерпана"}
                        </span>
                      </div>

                      {product.compatibleBrands && (
                        <p className="text-xs text-muted-foreground">
                          Съвместима с: {product.compatibleBrands}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleViewDetails(product)}
                        >
                          <ChevronRight className="w-4 h-4 mr-1" />
                          Детайли
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Добави
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={isDetailOpen}
        product={selectedProduct}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Sidebar */}
      <ShoppingCartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateCart={setCart}
      />
    </div>
  );
}
