'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface StickerInventoryProps {
  selectedStickers: string[];
  onStickerToggle: (stickerId: string) => void;
}

const AVAILABLE_STICKERS = [
  { id: 'sticker-1', src: '/assets/sticker-01.png', alt: 'Sticker 1' },
  { id: 'sticker-2', src: '/assets/sticker-02.png', alt: 'Sticker 2' },
  { id: 'sticker-3', src: '/assets/sticker-03.png', alt: 'Sticker 3' },
  { id: 'sticker-4', src: '/assets/sticker-04.png', alt: 'Sticker 4' },
  { id: 'sticker-5', src: '/assets/sticker-05.png', alt: 'Sticker 5' },
  { id: 'sticker-6', src: '/assets/sticker-06.png', alt: 'Sticker 6' },
  { id: 'sticker-7', src: '/assets/sticker-07.png', alt: 'Sticker 7' },
];

const StickerInventory: React.FC<StickerInventoryProps> = ({
  selectedStickers,
  onStickerToggle,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start sticker animations with slight delay
    const stickerTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => {
      clearTimeout(stickerTimer);
    };
  }, []);

  return (
    <div className="sticker-inventory">
      <div className="inventory-grid">
        {AVAILABLE_STICKERS.map((sticker, index) => {
          const isSelected = selectedStickers.includes(sticker.id);
          return (
            <button
              key={sticker.id}
              className={`inventory-item ${isSelected ? 'selected' : ''} ${isVisible ? 'visible' : ''}`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
              onClick={() => onStickerToggle(sticker.id)}
              type="button"
            >
              <Image
                src={sticker.src}
                alt={sticker.alt}
                width={60}
                height={60}
                className="inventory-sticker-image"
                draggable={false}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StickerInventory;
