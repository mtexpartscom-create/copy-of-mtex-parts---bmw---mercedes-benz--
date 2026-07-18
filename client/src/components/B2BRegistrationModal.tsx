/**
 * B2B Registration Modal
 * Allows users to register as B2B and request approval
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

interface B2BRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function B2BRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: B2BRegistrationModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    companyName: "",
    companyTaxId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerMutation = trpc.ecommerce.b2b.register.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Моля, влезте в системата първо");
      return;
    }

    if (!formData.companyName.trim()) {
      toast.error("Моля, въведете име на компания");
      return;
    }

    if (!formData.companyTaxId.trim()) {
      toast.error("Моля, въведете ДДС номер");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerMutation.mutateAsync({
        userType: "b2b",
        companyName: formData.companyName,
        companyTaxId: formData.companyTaxId,
      });

      toast.success(
        "Регистрацията е успешна! Администраторът ще одобри вашия профил скоро."
      );
      setFormData({ companyName: "", companyTaxId: "" });
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Грешка при регистрацията");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Регистрирайте се като B2B</DialogTitle>
          <DialogDescription>
            Получете 15% отстъпка на всички покупки след одобрение
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Име на компания *</label>
            <Input
              placeholder="Вашата компания"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="text-sm font-medium">ДДС номер *</label>
            <Input
              placeholder="BG123456789"
              value={formData.companyTaxId}
              onChange={(e) =>
                setFormData({ ...formData, companyTaxId: e.target.value })
              }
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm text-blue-900 dark:text-blue-100">
            <p className="font-medium mb-1">Преимущества на B2B:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>15% отстъпка на всички продукти</li>
              <li>Приоритетна поддръжка</li>
              <li>Специални условия за оптови поръчки</li>
            </ul>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмени
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Обработка..." : "Регистрирай се"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
