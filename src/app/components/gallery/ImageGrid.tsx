import React from 'react';
import Image from 'next/image';
import type { GalleryImage } from '../../types/gallery';

interface ImageGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
}

export function ImageGrid({ images, onImageClick }: ImageGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick(image)}
        >
          <Image
            src={image.url}
            alt={image.filename}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}