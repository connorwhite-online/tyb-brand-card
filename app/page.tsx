'use client';

import React from 'react';
import Card2D from './components/Card2D';
import ThemeToggle from './components/ThemeToggle';
import { useEditMode } from './hooks/useEditMode';

export default function Home() {
  const { isEditing, toggleEdit, saveChanges } = useEditMode();

  const handleButtonClick = () => {
    if (isEditing) {
      saveChanges();
    } else {
      toggleEdit();
    }
  };

  return (
    <div className="min-h-screen drag-container" style={{ background: 'linear-gradient(to bottom right, var(--card-gradient-from), var(--card-gradient-to))' }}>
      {/* Mobile Layout: Card at top with 48px margin */}
      <div className="md:hidden pt-12 px-[5%]">
        {/* 2D Card Container - 90% width on mobile */}
        <div className="w-full mx-auto" style={{ aspectRatio: '1.586/1' }}>
          <Card2D 
            isEditMode={isEditing}
            className="w-full h-full"
          />
        </div>

        {/* Edit Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleButtonClick}
            className="px-8 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 text-white shadow-lg"
            style={{
              fontFamily: 'var(--font-nunito), sans-serif',
              fontWeight: '800',
              backgroundColor: isEditing ? 'var(--button-primary)' : 'var(--button-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isEditing 
                ? 'var(--button-primary-hover)' 
                : 'var(--button-secondary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isEditing 
                ? 'var(--button-primary)' 
                : 'var(--button-secondary)';
            }}
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Desktop Layout: Card centered vertically and horizontally */}
      <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:min-h-screen">
        {/* 2D Card Container - 30% width on desktop */}
        <div className="w-[30%] mx-auto" style={{ aspectRatio: '1.586/1' }}>
          <Card2D 
            isEditMode={isEditing}
            className="w-full h-full"
          />
        </div>

        {/* Edit Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleButtonClick}
            className="px-8 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 text-white shadow-lg"
            style={{
              fontFamily: 'var(--font-nunito), sans-serif',
              fontWeight: '800',
              backgroundColor: isEditing ? 'var(--button-primary)' : 'var(--button-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isEditing 
                ? 'var(--button-primary-hover)' 
                : 'var(--button-secondary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isEditing 
                ? 'var(--button-primary)' 
                : 'var(--button-secondary)';
            }}
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Theme Toggle - Fixed at bottom center */}
      <ThemeToggle />
    </div>
  );
}
