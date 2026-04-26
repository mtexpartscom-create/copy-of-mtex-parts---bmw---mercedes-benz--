/**
 * Listing Card Component
 * Показване на обява в админ панел с поддръжка на множество снимки
 */

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
interface ListingCardProps {
  listing: any;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function ListingCard({ listing, onDelete, isDeleting }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // For now, we only have the primary image
  // When backend returns multiple images, this will work with all of them
  const images = listing.primaryImageUrl ? [listing.primaryImageUrl] : [];
  const hasMultipleImages = images.length > 1;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        {/* Image Section */}
        {images.length > 0 && (
          <div className="relative w-32 h-24 flex-shrink-0 bg-muted rounded overflow-hidden group">
            <img
              src={images[currentImageIndex]}
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
          {images.length > 1 && (
            <p className="text-xs text-muted-foreground">
              <ImageIcon className="w-3 h-3 inline mr-1" />
              {images.length} снимки
            </p>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="w-full"
          >
            {isDeleting ? "Изтриване..." : "Изтриване"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
