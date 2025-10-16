'use client';

import React, { useState, useEffect } from 'react';
import View2D from './components/View2D';
import View3D from './components/View3D';
import BottomControls from './components/BottomControls';
import { useEditMode } from './hooks/useEditMode';
import { useGyroscope } from './hooks/useGyroscope';

export default function Home() {
  const { isEditing, toggleEdit, saveChanges, selectedStickers, toggleSticker } = useEditMode();
  const [displayText, setDisplayText] = useState('Edit');
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState<'2d' | '3d'>('3d');
  const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false);
  
  // Use gyroscope hook - only enabled when user toggles it on and on 3D view
  const { gyroscopeData } = useGyroscope(gyroscopeEnabled && activeTab === '3d' && !isEditing);

  // Update display text with delay for smooth animation
  useEffect(() => {
    // Start text transition effect
    setIsTextTransitioning(true);
    
    const textTimer = setTimeout(() => {
      setDisplayText(isEditing ? 'Save Changes' : 'Edit');
      // End transition effect after text changes
      setTimeout(() => setIsTextTransitioning(false), 50);
    }, isEditing ? 200 : 0); // Delay when expanding, immediate when shrinking

    return () => clearTimeout(textTimer);
  }, [isEditing]);

  const handleButtonClick = () => {
    if (isEditing) {
      saveChanges();
    } else {
      toggleEdit();
    }
  };

  return (
    <div className="overflow-hidden drag-container" style={{ height: '100dvh', background: 'linear-gradient(to bottom right, var(--card-gradient-from), var(--card-gradient-to))' }}>
      {/* Render active view */}
      {activeTab === '2d' ? (
        <View2D
          isEditing={isEditing}
          selectedStickers={selectedStickers}
          toggleSticker={toggleSticker}
          onButtonClick={handleButtonClick}
          displayText={displayText}
          isTextTransitioning={isTextTransitioning}
        />
      ) : (
        <View3D
          isEditing={isEditing}
          selectedStickers={selectedStickers}
          toggleSticker={toggleSticker}
          onButtonClick={handleButtonClick}
          displayText={displayText}
          isTextTransitioning={isTextTransitioning}
          gyroscopeData={gyroscopeData}
        />
      )}

      {/* Bottom Controls - Tabs, Gyroscope Toggle, and Theme Toggle */}
      <BottomControls 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        gyroscopeEnabled={gyroscopeEnabled}
        onGyroscopeToggle={() => setGyroscopeEnabled(!gyroscopeEnabled)}
      />
    </div>
  );
}
