'use client';

import { useState } from 'react';

export default function ProductImageGallery({ images, title }: { images: string[]; title: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
              i === selectedIndex
                ? 'border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'border-[#222] hover:border-[#444]'
            }`}
          >
            <img src={img} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-[#111] border border-[#222]">
        <img
          src={images[selectedIndex]}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>
    </div>
  );
}
