/**
 * Parts Listing Management Component for Admin Panel
 * Handles creation, editing, and deletion of vehicle parts listings
 * Includes image upload and management functionality
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PartFormData {
  make: string;
  model: string;
  year: string;
  engine: string;
  transmission: string;
  mileage: string;
  price: string;
  description: string;
  features: string;
}

interface ImageFile {
  file: File;
  preview: string;
  displayOrder: number;
}

export default function PartsListingManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [formData, setFormData] = useState<PartFormData>({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    engine: "",
    transmission: "",
    mileage: "",
    price: "",
    description: "",
    features: "",
  });

  // Fetch all listings
  const { data: listings = [], refetch: refetchListings } =
    trpc.listings.getAll.useQuery({ status: "active" });

  // Mutations
  const createListingMutation = trpc.listings.create.useMutation();
  const updateListingMutation = trpc.listings.update.useMutation();
  const deleteListingMutation = trpc.listings.delete.useMutation();
  const uploadImageMutation = trpc.listings.uploadImage.useMutation();

  const handleOpenForm = (listing?: any) => {
    if (listing) {
      setEditingListing(listing);
      setFormData({
        make: listing.make,
        model: listing.model,
        year: listing.year?.toString() || "",
        engine: listing.engine || "",
        transmission: listing.transmission || "",
        mileage: listing.mileage?.toString() || "",
        price: listing.price || "",
        description: listing.description || "",
        features: listing.features || "",
      });
      // Load existing images
      if (listing.imageUrls) {
        try {
          const urls = JSON.parse(listing.imageUrls);
          const imageFiles: ImageFile[] = urls.map((url: string, idx: number) => ({
            file: new File([], url),
            preview: url,
            displayOrder: idx,
          }));
          setImages(imageFiles);
          setPrimaryImageIndex(0);
        } catch {
          setImages([]);
          setPrimaryImageIndex(0);
        }
      }
    } else {
      setEditingListing(null);
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear().toString(),
        engine: "",
        transmission: "",
        mileage: "",
        price: "",
        description: "",
        features: "",
      });
      setImages([]);
      setPrimaryImageIndex(0);
    }
    setIsFormOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const preview = URL.createObjectURL(file);
      newImages.push({
        file,
        preview,
        displayOrder: images.length + i,
      });
    }
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages.map((img, idx) => ({ ...img, displayOrder: idx })));
    if (primaryImageIndex >= newImages.length) {
      setPrimaryImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages.map((img, idx) => ({ ...img, displayOrder: idx })));
    if (primaryImageIndex === fromIndex) {
      setPrimaryImageIndex(toIndex);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.make.trim()) {
      toast.error("Моля, въведете марка");
      return;
    }
    if (!formData.model.trim()) {
      toast.error("Моля, въведете модел");
      return;
    }
    if (!formData.price.trim()) {
      toast.error("Моля, въведете цена");
      return;
    }
    if (images.length === 0) {
      toast.error("Моля, добавете поне едно изображение");
      return;
    }

    try {
      // Upload images first
      const uploadedImageUrls: string[] = [];
      for (const imgData of images) {
        if (imgData.file && imgData.file.size > 0) {
          const formDataForUpload = new FormData();
          formDataForUpload.append("file", imgData.file);
          
          const uploadResult = await uploadImageMutation.mutateAsync({
            fileName: imgData.file.name,
          });
          uploadedImageUrls.push(uploadResult.url);
        } else if (imgData.preview) {
          // Existing image URL
          uploadedImageUrls.push(imgData.preview);
        }
      }

      if (uploadedImageUrls.length === 0) {
        toast.error("Моля, качете поне едно изображение");
        return;
      }

      const listingData = {
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: parseInt(formData.year),
        engine: formData.engine.trim(),
        transmission: formData.transmission.trim(),
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        price: formData.price.trim(),
        description: formData.description.trim(),
        features: formData.features.trim(),
        imageUrls: JSON.stringify(uploadedImageUrls),
        primaryImageUrl: uploadedImageUrls[primaryImageIndex],
        status: "active" as const,
      };

      if (editingListing) {
        await updateListingMutation.mutateAsync({
          id: editingListing.id,
          ...listingData,
          mileage: listingData.mileage ?? null,
        } as any);
        toast.success("Листингът е обновен успешно");
      } else {
        await createListingMutation.mutateAsync(listingData);
        toast.success("Листингът е създаден успешно");
      }

      setIsFormOpen(false);
      refetchListings();
    } catch (error) {
      console.error("Error submitting listing:", error);
      toast.error("Грешка при запазване на листинга");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Сигурни ли сте, че искате да изтриете този листинг?")) {
      return;
    }

    try {
      await deleteListingMutation.mutateAsync(id);
      toast.success("Листингът е изтрит успешно");
      refetchListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Грешка при изтриване на листинга");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление на Листинги</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenForm()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Нов Листинг
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingListing ? "Редактиране на Листинг" : "Нов Листинг"}
              </DialogTitle>
              <DialogDescription>
                Попълнете информацията за авточастите и добавете изображения
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Марка *
                  </label>
                  <Input
                    placeholder="BMW, Mercedes, etc."
                    value={formData.make}
                    onChange={(e) =>
                      setFormData({ ...formData, make: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Модел *
                  </label>
                  <Input
                    placeholder="X5, E-Class, etc."
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Година
                  </label>
                  <Input
                    type="number"
                    placeholder="2020"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Двигател
                  </label>
                  <Input
                    placeholder="3.0L TwinTurbo"
                    value={formData.engine}
                    onChange={(e) =>
                      setFormData({ ...formData, engine: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Трансмисия
                  </label>
                  <Input
                    placeholder="Automatic, Manual"
                    value={formData.transmission}
                    onChange={(e) =>
                      setFormData({ ...formData, transmission: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Пробег (км)
                  </label>
                  <Input
                    type="number"
                    placeholder="150000"
                    value={formData.mileage}
                    onChange={(e) =>
                      setFormData({ ...formData, mileage: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Цена *
                </label>
                <Input
                  placeholder="$15000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Описание
                </label>
                <Textarea
                  placeholder="Подробно описание на авточастите..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Характеристики (разделени със запетая)
                </label>
                <Textarea
                  placeholder="Оригинални части, Гаранция, Бързо доставяне"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  rows={2}
                />
              </div>

              {/* Image Upload */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-2">
                  Изображения *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-sm text-blue-500 hover:underline"
                  >
                    Кликнете за избор на изображения
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    или пуснете файлове тук
                  </p>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">
                      Избрани изображения ({images.length})
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative group border-2 rounded-lg overflow-hidden ${
                            primaryImageIndex === idx
                              ? "border-yellow-500"
                              : "border-gray-300"
                          }`}
                        >
                          <img
                            src={img.preview}
                            alt={`Preview ${idx}`}
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
                            <button
                              onClick={() => setPrimaryImageIndex(idx)}
                              className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Главна
                            </button>
                            <button
                              onClick={() => handleRemoveImage(idx)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          {primaryImageIndex === idx && (
                            <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                              ГЛАВНА
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                  disabled={
                    createListingMutation.isPending ||
                    updateListingMutation.isPending
                  }
                >
                  {editingListing ? "Обновяване" : "Създаване"}
                </Button>
                <Button
                  onClick={() => setIsFormOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Отмяна
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Listings Table */}
      <div className="space-y-2">
        {listings.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            Няма листинги. Създайте първия си листинг!
          </Card>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing: any) => (
              <Card key={listing.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {listing.primaryImageUrl && (
                      <img
                        src={listing.primaryImageUrl}
                        alt={`${listing.make} ${listing.model}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {listing.make} {listing.model}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {listing.year} • {listing.engine}
                      </p>
                      <p className="text-sm text-gray-600">
                        Пробег: {listing.mileage?.toLocaleString() || "N/A"} км
                      </p>
                      <p className="font-semibold text-yellow-500 mt-1">
                        {listing.price}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Изображения: {listing.imageUrls ? JSON.parse(listing.imageUrls).length : 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenForm(listing)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(listing.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
