/**
 * Shopping Cart Sidebar Component
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface ShoppingCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
}

export default function ShoppingCartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateCart,
}: ShoppingCartSidebarProps) {
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerCity: "",
    customerEmail: "",
    econtOffice: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOrderMutation = trpc.ecommerce.orders.create.useMutation();

  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.-]/g, "")) || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleUpdateQuantity = (productId: number, change: number) => {
    const updated = cart.map((item) => {
      if (item.productId === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    onUpdateCart(updated);
  };

  const handleRemoveItem = (productId: number) => {
    onUpdateCart(cart.filter((item) => item.productId !== productId));
  };

  const handleSubmitOrder = async () => {
    // Validate form
    if (!formData.customerName.trim()) {
      toast.error("Моля, въведете вашето име");
      return;
    }
    if (!formData.customerPhone.trim()) {
      toast.error("Моля, въведете телефонния номер");
      return;
    }
    if (!formData.econtOffice.trim()) {
      toast.error("Моля, изберете офис на Еконт");
      return;
    }
    if (cart.length === 0) {
      toast.error("Кошницата е празна");
      return;
    }

    setIsSubmitting(true);

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      await createOrderMutation.mutateAsync({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerCity: formData.customerCity || 'Unknown',
        customerEmail: formData.customerEmail,
        econtOffice: formData.econtOffice,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: totalPrice.toFixed(2),
        paymentMethod: 'cash_on_delivery',
      });

      toast.success("Поръчката е изпратена успешно!");
      onUpdateCart([]); // Clear cart
      setStep("cart");
      setFormData({
        customerName: "",
        customerPhone: "",
        customerCity: "",
        customerEmail: "",
        econtOffice: "",
        notes: "",
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Грешка при изпращане на поръчката");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[500px] flex flex-col">
        <SheetHeader>
          <SheetTitle>
            {step === "cart" ? "Кошница" : "Оформяне на поръчка"}
          </SheetTitle>
          <SheetDescription>
            {step === "cart"
              ? `${cart.length} артикула`
              : "Попълнете данните си за доставка"}
          </SheetDescription>
        </SheetHeader>

        {step === "cart" ? (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Кошницата е празна
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 bg-muted p-3 rounded-lg"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, -1)}
                          className="p-1 hover:bg-background rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, 1)}
                          className="p-1 hover:bg-background rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Общо:</span>
                  <span>{totalPrice.toFixed(2)} лв.</span>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setStep("checkout")}
                >
                  Оформи поръчка
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Checkout Form */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Име *</label>
                <Input
                  placeholder="Вашето име"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Телефон *</label>
                <Input
                  placeholder="+359 888 123 456"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Офис на Еконт *</label>
                <Input
                  placeholder="Адрес на офис"
                  value={formData.econtOffice}
                  onChange={(e) =>
                    setFormData({ ...formData, econtOffice: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Бележки</label>
                <Textarea
                  placeholder="Допълнителни бележки..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>

              {/* Order Summary */}
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <h4 className="font-semibold text-sm">Резюме на поръчката:</h4>
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>
                      {(parseFloat(item.price.replace(/[^\d.-]/g, "")) * item.quantity).toFixed(2)} лв.
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Общо:</span>
                  <span>{totalPrice.toFixed(2)} лв.</span>
                </div>
              </div>
            </div>

            {/* Checkout Actions */}
            <div className="border-t pt-4 space-y-2">
              <Button
                size="lg"
                className="w-full"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Изпращане..." : "Изпрати поръчка"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setStep("cart")}
                disabled={isSubmitting}
              >
                Назад
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
