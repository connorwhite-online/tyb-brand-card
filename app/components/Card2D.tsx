'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useGyroscope } from '../hooks/useGyroscope';

interface Card2DProps {
  isEditMode: boolean;
  className?: string;
}

interface StickerPosition {
  id: string;
  x: number;
  y: number;
  isDragging: boolean;
  zIndex: number;
}

// Extend HTMLDivElement to include our custom cleanup function
declare global {
  interface HTMLDivElement {
    _touchStartCleanup?: () => void;
  }
}

const Card2D: React.FC<Card2DProps> = ({ isEditMode, className }) => {
  const { gyroscopeData } = useGyroscope(!isEditMode);
  const [stickers, setStickers] = useState<StickerPosition[]>([
    { id: 'sticker-1', x: 40, y: 30, isDragging: false, zIndex: 1 },
    { id: 'sticker-2', x: 60, y: 50, isDragging: false, zIndex: 2 },
    { id: 'sticker-3', x: 30, y: 60, isDragging: false, zIndex: 3 },
    { id: 'sticker-4', x: 70, y: 35, isDragging: false, zIndex: 4 },
    { id: 'sticker-5', x: 45, y: 40, isDragging: false, zIndex: 5 },
    { id: 'sticker-6', x: 25, y: 45, isDragging: false, zIndex: 6 },
    { id: 'sticker-7', x: 55, y: 65, isDragging: false, zIndex: 7 },
  ]);
  
  // Throttle state updates for better performance
  const dragUpdateRef = React.useRef<number | null>(null);
  const stickerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (dragUpdateRef.current) {
        cancelAnimationFrame(dragUpdateRef.current);
      }
    };
  }, []);

  // Set up non-passive touch event listeners for each sticker
  useEffect(() => {
    const handleTouchEvents = () => {
      Object.entries(stickerRefs.current).forEach(([stickerId, element]) => {
        if (!element) return;

        const handleTouchStart = (e: TouchEvent) => {
          if (!isEditMode) return;
          e.preventDefault();
          e.stopPropagation();
          
          // Bring sticker to front when touched
          bringToFront(stickerId);
          
          setStickers(prev =>
            prev.map(s => s.id === stickerId ? { ...s, isDragging: true } : s)
          );

          const card = element.closest('.card-2d') as HTMLElement;
          const cardRect = card.getBoundingClientRect();

          const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleStickerDrag(stickerId, touch.clientX, touch.clientY, cardRect);
          };

          const handleTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            setStickers(prev =>
              prev.map(s => s.id === stickerId ? { ...s, isDragging: false } : s)
            );
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
          };

          document.addEventListener('touchmove', handleTouchMove, { passive: false });
          document.addEventListener('touchend', handleTouchEnd, { passive: false });
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        
        // Store cleanup function
        element._touchStartCleanup = () => {
          element.removeEventListener('touchstart', handleTouchStart);
        };
      });
    };

    handleTouchEvents();

    // Cleanup
    return () => {
      Object.values(stickerRefs.current).forEach(element => {
        if (element && element._touchStartCleanup) {
          element._touchStartCleanup();
        }
      });
    };
  }, [isEditMode, stickers.length]); // Re-run when edit mode changes or stickers change

  // Calculate rotation based on gyroscope data
  const getCardTransform = () => {
    if (isEditMode || !gyroscopeData.beta || !gyroscopeData.gamma) {
      return 'rotateX(0deg) rotateY(0deg)';
    }

    // Limit rotation for subtle effect
    const maxRotation = 15;
    const rotationX = Math.max(-maxRotation, Math.min(maxRotation, gyroscopeData.beta / 6));
    const rotationY = Math.max(-maxRotation, Math.min(maxRotation, -gyroscopeData.gamma / 6));

    return `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  };

  const handleStickerDrag = (id: string, clientX: number, clientY: number, cardRect: DOMRect) => {
    const x = ((clientX - cardRect.left) / cardRect.width) * 100;
    const y = ((clientY - cardRect.top) / cardRect.height) * 100;

    // Sticker size in percentage (60px out of ~500px max card width = ~12%)
    const stickerSizePercent = 6; // Half of sticker size (12% / 2) for centering
    const safetyMarginX = 2; // Safety margin for X-axis
    const safetyMarginY = 8; // Much larger safety margin for Y-axis to prevent any edge bleeding
    
    // Keep stickers within card bounds accounting for sticker size
    const minBoundX = stickerSizePercent + safetyMarginX;
    const maxBoundX = 100 - stickerSizePercent - safetyMarginX;
    const minBoundY = stickerSizePercent + safetyMarginY;
    const maxBoundY = 100 - stickerSizePercent - safetyMarginY;
    
    const clampedX = Math.max(minBoundX, Math.min(maxBoundX, x));
    const clampedY = Math.max(minBoundY, Math.min(maxBoundY, y));

    // Throttle updates using requestAnimationFrame for better performance
    if (dragUpdateRef.current) {
      cancelAnimationFrame(dragUpdateRef.current);
    }
    
    dragUpdateRef.current = requestAnimationFrame(() => {
      setStickers(prev =>
        prev.map(sticker =>
          sticker.id === id ? { ...sticker, x: clampedX, y: clampedY } : sticker
        )
      );
      dragUpdateRef.current = null;
    });
  };

  const bringToFront = (id: string) => {
    setStickers(prev => {
      const maxZ = Math.max(...prev.map(s => s.zIndex));
      return prev.map(sticker =>
        sticker.id === id ? { ...sticker, zIndex: maxZ + 1 } : sticker
      );
    });
  };

  return (
    <div className={`card-container ${className || ''}`}>
      <div 
        className="card-2d"
        style={{
          transform: getCardTransform(),
        }}
      >
        {/* Card Background */}
        <div className="card-surface">
          {/* Logo */}
          <div className="logo-container">
            <Image 
              src="/assets/logo.png" 
              alt="Brand Logo"
              className="logo-image"
              width={64}
              height={64}
              onError={(e) => {
                console.log('Logo failed to load');
                (e.target as HTMLImageElement).style.backgroundColor = '#ddd';
                (e.target as HTMLImageElement).style.display = 'block';
              }}
            />
          </div>


          {/* Balance */}
          <div className="balance-container">
            <span className="balance-text">$60.14</span>
          </div>

          {/* TYB Logo */}
          <div className="tyb-logo-container">
            <Image 
              src="/assets/tyb-logo.svg" 
              alt="TYB Logo"
              className="tyb-logo-image"
              width={80}
              height={40}
              onError={(e) => {
                console.log('TYB logo failed to load');
                (e.target as HTMLImageElement).style.backgroundColor = '#ddd';
                (e.target as HTMLImageElement).style.display = 'block';
              }}
            />
          </div>

          {/* Stickers */}
          {stickers
            .sort((a, b) => a.zIndex - b.zIndex) // Render in z-index order
            .map((sticker) => (
            <div
              key={sticker.id}
              ref={(el) => {
                stickerRefs.current[sticker.id] = el;
              }}
              className={`sticker ${isEditMode ? 'editable' : ''} ${sticker.isDragging ? 'dragging' : ''}`}
              data-sticker-id={sticker.id}
              style={{
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                zIndex: sticker.zIndex,
              }}
              onMouseDown={(e) => {
                if (!isEditMode) return;
                
                // Bring sticker to front when touched
                bringToFront(sticker.id);
                
                setStickers(prev =>
                  prev.map(s => s.id === sticker.id ? { ...s, isDragging: true } : s)
                );

                const card = e.currentTarget.closest('.card-2d') as HTMLElement;
                const cardRect = card.getBoundingClientRect();

                const handleMouseMove = (e: MouseEvent) => {
                  handleStickerDrag(sticker.id, e.clientX, e.clientY, cardRect);
                };

                const handleMouseUp = () => {
                  setStickers(prev =>
                    prev.map(s => s.id === sticker.id ? { ...s, isDragging: false } : s)
                  );
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
              onTouchStart={(e) => {
                if (!isEditMode) return;
                // Don't call preventDefault here - handle it in the native listener
                
                // Bring sticker to front when touched
                bringToFront(sticker.id);
                
                setStickers(prev =>
                  prev.map(s => s.id === sticker.id ? { ...s, isDragging: true } : s)
                );
              }}
            >
              <Image 
                src={`/assets/sticker-0${sticker.id.split('-')[1]}.png`}
                alt={`Sticker ${sticker.id}`}
                className="sticker-image"
                draggable={false}
                width={sticker.id === 'sticker-5' ? 90 : sticker.id === 'sticker-7' ? 72 : 60}
                height={sticker.id === 'sticker-5' ? 60 : sticker.id === 'sticker-7' ? 72 : 60}
                onError={(e) => {
                  console.log(`Sticker ${sticker.id} failed to load`);
                  (e.target as HTMLImageElement).style.backgroundColor = '#ff6b6b';
                  (e.target as HTMLImageElement).style.display = 'block';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card2D;
