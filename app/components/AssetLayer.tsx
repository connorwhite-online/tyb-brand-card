'use client';

import React, { useState, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { CardDimensions, StaticAsset, CustomizableAsset } from '../types';
import DraggableAsset from './DraggableAsset';

interface AssetLayerProps {
  cardDimensions: CardDimensions;
  isEditMode: boolean;
}

// This was previously used for static assets but is now handled directly in the component

// Calculate dimensions that maintain aspect ratio within max constraints
const calculateStickerDimensions = (maxWidth: number, maxHeight: number, aspectRatio?: number): { width: number; height: number } => {
  // Default to square if no aspect ratio is known
  if (!aspectRatio || aspectRatio <= 0) {
    const size = Math.min(maxWidth, maxHeight);
    return { width: size, height: size };
  }
  
  // Calculate dimensions based on aspect ratio
  let width = maxWidth;
  let height = width / aspectRatio;
  
  // If height exceeds max, constrain by height instead
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  return { width, height };
};

// Initial customizable assets (stickers that can be moved) - scaled for much larger card dimensions
// Using larger constraints: wider max-width (6.0) for wide stickers, bigger max-height (2.0) for all stickers
const initialCustomizableAssets: CustomizableAsset[] = [
  {
    id: 'sticker-1',
    type: 'customizable',
    position: { x: 0, y: 0 },
    size: calculateStickerDimensions(6.0, 2.0), // Square sticker - constrained by height to 2.0x2.0
    src: '/assets/sticker-01.png',
    alt: 'Customizable Sticker 1',
    zIndex: 2,
  },
  {
    id: 'sticker-2',
    type: 'customizable',
    position: { x: 3, y: 2 },
    size: calculateStickerDimensions(6.0, 2.0), // Square sticker - constrained by height to 2.0x2.0
    src: '/assets/sticker-02.png',
    alt: 'Customizable Sticker 2',
    zIndex: 3,
  },
  {
    id: 'sticker-3',
    type: 'customizable',
    position: { x: -2, y: 1.5 },
    size: calculateStickerDimensions(6.0, 2.0), // Square sticker - constrained by height to 2.0x2.0
    src: '/assets/sticker-03.png',
    alt: 'Customizable Sticker 3',
    zIndex: 4,
  },
  {
    id: 'sticker-4',
    type: 'customizable',
    position: { x: 4, y: -1 },
    size: calculateStickerDimensions(6.0, 2.0), // Square sticker - constrained by height to 2.0x2.0
    src: '/assets/sticker-04.png',
    alt: 'Customizable Sticker 4',
    zIndex: 5,
  },
  {
    id: 'sticker-5',
    type: 'customizable',
    position: { x: 1, y: -2 },
    size: calculateStickerDimensions(6.0, 2.0, 1.5), // Wider aspect ratio sticker (3:2) - gets 3.0x2.0
    src: '/assets/sticker-05.png',
    alt: 'Customizable Sticker 5',
    zIndex: 6,
  },
  {
    id: 'sticker-6',
    type: 'customizable',
    position: { x: -1, y: -1.5 },
    size: calculateStickerDimensions(6.0, 2.0), // Square sticker - constrained by height to 2.0x2.0
    src: '/assets/sticker-06.png',
    alt: 'Customizable Sticker 6',
    zIndex: 7,
  },
  {
    id: 'sticker-7',
    type: 'customizable',
    position: { x: 2, y: -3 },
    size: calculateStickerDimensions(6.0, 2.5), // Slightly larger sticker for better visibility
    src: '/assets/sticker-07.png',
    alt: 'Customizable Sticker 7',
    zIndex: 8,
  },
];

// Component for the rounded logo
const RoundedLogo: React.FC<{ position: [number, number, number]; size: [number, number] }> = ({ position, size }) => {
  const logoTexture = useLoader(THREE.TextureLoader, '/assets/logo.png');
  
  // Configure texture to fill the entire geometry
  useMemo(() => {
    logoTexture.wrapS = THREE.ClampToEdgeWrapping;
    logoTexture.wrapT = THREE.ClampToEdgeWrapping;
    logoTexture.minFilter = THREE.LinearFilter;
    logoTexture.magFilter = THREE.LinearFilter;
  }, [logoTexture]);
  
  // Create rounded rectangle geometry for the logo
  const logoGeometry = useMemo(() => {
    const [width, height] = size;
    const radius = 0.3; // 16px equivalent border radius
    
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const w = width;
    const h = height;
    
    shape.moveTo(x + radius, y);
    shape.lineTo(x + w - radius, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + radius);
    shape.lineTo(x + w, y + h - radius);
    shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    shape.lineTo(x + radius, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    
    const geometry = new THREE.ShapeGeometry(shape);
    
    // Manually set UV coordinates to ensure proper texture mapping
    const uvs = geometry.attributes.uv.array;
    const positions = geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      // Map coordinates to UV space (0-1)
      const u = (x + width/2) / width;
      const v = (y + height/2) / height;
      
      uvs[(i/3) * 2] = u;
      uvs[(i/3) * 2 + 1] = v;
    }
    
    geometry.attributes.uv.needsUpdate = true;
    return geometry;
  }, [size]);

  return (
    <mesh position={position} geometry={logoGeometry}>
      <meshStandardMaterial map={logoTexture} transparent />
    </mesh>
  );
};

const AssetLayer: React.FC<AssetLayerProps> = ({ cardDimensions, isEditMode }) => {
  // Validate and clamp initial positions to ensure they're within bounds
  const validateAssetPosition = (asset: CustomizableAsset): CustomizableAsset => {
    const safetyMarginX = 0.1;
    const safetyMarginY = 1.0; // Much larger margin for Y-axis to match DraggableAsset
    const boundaries = {
      minX: -cardDimensions.width / 2 + asset.size.width / 2 + safetyMarginX,
      maxX: cardDimensions.width / 2 - asset.size.width / 2 - safetyMarginX,
      minY: -cardDimensions.height / 2 + asset.size.height / 2 + safetyMarginY,
      maxY: cardDimensions.height / 2 - asset.size.height / 2 - safetyMarginY,
    };
    
    return {
      ...asset,
      position: {
        x: Math.max(boundaries.minX, Math.min(boundaries.maxX, asset.position.x)),
        y: Math.max(boundaries.minY, Math.min(boundaries.maxY, asset.position.y)),
      },
    };
  };

  const [customizableAssets, setCustomizableAssets] = useState<CustomizableAsset[]>(
    initialCustomizableAssets.map(validateAssetPosition)
  );

  const handleAssetPositionChange = (assetId: string, newPosition: { x: number; y: number }) => {
    setCustomizableAssets(prev => 
      prev.map(asset => {
        if (asset.id === assetId) {
          const updatedAsset = { ...asset, position: newPosition };
          return validateAssetPosition(updatedAsset);
        }
        return asset;
      })
    );
  };

  const bringToFront = (assetId: string) => {
    setCustomizableAssets(prev => {
      const maxZ = Math.max(...prev.map(s => s.zIndex));
      return prev.map(asset =>
        asset.id === assetId ? { ...asset, zIndex: maxZ + 1 } : asset
      );
    });
  };

  const handleDragStart = (assetId: string) => {
    // Bring asset to front when touched
    bringToFront(assetId);
    
    setCustomizableAssets(prev => 
      prev.map(asset => 
        asset.id === assetId 
          ? { ...asset, isDragging: true }
          : asset
      )
    );
  };

  const handleDragEnd = (assetId: string) => {
    setCustomizableAssets(prev => 
      prev.map(asset => 
        asset.id === assetId 
          ? { ...asset, isDragging: false }
          : asset
      )
    );
  };

  return (
    <group position={[0, 0, cardDimensions.thickness / 2 + 0.01]}>
      {/* Logo with rounded corners - larger size in top left, equidistant from edges */}
      <RoundedLogo 
        position={[-7.5, 4.2, 0]} 
        size={[3.2, 3.2]} 
      />
      
      {/* Balance text - equidistant from right and bottom edges */}
      <Text
        position={[8.2, -4.2, 0]}
        fontSize={1.2}
        color="black"
        anchorX="right"
        anchorY="bottom"
        fontWeight="900"
      >
        $60.14
      </Text>

      {/* Customizable Assets - Can be dragged in edit mode */}
      {customizableAssets
        .sort((a, b) => a.zIndex - b.zIndex) // Render in z-index order
        .map((asset) => (
        <DraggableAsset
          key={asset.id}
          asset={asset}
          cardDimensions={cardDimensions}
          isEditMode={isEditMode}
          onPositionChange={handleAssetPositionChange}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
    </group>
  );
};

export default AssetLayer;
