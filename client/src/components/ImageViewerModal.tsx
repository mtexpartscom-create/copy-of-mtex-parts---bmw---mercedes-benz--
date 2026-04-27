/**
 * Image Viewer Modal Component
 * Fullscreen image viewer with details panel
 */

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageViewerModalProps {
  isOpen: boolean;
  images: Array<{ id: number; imageUrl: string; displayOrder: number }>;
  initialIndex?: number;
  listing: {
    id: number;
    make: string;
    model: string;
    year: number;
    engine: string;
    transmission?: string;
    mileage?: number;
    price?: string;
    description?: string;
  };
  onClose: () => void;
}

export default function ImageViewerModal({
  isOpen,
  images,
  initialIndex = 0,
  listing,
  onClose,
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const handleNextImage = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-stretch justify-center">
      {/* Close Button - Positioned at top right */}
      <Button
        variant="ghost"
        size="lg"
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </Button>

      <div className="flex w-full h-full max-w-7xl">
        {/* Image Section - Left Side */}
        <div className="flex-1 flex flex-col items-center justify-center relative group px-4">
          {/* Main Image */}
          <img
            src={currentImage?.imageUrl}
            alt={`${listing.make} ${listing.model}`}
            className="max-w-full max-h-[85vh] object-contain"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="lg"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNextImage}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-3 rounded-lg max-w-[90%] overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 w-12 h-12 rounded border-2 transition-all ${
                    idx === currentIndex ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Panel - Right Side */}
        <div className="w-96 bg-black/80 backdrop-blur-sm border-l border-white/10 overflow-y-auto p-8 flex flex-col justify-between">
          {/* Vehicle Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {listing.make} {listing.model}
              </h2>
              <p className="text-gray-400">{listing.year}</p>
            </div>

            {/* Key Specs */}
            <div className="space-y-3 border-t border-white/10 pt-6">
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Двигател:</span>
                <span className="text-white font-medium">{listing.engine}</span>
              </div>

              {listing.transmission && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Трансмисия:</span>
                  <span className="text-white font-medium">{listing.transmission}</span>
                </div>
              )}

              {listing.mileage !== null && listing.mileage !== undefined && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Пробег:</span>
                  <span className="text-white font-medium">{listing.mileage.toLocaleString()} км</span>
                </div>
              )}

              {listing.price && (
                <div className="flex justify-between items-start pt-3 border-t border-white/10">
                  <span className="text-gray-400">Цена:</span>
                  <span className="text-2xl font-bold text-blue-400">{listing.price}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Описание</h3>
                <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="border-t border-white/10 pt-4 mt-6">
            <p className="text-xs text-gray-500">
              Натиснете стрелките или използвайте клавишите за навигация
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
