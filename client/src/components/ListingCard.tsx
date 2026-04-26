/**
 * Listing Card Component
 * Показване на обява в админ панел с поддръжка на множество снимки
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ListingCardProps {
  listing: any;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function ListingCard({ listing, onDelete, isDeleting }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<any[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // Fetch images for this listing
  const { data: fetchedImages } = trpc.crm.listingImages.getByListingId.useQuery(listing.id);

  const deleteImageMutation = trpc.crm.listingImages.delete.useMutation({
    onSuccess: () => {
      toast.success("Снимка изтрита");
      // Refetch images
      if (fetchedImages) {
        setImages(fetchedImages.filter((_, i) => i !== currentImageIndex));
        if (currentImageIndex > 0) {
          setCurrentImageIndex(currentImageIndex - 1);
        }
      }
    },
    onError: () => {
      toast.error("Грешка при изтриване на снимка");
    },
  });

  const setPrimaryImageMutation = trpc.crm.listingImages.update.useMutation({
    onSuccess: () => {
      toast.success("Главна снимка обновена");
      if (fetchedImages) {
        setImages(
          fetchedImages.map((img, i) => ({
            ...img,
            isPrimary: i === currentImageIndex ? 1 : 0,
          }))
        );
      }
    },
    onError: () => {
      toast.error("Грешка при обновяване");
    },
  });

  useEffect(() => {
    if (fetchedImages && fetchedImages.length > 0) {
      setImages(fetchedImages.sort((a, b) => a.displayOrder - b.displayOrder));
      setIsLoadingImages(false);
    } else if (listing.primaryImageUrl) {
      setImages([{ id: 0, imageUrl: listing.primaryImageUrl, displayOrder: 0, isPrimary: 1 }]);
      setIsLoadingImages(false);
    } else {
      setIsLoadingImages(false);
    }
  }, [fetchedImages, listing.primaryImageUrl]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDeleteImage = () => {
    if (images[currentImageIndex]?.id > 0) {
      deleteImageMutation.mutate(images[currentImageIndex].id);
    }
  };

  const handleSetPrimary = () => {
    if (images[currentImageIndex]?.id > 0) {
      setPrimaryImageMutation.mutate({
        id: images[currentImageIndex].id,
        isPrimary: 1,
      });
    }
  };

  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex];

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        {/* Image Section */}
        {currentImage && !isLoadingImages && (
          <div className="relative w-32 h-24 flex-shrink-0 bg-muted rounded overflow-hidden group">
            <img
              src={currentImage.imageUrl}
              alt={`${listing.make} ${listing.model}`}
              className="w-full h-full object-cover"
            />

            {/* Image Counter */}
            <div className="absolute top-1 right-1 bg-black/50 text-white px-2 py-0.5 rounded text-xs font-medium">
              {currentImageIndex + 1}/{images.length}
            </div>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition h-full w-6 rounded-none"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition h-full w-6 rounded-none"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </>
            )}

            {/* Primary Badge */}
            {currentImage.isPrimary === 1 && (
              <div className="absolute top-1 left-1 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-medium">
                Главна
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold">
            {listing.make} {listing.model}
          </h3>
          <p className="text-sm text-muted-foreground">
            {listing.year} • {listing.engine}
          </p>
          {listing.transmission && (
            <p className="text-sm text-muted-foreground">
              Трансмисия: {listing.transmission}
            </p>
          )}
          {listing.mileage && (
            <p className="text-sm text-muted-foreground">
              Пробег: {listing.mileage.toLocaleString()} км
            </p>
          )}
          {listing.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">{listing.description}</p>
          )}
        </div>

        {/* Action Section */}
        <div className="text-right space-y-2 flex-shrink-0">
          {listing.price && (
            <p className="font-semibold text-primary">{listing.price}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Статус: <span className="capitalize font-medium">{listing.status}</span>
          </p>
          {hasMultipleImages && (
            <p className="text-xs text-muted-foreground">
              <ImageIcon className="w-3 h-3 inline mr-1" />
              {images.length} снимки
            </p>
          )}

          {/* Image Management Buttons */}
          {currentImage && hasMultipleImages && (
            <div className="space-y-1">
              {currentImage.isPrimary !== 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSetPrimary}
                  disabled={setPrimaryImageMutation.isPending}
                  className="w-full text-xs"
                >
                  Главна
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteImage}
                disabled={deleteImageMutation.isPending}
                className="w-full text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Изтрий
              </Button>
            </div>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="w-full"
          >
            {isDeleting ? "Изтриване..." : "Изтрий обява"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
