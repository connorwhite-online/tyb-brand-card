export interface Asset {
  id: string;
  type: 'static' | 'customizable';
  position: { x: number; y: number };
  size: { width: number; height: number };
  src: string;
  alt: string;
  zIndex: number;
}

export interface StaticAsset extends Asset {
  type: 'static';
  role: 'logo' | 'balance';
}

export interface CustomizableAsset extends Asset {
  type: 'customizable';
  isDragging?: boolean;
}

export interface CardDimensions {
  width: number;
  height: number;
  thickness: number;
  aspectRatio: number;
}

export interface GyroscopeData {
  alpha: number | null; // Z axis
  beta: number | null;  // X axis
  gamma: number | null; // Y axis
}

export interface EditModeState {
  isEditing: boolean;
  toggleEdit: () => void;
  saveChanges: () => void;
  selectedStickers: string[];
  toggleSticker: (stickerId: string) => void;
}

export interface DragState {
  isDragging: boolean;
  draggedAssetId: string | null;
  startPosition: { x: number; y: number } | null;
}
