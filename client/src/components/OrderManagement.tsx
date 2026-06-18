/**
 * Order Management Component for Admin Panel
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Truck, Package } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Чакащо", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Потвърдено", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Изпратено", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Доставено", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Отменено", color: "bg-red-100 text-red-800" },
};

export default function OrderManagement() {
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "confirmed" | "shipped" | "delivered" | "cancelled">("pending");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch orders
  const { data: orders = [], refetch: refetchOrders } =
    trpc.ecommerce.orders.getAll.useQuery({
      status: selectedStatus,
    });

  // Update order mutation
  const updateOrderMutation = trpc.ecommerce.orders.updateStatus.useMutation();

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderMutation.mutateAsync({
        id: orderId,
        status: newStatus as any,
      });
      toast.success("Статусът е обновен");
      refetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Грешка при обновяване на статуса");
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statuses = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(currentStatus);
    return currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold">Управление на Поръчки</h2>

      {/* Status Filter */}
      <div>
        <Select value={selectedStatus || "pending"} onValueChange={(value) => setSelectedStatus(value as "pending" | "confirmed" | "shipped" | "delivered" | "cancelled")}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Чакащи</SelectItem>
            <SelectItem value="confirmed">Потвърдени</SelectItem>
            <SelectItem value="shipped">Изпратени</SelectItem>
            <SelectItem value="delivered">Доставени</SelectItem>
            <SelectItem value="cancelled">Отменени</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Няма поръчки със този статус
          </div>
        ) : (
          orders.map((order: any) => (
            <Card key={order.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Order Info */}
                <div>
                  <p className="text-sm text-muted-foreground">Поръчка №</p>
                  <p className="font-semibold">#{order.id}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(order.createdAt).toLocaleDateString("bg-BG")}
                  </p>
                </div>

                {/* Customer Info */}
                <div>
                  <p className="text-sm text-muted-foreground">Клиент</p>
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customerPhone}
                  </p>
                </div>

                {/* Order Amount */}
                <div>
                  <p className="text-sm text-muted-foreground">Сума</p>
                  <p className="font-semibold text-lg">{order.totalPrice} лв.</p>
                  <p className="text-xs text-muted-foreground">
                    {(() => {
                      try {
                        const items = JSON.parse(order.items);
                        return `${items.length} артикула`;
                      } catch {
                        return "Артикули";
                      }
                    })()}
                  </p>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col gap-2">
                  <Badge className={statusLabels[order.status]?.color || ""}>
                    {statusLabels[order.status]?.label || order.status}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Детайли
                  </Button>

                  {getNextStatus(order.status) && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          getNextStatus(order.status)!
                        )
                      }
                      disabled={updateOrderMutation.isPending}
                    >
                      {order.status === "pending" && (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Потвърди
                        </>
                      )}
                      {order.status === "confirmed" && (
                        <>
                          <Truck className="w-3 h-3 mr-1" />
                          Изпрати
                        </>
                      )}
                      {order.status === "shipped" && (
                        <>
                          <Package className="w-3 h-3 mr-1" />
                          Доставено
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Детайли на Поръчка #{selectedOrder.id}</DialogTitle>
              <DialogDescription>
                {new Date(selectedOrder.createdAt).toLocaleString("bg-BG")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Информация на Клиента</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Име</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Телефон</p>
                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedOrder.customerEmail}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Офис Еконт</p>
                    <p className="font-medium">{selectedOrder.econtOffice}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Артикули</h3>
                <div className="space-y-2">
                  {(() => {
                    try {
                      const items = JSON.parse(selectedOrder.items);
                      return items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm border-b pb-2"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-muted-foreground">
                              x{item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            {(parseFloat(item.price) * item.quantity).toFixed(2)} лв.
                          </p>
                        </div>
                      ));
                    } catch {
                      return <p className="text-muted-foreground">Няма артикули</p>;
                    }
                  })()}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Общо:</span>
                  <span>{selectedOrder.totalPrice} лв.</span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold mb-3">Обновяване на Статус</h3>
                <div className="flex gap-2">
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(newStatus) =>
                      handleUpdateStatus(selectedOrder.id, newStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Чакащо</SelectItem>
                      <SelectItem value="confirmed">Потвърдено</SelectItem>
                      <SelectItem value="shipped">Изпратено</SelectItem>
                      <SelectItem value="delivered">Доставено</SelectItem>
                      <SelectItem value="cancelled">Отменено</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
