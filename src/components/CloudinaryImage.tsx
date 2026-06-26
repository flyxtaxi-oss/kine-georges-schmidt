"use client";

import { useState, useEffect } from "react";
import { practitioner, cloudinaryUrl } from "@/config/practitioner";

interface CloudinaryImageProps {
  imageKey: keyof typeof practitioner.cloudinary.images;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholderText?: string;
}

export default function CloudinaryImage({
  imageKey,
  alt,
  width = 800,
  height,
  className = "",
  placeholderText,
}: CloudinaryImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const publicId = practitioner.cloudinary.images[imageKey];
  const url = cloudinaryUrl(publicId, {
    width,
    height,
    crop: height ? "fill" : "scale",
  });

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [url]);

  // No Cloudinary configured or no URL — show placeholder
  if (!url || error) {
    return (
      <div
        className={`img-placeholder ${className}`}
        style={{ width: "100%", aspectRatio: height ? `${width}/${height}` : "16/9" }}
        role="img"
        aria-label={alt}
      >
        <div className="relative z-10 flex flex-col items-center gap-2 text-center p-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.4 }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span style={{ opacity: 0.6, fontSize: "0.8125rem" }}>
            {placeholderText || alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div
          className="img-placeholder absolute inset-0"
          style={{ aspectRatio: height ? `${width}/${height}` : "16/9" }}
        />
      )}
      <img
        src={url}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
