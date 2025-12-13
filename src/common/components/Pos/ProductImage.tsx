"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center rounded-md`}>
        <ShoppingCart className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src || "https://cdn-app.sealsubscriptions.com/shopify/public/img/promo/no-image-placeholder.png"}
      alt={alt}
      className={`${className} object-cover rounded-md`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}
