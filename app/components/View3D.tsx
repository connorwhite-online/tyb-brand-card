'use client';

import React from 'react';
import Card3D from './Card3D';
import StickerInventory from './StickerInventory';
import { GyroscopeData } from '../types';

interface View3DProps {
  isEditing: boolean;
  selectedStickers: string[];
  toggleSticker: (stickerId: string) => void;
  onButtonClick: () => void;
  displayText: string;
  isTextTransitioning: boolean;
  gyroscopeData: GyroscopeData;
}

const View3D: React.FC<View3DProps> = ({
  isEditing,
  selectedStickers,
  toggleSticker,
  onButtonClick,
  displayText,
  isTextTransitioning,
  gyroscopeData,
}) => {
  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden pt-12 px-[5%] h-full flex flex-col justify-start">
        {/* 3D Card Container - Full width on mobile */}
        <div className="w-full mx-auto" style={{ height: '35vh' }}>
          <Card3D 
            isEditMode={isEditing}
            selectedStickers={selectedStickers}
            gyroscopeData={gyroscopeData}
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

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-col md:items-center md:justify-start md:pt-16 h-full">
        {/* 3D Card Container - 50% width on desktop */}
        <div className="w-[40%] mx-auto" style={{ height: '320px' }}>
          <Card3D 
            isEditMode={isEditing}
            selectedStickers={selectedStickers}
            gyroscopeData={gyroscopeData}
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

export default View3D;

