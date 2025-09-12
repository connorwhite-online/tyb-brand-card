'use client';

import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    // First phase: fade out current icon
    setTimeout(() => {
      toggleTheme();
      // Second phase: fade in new icon after theme change
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 left-1/2 z-50 rounded-full shadow-lg overflow-hidden flex items-center justify-center"
      style={{
        backgroundColor: 'var(--toggle-bg)',
        border: '1px solid var(--toggle-hover)',
        padding: '12px',
        width: '48px',
        height: '48px',
        transform: 'translateX(-50%)',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--toggle-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--toggle-bg)';
      }}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div
        style={{
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out, filter 0.3s ease-out',
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'scale(0.7) rotate(180deg)' : 'scale(1) rotate(0deg)',
          filter: isAnimating ? 'blur(3px)' : 'blur(0px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        key={resolvedTheme}
      >
        {resolvedTheme === 'dark' ? (
          // Moon icon shown in dark mode
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
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          // Sun icon shown in light mode
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
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
