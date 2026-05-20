/**
 * Product Detail Modal Component
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

interface ProductDetailModalProps {
  isOpen: boolean;
  product: any;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

export default function ProductDetailModal({
  isOpen,
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<any[]>([]);

  // Fetch product images
  const { data: fetchedImages } = trpc.ecommerce.productImages.getByProductId.useQuery(
    product?.id,
    { enabled: isOpen && !!product?.id }
  );

  useEffect(() => {
    if (fetchedImages) {
      setImages(fetchedImages);
      setCurrentImageIndex(0);
    }
  }, [fetchedImages]);

  if (!product) return null;

  const currentImage = images[currentImageIndex]?.imageUrl || product.primaryImageUrl;
  const specs = product.specifications ? JSON.parse(product.specifications) : {};

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div>
            {currentImage ? (
              <div className="relative bg-muted rounded-lg overflow-hidden h-96">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-muted rounded-lg h-96 flex items-center justify-center text-muted-foreground">
                Няма снимка
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`rounded overflow-hidden border-2 transition-colors ${
                      currentImageIndex === idx
                        ? "border-blue-500"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt="Thumbnail"
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Price & Stock */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-primary">
                  {product.price}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} в наличност` : "Изчерпана"}
                </span>
              </div>
            </div>

            {/* Compatibility */}
            {product.compatibleBrands && (
              <div>
                <h4 className="font-semibold mb-2">Съвместимост</h4>
                <p className="text-sm text-muted-foreground">
                  Марки: {product.compatibleBrands}
                </p>
                {product.compatibleModels && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Модели: {product.compatibleModels}
                  </p>
                )}
              </div>
            )}

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Спецификации</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(specs).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Description */}
            {product.description && (
              <div>
                <h4 className="font-semibold mb-2">Описание</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Добави в кошница
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
