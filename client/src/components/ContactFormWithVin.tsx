/**
 * Contact Form with VIN Decoder Integration
 * Позволява клиентите да въведат VIN и автоматично попълва информацията за автомобила
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import VinDecoderInput from "./VinDecoderInput";

export default function ContactFormWithVin() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vin: "",
    make: "",
    model: "",
    year: "",
    engine: "",
    partName: "",
    notes: "",
  });

  const createCustomerMutation = trpc.crm.customers.create.useMutation();
  const createInquiryMutation = trpc.crm.inquiries.create.useMutation();
  const createVehicleMutation = trpc.crm.vehicles.create.useMutation();

  const handleVinDecoded = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      vin: data.vin,
      make: data.make,
      model: data.model,
      year: data.year.toString(),
      engine: data.engine,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast.error("Име и телефон са задължителни");
      return;
    }

    try {
      // Create or get customer
      const customer = await createCustomerMutation.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
      });

      // If VIN is provided, create vehicle
      if (formData.vin && customer) {
        try {
          await createVehicleMutation.mutateAsync({
            customerId: customer.id,
            vin: formData.vin,
            make: formData.make || undefined,
            model: formData.model || undefined,
            year: formData.year ? parseInt(formData.year) : undefined,
            engine: formData.engine || undefined,
          });
        } catch (error) {
          console.log("Vehicle might already exist, continuing...");
        }
      }

      // Create parts inquiry
      if (formData.partName && customer) {
        await createInquiryMutation.mutateAsync({
          customerId: customer.id,
          vehicleId: undefined,
          partName: formData.partName,
          vin: formData.vin || undefined,
          notes: formData.notes || undefined,
          status: "pending",
        });
      }

      toast.success("Заявката е изпратена успешно! Ще се свържем с вас скоро.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        vin: "",
        make: "",
        model: "",
        year: "",
        engine: "",
        partName: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Грешка при изпращане на заявката");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Лични данни</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Име *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Вашето име"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Телефонен номер"
              required
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email адрес"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Information with VIN Decoder */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Информация за автомобила</h3>

        <VinDecoderInput onVinDecoded={handleVinDecoded} />

        {/* Auto-filled fields */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="make">Производител</Label>
            <Input
              id="make"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              placeholder="BMW, Mercedes..."
              className="mt-1"
              readOnly={!!formData.vin}
            />
          </div>

          <div>
            <Label htmlFor="model">Модел</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="3 Series, C-Class..."
              className="mt-1"
              readOnly={!!formData.vin}
            />
          </div>

          <div>
            <Label htmlFor="year">Година</Label>
            <Input
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="2020"
              className="mt-1"
              readOnly={!!formData.vin}
            />
          </div>

          <div>
            <Label htmlFor="engine">Двигател</Label>
            <Input
              id="engine"
              value={formData.engine}
              onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
              placeholder="2.0L"
              className="mt-1"
              readOnly={!!formData.vin}
            />
          </div>
        </div>
      </div>

      {/* Parts Inquiry */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Заявка за части</h3>

        <div>
          <Label htmlFor="partName">Търсена част *</Label>
          <Input
            id="partName"
            value={formData.partName}
            onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
            placeholder="Например: Маслен филтър, Спирачни накладки..."
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="notes">Допълнителни бележки</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Допълнителна информация за заявката..."
            rows={4}
            className="mt-1"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={createCustomerMutation.isPending || createInquiryMutation.isPending}
      >
        {createCustomerMutation.isPending || createInquiryMutation.isPending
          ? "Изпращане..."
          : "Изпращане на заявка"}
      </Button>
    </form>
  );
}
