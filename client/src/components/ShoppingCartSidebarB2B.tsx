/**
 * Shopping Cart Sidebar Component with B2B Support
 * Includes 15% discount for approved B2B users
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import EkontSelector from "./EkontSelector";
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

interface ShoppingCartSidebarB2BProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
}

export default function ShoppingCartSidebarB2B({
  isOpen,
  onClose,
  cart,
  onUpdateCart,
}: ShoppingCartSidebarB2BProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    econtOffice: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [shippingCost, setShippingCost] = useState<number>(0);

  const createOrderMutation = trpc.ecommerce.orders.create.useMutation();

  // Calculate B2B discount
  const isB2BApproved =
    user?.userType === "b2b" && user?.b2bApprovalStatus === "approved";
  const b2bDiscount = isB2BApproved ? 0.15 : 0; // 15% discount

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.-]/g, "")) || 0;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = subtotal * b2bDiscount;
  const totalPrice = subtotal - discountAmount + shippingCost;

  const handleUpdateQuantity = (productId: number, change: number) => {
    const updated = cart
      .map((item) => {
        if (item.productId === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

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
        customerEmail: formData.customerEmail,
        econtOffice: formData.econtOffice,
        items: JSON.stringify(items),
        totalPrice: totalPrice.toFixed(2),
      });

      toast.success("Поръчката е изпратена успешно!");
      onUpdateCart([]); // Clear cart
      setStep("cart");
      setFormData({
        customerName: "",
        customerPhone: "",
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
          {isB2BApproved && (
            <div className="text-xs font-medium text-green-600 dark:text-green-400 mt-2">
              ✓ B2B отстъпка 15% активна
            </div>
          )}
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
                          onClick={() =>
                            handleUpdateQuantity(item.productId, -1)
                          }
                          className="p-1 hover:bg-background rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.productId, 1)
                          }
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
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Подсумма:</span>
                    <span>{subtotal.toFixed(2)} лв.</span>
                  </div>
                  {isB2BApproved && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>B2B отстъпка (15%):</span>
                      <span>-{discountAmount.toFixed(2)} лв.</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
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

              {/* Ekont Selector */}
              <EkontSelector
                onCityChange={(cityId) => {
                  setSelectedCity(cityId);
                  setFormData({ ...formData, econtOffice: "" });
                }}
                onOfficeChange={(officeId, officeName) => {
                  setFormData({ ...formData, econtOffice: officeName });
                }}
                onShippingCostChange={(cost) => setShippingCost(cost)}
              />

              <div>
                <label className="text-sm font-medium">Бележки</label>
                <Textarea
                  placeholder="Допълнителни инструкции..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="mt-1 min-h-20"
                />
              </div>

              {/* Order Summary in Checkout */}
              <div className="bg-muted p-3 rounded space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Подсумма:</span>
                  <span>{subtotal.toFixed(2)} лв.</span>
                </div>
                {isB2BApproved && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>B2B отстъпка (15%):</span>
                    <span>-{discountAmount.toFixed(2)} лв.</span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span>{shippingCost.toFixed(2)} лв.</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Общо за плащане:</span>
                  <span>{totalPrice.toFixed(2)} лв.</span>
                </div>
              </div>
            </div>

            {/* Checkout Actions */}
            <div className="border-t pt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("cart")}
                disabled={isSubmitting}
              >
                Назад
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Обработка..." : "Потвърди поръчка"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
