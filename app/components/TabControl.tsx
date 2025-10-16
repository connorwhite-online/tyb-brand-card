'use client';

import React from 'react';

interface TabControlProps {
  activeTab: '2d' | '3d';
  onTabChange: (tab: '2d' | '3d') => void;
}

const TabControl: React.FC<TabControlProps> = ({ activeTab, onTabChange }) => {
  return (
    <div
      className="flex gap-2 rounded-full shadow-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--toggle-bg)',
        border: '1px solid var(--toggle-hover)',
        padding: '6px',
      }}
    >
      <button
        onClick={() => onTabChange('2d')}
        className="tab-button"
        style={{
          padding: '8px 20px',
          borderRadius: '20px',
          fontFamily: 'var(--font-nunito), sans-serif',
          fontWeight: '700',
          fontSize: '14px',
          transition: 'all 0.3s ease',
          backgroundColor: activeTab === '2d' ? 'var(--button-secondary)' : 'transparent',
          color: activeTab === '2d' ? 'white' : 'var(--foreground)',
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label="Switch to 2D view"
      >
        2D
      </button>
      <button
        onClick={() => onTabChange('3d')}
        className="tab-button"
        style={{
          padding: '8px 20px',
          borderRadius: '20px',
          fontFamily: 'var(--font-nunito), sans-serif',
          fontWeight: '700',
          fontSize: '14px',
          transition: 'all 0.3s ease',
          backgroundColor: activeTab === '3d' ? 'var(--button-secondary)' : 'transparent',
          color: activeTab === '3d' ? 'white' : 'var(--foreground)',
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label="Switch to 3D view"
      >
        3D
      </button>
    </div>
  );
};

export default TabControl;

