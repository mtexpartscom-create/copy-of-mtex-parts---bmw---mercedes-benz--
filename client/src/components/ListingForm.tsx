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
import { Upload, X, GripVertical, Loader2 } from "lucide-react";

interface ListingImage {
  id?: number;
  file?: File;
  preview: string;
  displayOrder: number;
  isPrimary: boolean;
  isUploading?: boolean;
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
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Error creating listing:", error);
      toast.error("Грешка при създаване на обява");
    },
  });

  const createImageMutation = trpc.crm.listingImages.create.useMutation({
    onError: (error) => {
      console.error("Error creating image:", error);
      toast.error("Грешка при качване на снимка");
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Само изображения са разрешени");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const newImage: ListingImage = {
          file,
          preview: reader.result as string,
          displayOrder: images.length,
          isPrimary: images.length === 0, // First image is primary
          isUploading: false,
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

  const uploadImageToS3 = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url; // Should return /manus-storage/{key}
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

      // Upload images to S3 and get URLs
      const uploadedImages: Array<{ url: string; file: File; isPrimary: boolean; displayOrder: number }> = [];

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (image.file) {
          try {
            setImages((prev) =>
              prev.map((img, idx) => (idx === i ? { ...img, isUploading: true } : img))
            );

            const url = await uploadImageToS3(image.file);
            uploadedImages.push({
              url,
              file: image.file,
              isPrimary: image.isPrimary,
              displayOrder: image.displayOrder,
            });

            setImages((prev) =>
              prev.map((img, idx) => (idx === i ? { ...img, isUploading: false } : img))
            );
          } catch (error) {
            console.error("Error uploading image:", error);
            toast.error(`Грешка при качване на снимка ${i + 1}`);
            setIsLoading(false);
            return;
          }
        } else {
          // Already uploaded image (from edit)
          uploadedImages.push({
            url: image.preview,
            file: new File([], ""),
            isPrimary: image.isPrimary,
            displayOrder: image.displayOrder,
          });
        }
      }

      // Get primary image URL
      const primaryImage = uploadedImages.find((img) => img.isPrimary);
      const primaryImageUrl = primaryImage?.url || uploadedImages[0]?.url;

      if (!primaryImageUrl) {
        toast.error("Няма валидна главна снимка");
        setIsLoading(false);
        return;
      }

      // Create listing with primary image URL
      const listing = await createListingMutation.mutateAsync({
        ...formData,
        year,
        mileage,
        primaryImageUrl,
      });

      // Then create image records for all images
      for (const uploadedImage of uploadedImages) {
        await createImageMutation.mutateAsync({
          listingId: listing.id,
          imageUrl: uploadedImage.url,
          displayOrder: uploadedImage.displayOrder,
          isPrimary: uploadedImage.isPrimary ? 1 : 0,
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
                placeholder="2.0L Diesel..."
              />
            </div>
            <div>
              <Label htmlFor="transmission">Трансмисия</Label>
              <Input
                id="transmission"
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                placeholder="Automatic..."
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
                placeholder="€ 15,000..."
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
              placeholder="Допълнителна информация за автомобила..."
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label>Снимки</Label>
            <div className="mt-2 space-y-3">
              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Кликни или преместни снимки тук</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WebP до 5MB</p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>

              {/* Images List */}
              {images.length > 0 && (
                <div className="space-y-2">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border hover:border-primary/50 transition cursor-move"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />

                      {/* Image Preview */}
                      <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-background">
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {image.isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          </div>
                        )}
                      </div>

                      {/* Image Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Снимка {index + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          {image.isPrimary && "Главна снимка"}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        {!image.isPrimary && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPrimaryImage(index)}
                            disabled={image.isUploading}
                          >
                            Главна
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                          disabled={image.isUploading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || images.length === 0}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Обработка...
              </>
            ) : initialData ? (
              "Обновяване на обява"
            ) : (
              "Публикуване на обява"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
