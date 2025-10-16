'use client';

import React, { useState, useEffect } from 'react';
import Card2D from './Card2D';
import StickerInventory from './StickerInventory';

interface View2DProps {
  isEditing: boolean;
  selectedStickers: string[];
  toggleSticker: (stickerId: string) => void;
  onButtonClick: () => void;
  displayText: string;
  isTextTransitioning: boolean;
}

const View2D: React.FC<View2DProps> = ({
  isEditing,
  selectedStickers,
  toggleSticker,
  onButtonClick,
  displayText,
  isTextTransitioning,
}) => {
  return (
    <>
      {/* Mobile Layout: Card at top with 48px margin */}
      <div className="md:hidden pt-12 px-[5%] h-full flex flex-col justify-start">
        {/* 2D Card Container - 90% width on mobile */}
        <div className="w-full mx-auto" style={{ aspectRatio: '1.586/1' }}>
          <Card2D 
            isEditMode={isEditing}
            className="w-full h-full"
            selectedStickers={selectedStickers}
          />
        </div>

        {/* Edit Button */}
        <div className="text-center mt-8 flex-shrink-0">
          <button
            onClick={onButtonClick}
            className="rounded-full font-bold text-white shadow-lg overflow-hidden relative"
            style={{
              fontFamily: 'var(--font-nunito), sans-serif',
              fontWeight: '800',
              backgroundColor: isEditing ? 'var(--button-primary)' : 'var(--button-secondary)',
              padding: '12px 0',
              width: isEditing ? '140px' : '80px',
              transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease, transform 0.2s ease',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isEditing 
                ? 'var(--button-primary-hover)' 
                : 'var(--button-secondary-hover)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isEditing 
                ? 'var(--button-primary)' 
                : 'var(--button-secondary)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span 
              style={{
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                opacity: isTextTransitioning ? 0.3 : 1,
                transform: 'scale(1)',
                filter: isTextTransitioning ? 'blur(2px)' : 'blur(0px)',
                display: 'inline-block',
              }}
              key={displayText}
            >
              {displayText}
            </span>
          </button>
        </div>

        {/* Sticker Inventory - Show only in edit mode */}
        {isEditing && (
          <div className="px-4 pb-4">
            <StickerInventory
              selectedStickers={selectedStickers}
              onStickerToggle={toggleSticker}
            />
          </div>
        )}
      </div>

      {/* Desktop Layout: Card aligned to top center */}
      <div className="hidden md:flex md:flex-col md:items-center md:justify-start md:pt-16 h-full">
        {/* 2D Card Container - 30% width on desktop */}
        <div className="w-[30%] mx-auto" style={{ aspectRatio: '1.586/1' }}>
          <Card2D 
            isEditMode={isEditing}
            className="w-full h-full"
            selectedStickers={selectedStickers}
          />
        </div>

        {/* Edit Button */}
        <div className="text-center mt-8">
          <button
            onClick={onButtonClick}
            className="rounded-full font-bold text-white shadow-lg overflow-hidden relative"
            style={{
              fontFamily: 'var(--font-nunito), sans-serif',
              fontWeight: '800',
              backgroundColor: isEditing ? 'var(--button-primary)' : 'var(--button-secondary)',
              padding: '12px 0',
              width: isEditing ? '140px' : '80px',
              transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease, transform 0.2s ease',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isEditing 
                ? 'var(--button-primary-hover)' 
                : 'var(--button-secondary-hover)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isEditing 
                ? 'var(--button-primary)' 
                : 'var(--button-secondary)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span 
              style={{
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                opacity: isTextTransitioning ? 0.3 : 1,
                transform: 'scale(1)',
                filter: isTextTransitioning ? 'blur(2px)' : 'blur(0px)',
                display: 'inline-block',
              }}
              key={displayText}
            >
              {displayText}
            </span>
          </button>
        </div>

        {/* Sticker Inventory - Show only in edit mode */}
        {isEditing && (
          <StickerInventory
            selectedStickers={selectedStickers}
            onStickerToggle={toggleSticker}
          />
        )}
      </div>
    </>
  );
};

export default View2D;

