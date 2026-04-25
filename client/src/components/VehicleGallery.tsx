/**
 * Vehicle Gallery Component
 * Показване на обяви на автомобили в галерия
 */

import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
        <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {listing.primaryImageUrl && (
            <div className="relative w-full h-48 overflow-hidden bg-muted">
              <img
                src={listing.primaryImageUrl}
                alt={`${listing.make} ${listing.model}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          )}
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-bold text-lg">{listing.make} {listing.model}</h3>
              <p className="text-sm text-muted-foreground">
                {listing.year} • {listing.engine}
              </p>
            </div>

            {listing.transmission && (
              <p className="text-sm">
                <span className="text-muted-foreground">Трансмисия:</span> {listing.transmission}
              </p>
            )}

            {listing.mileage !== null && (
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
      ))}
    </div>
  );
}
