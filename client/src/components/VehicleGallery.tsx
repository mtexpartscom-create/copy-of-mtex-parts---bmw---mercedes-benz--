/**
 * Vehicle Gallery Component
 * Показване на обяви на автомобили в галерия
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VehicleGallery() {
  const { data: listings, isLoading } = trpc.crm.listings.list.useQuery();
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});

  const handleNextImage = (listingId: number, totalImages: number) => {
    if (!totalImages || totalImages <= 1) return;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) + 1) % totalImages,
    }));
  };

  const handlePrevImage = (listingId: number, totalImages: number) => {
    if (!totalImages || totalImages <= 1) return;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

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
      {listings.map((listing) => {
        // For now, display primary image
        // Multi-image support will be added with backend integration
        const currentIndex = currentImageIndex[listing.id] || 0;
        const hasImage = listing.primaryImageUrl;

        return (
          <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {hasImage && (
              <div className="relative w-full h-48 overflow-hidden bg-muted group">
                <img
                  src={listing.primaryImageUrl || ""}
                  alt={`${listing.make} ${listing.model}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />

                {/* Image Counter Badge */}
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
                  1/1
                </div>
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
      })}
    </div>
  );
}
