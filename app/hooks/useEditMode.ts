'use client';

import { useState, useCallback } from 'react';
import { EditModeState } from '../types';

export const useEditMode = (): EditModeState => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const saveChanges = useCallback(() => {
    // Here we would persist the current asset positions
    // For now, just exit edit mode
    setIsEditing(false);
  }, []);

  return {
    isEditing,
    toggleEdit,
    saveChanges,
  };
};
