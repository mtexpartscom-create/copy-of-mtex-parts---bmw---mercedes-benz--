import { useCart } from "@/contexts/CartContext";
import GlobalNavigation from "@/components/GlobalNavigation";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();

  const breadcrumbItems = [
    { label: "Начало", href: "/" },
    { label: "Авточасти", href: "/parts-shop" },
    { label: "Количка" },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNavigation />
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-4">Вашата количка е празна</h1>
            <p className="text-muted-foreground mb-8">
              Разгледайте нашия каталог с авточасти и добавете части в количката.
            </p>
            <Button
              onClick={() => setLocation("/parts-shop")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Към магазина
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 sm:text-4xl">Пазарска Количка</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Части ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.brand} {item.model}
                      </p>
                      <p className="text-sm font-medium mt-1">{item.price.toFixed(2)} лв.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right ml-4 min-w-24">
                      <p className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)} лв.
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="mt-4 flex gap-4">
              <Button
                variant="outline"
                onClick={() => setLocation("/parts-shop")}
              >
                Продължи Пазаруване
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700"
              >
                Изчисти Количка
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Резюме на Поръчката</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Брой части:</span>
                    <span className="font-semibold">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Обща количество:</span>
                    <span className="font-semibold">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Подсума:</span>
                    <span className="font-semibold">{getTotalPrice().toFixed(2)} лв.</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Доставка:</span>
                    <span className="font-semibold">Изчислява се</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span>ДДС:</span>
                    <span className="font-semibold">Изчислява се</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Общо:</span>
                    <span>{getTotalPrice().toFixed(2)} лв.</span>
                  </div>
                  <Button
                    onClick={() => setLocation("/checkout")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Към Завършване на Поръчката
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
