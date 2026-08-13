import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import GlobalNavigation from "@/components/GlobalNavigation";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { calculateCheckoutTotals } from "@shared/checkout";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const isApprovedB2B = user?.userType === "b2b" && user?.b2bApprovalStatus === "approved";
  const checkoutTotals = calculateCheckoutTotals(
    items.map((item) => ({ price: item.price.toString(), quantity: item.quantity })),
    isApprovedB2B,
    5.99
  );
  const vatAmount = checkoutTotals.totalPrice * 0.2;
  const grandTotal = checkoutTotals.totalPrice + vatAmount;
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping Form
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  // Payment Form
  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [orderNumber, setOrderNumber] = useState("");
  const createOrderMutation = trpc.ecommerce.orders.create.useMutation();

  const breadcrumbItems = [
    { label: "Начало", href: "/" },
    { label: "Авточасти", href: "/parts-shop" },
    { label: "Количка", href: "/cart" },
    { label: "Завършване на Поръчката" },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNavigation />
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Количката е празна</h1>
          <Button onClick={() => setLocation("/parts-shop")} className="bg-blue-600">
            Към магазина
          </Button>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingData.firstName ||
      !shippingData.lastName ||
      !shippingData.email ||
      !shippingData.phone ||
      !shippingData.address ||
      !shippingData.city
    ) {
      toast.error("Моля, попълнете всички задължителни полета");
      return;
    }
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !paymentData.cardName ||
      !paymentData.cardNumber ||
      !paymentData.expiryDate ||
      !paymentData.cvv
    ) {
      toast.error("Моля, попълнете всички полета за плащане");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createOrderMutation.mutateAsync({
        customerName: `${shippingData.firstName} ${shippingData.lastName}`,
        customerPhone: shippingData.phone,
        econtOffice: shippingData.city,
        items: JSON.stringify(
          items.map((item) => ({
            partId: item.id,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
        totalPrice: grandTotal.toFixed(2),
        customerEmail: shippingData.email,
      });
      setOrderNumber(result?.id?.toString() || "ORD-" + Date.now());
      setStep("confirmation");
      clearCart();
      toast.success("Поръчката е създадена успешно!");
    } catch (error) {
      toast.error("Грешка при създаване на поръчката");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 sm:text-4xl">Завършване на Поръчката</h1>

        {/* Progress Steps */}
        <div className="flex gap-4 mb-8">
          <div
            className={`flex-1 p-4 rounded-lg text-center font-semibold ${
              step === "shipping" || step === "payment" || step === "confirmation"
                ? "bg-blue-600 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            1. Доставка
          </div>
          <div
            className={`flex-1 p-4 rounded-lg text-center font-semibold ${
              step === "payment" || step === "confirmation"
                ? "bg-blue-600 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            2. Плащане
          </div>
          <div
            className={`flex-1 p-4 rounded-lg text-center font-semibold ${
              step === "confirmation" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            3. Потвърждение
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle>Информация за Доставка</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="firstName">Име *</Label>
                        <Input
                          id="firstName"
                          value={shippingData.firstName}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, firstName: e.target.value })
                          }
                          placeholder="Иван"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Фамилия *</Label>
                        <Input
                          id="lastName"
                          value={shippingData.lastName}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, lastName: e.target.value })
                          }
                          placeholder="Иванов"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Имейл *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingData.email}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, email: e.target.value })
                        }
                        placeholder="ivan@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        value={shippingData.phone}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, phone: e.target.value })
                        }
                        placeholder="+359 898 123 456"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Адрес *</Label>
                      <Input
                        id="address"
                        value={shippingData.address}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, address: e.target.value })
                        }
                        placeholder="ул. Примерна 123"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="city">Град *</Label>
                        <Input
                          id="city"
                          value={shippingData.city}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, city: e.target.value })
                          }
                          placeholder="София"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Пощенски код</Label>
                        <Input
                          id="postalCode"
                          value={shippingData.postalCode}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, postalCode: e.target.value })
                          }
                          placeholder="1000"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Бележки</Label>
                      <Textarea
                        id="notes"
                        value={shippingData.notes}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, notes: e.target.value })
                        }
                        placeholder="Допълнителни инструкции за доставка..."
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Продължи към Плащане
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Информация за Плащане</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Име на Карта *</Label>
                      <Input
                        id="cardName"
                        value={paymentData.cardName}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, cardName: e.target.value })
                        }
                        placeholder="IVAN IVANOV"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Номер на Карта *</Label>
                      <Input
                        id="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, cardNumber: e.target.value })
                        }
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="expiryDate">Дата на Изтичане *</Label>
                        <Input
                          id="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={(e) =>
                            setPaymentData({ ...paymentData, expiryDate: e.target.value })
                          }
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={paymentData.cvv}
                          onChange={(e) =>
                            setPaymentData({ ...paymentData, cvv: e.target.value })
                          }
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("shipping")}
                        className="flex-1"
                      >
                        Назад
                      </Button>
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {isProcessing ? "Обработка..." : "Завърши Поръчката"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === "confirmation" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Поръчката е Успешна!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold">
                      Благодарим за вашата поръчка!
                    </p>
                    <p className="text-green-700 mt-2">
                      Номер на поръчката: <span className="font-bold">{orderNumber}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p>
                      <strong>Име:</strong> {shippingData.firstName} {shippingData.lastName}
                    </p>
                    <p>
                      <strong>Имейл:</strong> {shippingData.email}
                    </p>
                    <p>
                      <strong>Телефон:</strong> {shippingData.phone}
                    </p>
                    <p>
                      <strong>Адрес:</strong> {shippingData.address}, {shippingData.city}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setLocation("/parts-shop")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Продължи Пазаруване
                    </Button>
                    <Button onClick={() => setLocation("/")} variant="outline" className="flex-1">
                      Към Начало
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Резюме на Поръчката</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)} лв.
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Подсума:</span>
                    <span className="font-semibold">{checkoutTotals.subtotal.toFixed(2)} лв.</span>
                  </div>
                  {isApprovedB2B && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>B2B отстъпка (15%):</span>
                      <span className="font-semibold">−{checkoutTotals.discountAmount.toFixed(2)} лв.</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span className="font-semibold">5.99 лв.</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ДДС (20%):</span>
                    <span className="font-semibold">{vatAmount.toFixed(2)} лв.</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Общо:</span>
                    <span>
                      {grandTotal.toFixed(2)} лв.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
