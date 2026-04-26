/**
 * Listing Form Component
 * Форма за създаване и редактиране на обяви на автомобили с поддръжка на множество снимки
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, GripVertical } from "lucide-react";

interface ListingImage {
  id?: number;
  file?: File;
  preview: string;
  displayOrder: number;
  isPrimary: boolean;
}

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

  const [images, setImages] = useState<ListingImage[]>(
    initialData?.primaryImageUrl
      ? [
          {
            preview: initialData.primaryImageUrl,
            displayOrder: 0,
            isPrimary: true,
          },
        ]
      : []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const createListingMutation = trpc.crm.listings.create.useMutation({
    onSuccess: (listing) => {
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
      setImages([]);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Грешка при създаване на обява");
    },
  });

  const createImageMutation = trpc.crm.listingImages.create.useMutation({
    onError: (error) => {
      toast.error(error.message || "Грешка при качване на снимка");
    },
  });

  const handleMultipleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: ListingImage = {
          file,
          preview: reader.result as string,
          displayOrder: images.length,
          isPrimary: images.length === 0, // First image is primary
        };
        setImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);

    // If removed image was primary, make first remaining primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    // Update display order
    newImages.forEach((img, i) => {
      img.displayOrder = i;
    });

    setImages(newImages);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // Update display order
    newImages.forEach((img, i) => {
      img.displayOrder = i;
    });

    setImages(newImages);
    setDraggedIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (images.length === 0) {
        toast.error("Добавете поне една снимка");
        setIsLoading(false);
        return;
      }

      // Validate and convert numeric fields
      const year = parseInt(String(formData.year)) || new Date().getFullYear();
      const mileage = parseInt(String(formData.mileage)) || 0;

      if (isNaN(year) || isNaN(mileage)) {
        toast.error("Година и пробег трябва да бъдат числа");
        setIsLoading(false);
        return;
      }

      // Get primary image
      const primaryImage = images.find((img) => img.isPrimary);
      const primaryImageUrl = primaryImage?.preview || images[0].preview;

      // Create listing first
      const listing = await createListingMutation.mutateAsync({
        ...formData,
        year,
        mileage,
        primaryImageUrl,
      });

      // Then create image records for all images
      for (const image of images) {
        await createImageMutation.mutateAsync({
          listingId: listing.id,
          imageUrl: image.preview,
          displayOrder: image.displayOrder,
          isPrimary: image.isPrimary ? 1 : 0,
        });
      }

      toast.success("Обява и снимки създадени успешно");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Грешка при обработка на обявата");
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

          {/* Multi-Image Upload */}
          <div>
            <Label>Снимки ({images.length})</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImageChange}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer block">
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm">Кликни или пусни снимки (можеш да добавиш няколко)</p>
                </div>
              </label>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Твои снимки (Драг за преместване):</p>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      className={`relative group cursor-move rounded-lg overflow-hidden border-2 ${
                        draggedIndex === index ? "opacity-50" : ""
                      } ${image.isPrimary ? "border-primary" : "border-border"}`}
                    >
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            image.isPrimary
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          {image.isPrimary ? "Главна" : "Направи главна"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Drag Handle */}
                      <div className="absolute top-1 left-1 bg-black/50 p-1 rounded opacity-0 group-hover:opacity-100 transition">
                        <GripVertical className="w-4 h-4 text-white" />
                      </div>

                      {/* Primary Badge */}
                      {image.isPrimary && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                          Главна
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading || images.length === 0} className="w-full">
            {isLoading ? "Обработка..." : initialData ? "Актуализиране" : "Създаване"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
