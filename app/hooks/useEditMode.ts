'use client';

import { useState, useCallback } from 'react';
import { EditModeState } from '../types';

export const useEditMode = (): EditModeState => {
  const [isEditing, setIsEditing] = useState(false);
  // Initialize with all stickers selected by default to match current behavior
  const [selectedStickers, setSelectedStickers] = useState<string[]>([
    'sticker-1', 'sticker-2', 'sticker-3', 'sticker-4', 'sticker-5', 'sticker-6', 'sticker-7'
  ]);

  const toggleEdit = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const saveChanges = useCallback(() => {
    // Here we would persist the current asset positions and selected stickers
    // For now, just exit edit mode
    setIsEditing(false);
  }, []);

  const toggleSticker = useCallback((stickerId: string) => {
    setSelectedStickers(prev => {
      if (prev.includes(stickerId)) {
        return prev.filter(id => id !== stickerId);
      } else {
        return [...prev, stickerId];
      }
    });
  }, []);

  return {
    isEditing,
    toggleEdit,
    saveChanges,
    selectedStickers,
    toggleSticker,
  };
};
