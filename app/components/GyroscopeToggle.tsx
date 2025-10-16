'use client';

import React, { useState, useEffect } from 'react';

interface GyroscopeToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
}

const GyroscopeToggle: React.FC<GyroscopeToggleProps> = ({ isEnabled, onToggle }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || ('ontouchstart' in window));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <button
      onClick={onToggle}
      className="rounded-full shadow-lg overflow-hidden flex items-center justify-center"
      style={{
        backgroundColor: 'var(--toggle-bg)',
        border: '1px solid var(--toggle-hover)',
        padding: '12px',
        width: '48px',
        height: '48px',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--toggle-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--toggle-bg)';
      }}
      aria-label={`${isEnabled ? 'Disable' : 'Enable'} gyroscope`}
      title={`${isEnabled ? 'Disable' : 'Enable'} gyroscope`}
    >
      <div
        style={{
          transition: 'transform 0.3s ease, opacity 0.2s ease',
          opacity: isEnabled ? 1 : 0.5,
          transform: isEnabled ? 'rotate(0deg)' : 'rotate(0deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Phone/Gyroscope icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--foreground)' }}
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      </div>
    </button>
  );
};

export default GyroscopeToggle;

