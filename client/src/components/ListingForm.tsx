/**
 * Listing Form Component
 * Форма за създаване и редактиране на обяви на автомобили
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

interface ListingFormProps {
  onSuccess?: () => void;
  initialData?: {
    id: number;
    make: string;
    model: string;
    year?: number;
    engine?: string;
    transmission?: string;
    mileage?: number;
    price?: string;
    description?: string;
    primaryImageUrl?: string;
  };
}

export default function ListingForm({ onSuccess, initialData }: ListingFormProps) {
  const [formData, setFormData] = useState({
    make: initialData?.make || "",
    model: initialData?.model || "",
    year: initialData?.year || new Date().getFullYear(),
    engine: initialData?.engine || "",
    transmission: initialData?.transmission || "",
    mileage: initialData?.mileage || 0,
    price: initialData?.price || "",
    description: initialData?.description || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.primaryImageUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const createListingMutation = trpc.crm.listings.create.useMutation({
    onSuccess: () => {
      toast.success("Обява създадена успешно");
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        engine: "",
        transmission: "",
        mileage: 0,
        price: "",
        description: "",
      });
      setImageFile(null);
      setImagePreview("");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Грешка при създаване на обява");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate and convert numeric fields
      const year = parseInt(String(formData.year)) || new Date().getFullYear();
      const mileage = parseInt(String(formData.mileage)) || 0;

      if (isNaN(year) || isNaN(mileage)) {
        toast.error("Година и пробег трябва да бъдат числа");
        setIsLoading(false);
        return;
      }

      // For now, use image preview as URL
      // In production, upload to storage and get URL
      createListingMutation.mutate({
        ...formData,
        year,
        mileage,
        primaryImageUrl: imagePreview || undefined,
      });
    } catch (error) {
      toast.error("Грешка при обработка на снимката");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Редактиране на обява" : "Нова обява"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make">Производител</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                placeholder="BMW, Mercedes-Benz..."
                required
              />
            </div>
            <div>
              <Label htmlFor="model">Модел</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="3 Series, C-Class..."
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Година</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="engine">Двигател</Label>
              <Input
                id="engine"
                value={formData.engine}
                onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                placeholder="2.0L, 3.0L..."
              />
            </div>
            <div>
              <Label htmlFor="transmission">Трансмисия</Label>
              <Input
                id="transmission"
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                placeholder="Автоматична, Механична..."
              />
            </div>
            <div>
              <Label htmlFor="mileage">Пробег (км)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="price">Цена</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="€ 15,000"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Детайли за автомобила..."
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label>Снимка</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded" />
                    <p className="text-sm text-muted-foreground">Кликни за смяна</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm">Кликни или пусни снимка</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Обработка..." : initialData ? "Актуализиране" : "Създаване"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
