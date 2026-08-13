import React, { useState, useEffect, useRef } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  style?: React.CSSProperties;
  priority?: boolean;
}

/**
 * LazyImage component with Intersection Observer API
 * Loads images only when they're about to enter the viewport
 * Includes blur-up effect with placeholder
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  placeholderSrc,
  width,
  height,
  onLoad,
  style,
  priority = false,
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(priority ? src : placeholderSrc);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
            onLoad?.();
          };
          img.onerror = () => {
            setImageSrc(src); // Fallback to original src on error
            setIsLoading(false);
          };
          img.src = src;

          if (imgRef.current) {
            observer.unobserve(imgRef.current);
          }
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, onLoad, priority]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoading ? "blur-sm" : "blur-none"} transition-all duration-300`}
      width={width}
      height={height}
      style={style}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
};

export default LazyImage;
