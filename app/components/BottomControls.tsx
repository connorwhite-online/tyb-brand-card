'use client';

import React from 'react';
import TabControl from './TabControl';
import ThemeToggle from './ThemeToggle';
import GyroscopeToggle from './GyroscopeToggle';

interface BottomControlsProps {
  activeTab: '2d' | '3d';
  onTabChange: (tab: '2d' | '3d') => void;
  gyroscopeEnabled?: boolean;
  onGyroscopeToggle?: () => void;
}

const BottomControls: React.FC<BottomControlsProps> = ({ 
  activeTab, 
  onTabChange,
  gyroscopeEnabled = false,
  onGyroscopeToggle
}) => {
  return (
    <div
      className="fixed left-1/2 z-50 flex items-center gap-4"
      style={{
        bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        transform: 'translateX(-50%)',
      }}
    >
      <TabControl activeTab={activeTab} onTabChange={onTabChange} />
      {onGyroscopeToggle && (
        <GyroscopeToggle 
          isEnabled={gyroscopeEnabled} 
          onToggle={onGyroscopeToggle} 
        />
      )}
      <ThemeToggle />
    </div>
  );
};

export default BottomControls;

