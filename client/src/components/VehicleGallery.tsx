/**
 * Vehicle Gallery Component
 * Показване на обяви на автомобили в галерия с поддръжка на множество снимки
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Separate component for individual listing card
function ListingCard({ listing }: { listing: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: images = [] } = trpc.crm.listingImages.getByListingId.useQuery(listing.id);

  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [images]);

  const currentImage = sortedImages[currentImageIndex];
  const displayImage = currentImage?.imageUrl || listing.primaryImageUrl;
  const totalImages = sortedImages.length || 1;

  const handleNextImage = () => {
    if (totalImages <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const handlePrevImage = () => {
    if (totalImages <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {displayImage && (
        <div className="relative w-full h-48 overflow-hidden bg-muted group">
          <img
            src={displayImage}
            alt={`${listing.make} ${listing.model} - ${currentImageIndex + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />

          {/* Image Counter Badge */}
          {totalImages > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
              {currentImageIndex + 1}/{totalImages}
            </div>
          )}

          {/* Navigation Arrows */}
          {totalImages > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNextImage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Thumbnail Strip */}
          {totalImages > 1 && (
            <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-2 bg-gradient-to-t from-black/50 to-transparent">
              {sortedImages.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-8 h-8 rounded overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {totalImages > 5 && (
                <div className="flex items-center justify-center px-2 text-white text-xs">
                  +{totalImages - 5}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg">
            {listing.make} {listing.model}
          </h3>
          <p className="text-sm text-muted-foreground">
            {listing.year} • {listing.engine}
          </p>
        </div>

        {listing.transmission && (
          <p className="text-sm">
            <span className="text-muted-foreground">Трансмисия:</span> {listing.transmission}
          </p>
        )}

        {listing.mileage !== null && listing.mileage !== undefined && (
          <p className="text-sm">
            <span className="text-muted-foreground">Пробег:</span> {listing.mileage.toLocaleString()} км
          </p>
        )}

        {listing.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
        )}

        {listing.price && (
          <div className="pt-2 border-t">
            <p className="text-lg font-bold text-primary">{listing.price}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VehicleGallery() {
  const { data: listings, isLoading } = trpc.crm.listings.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Няма налични обяви в момента</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
