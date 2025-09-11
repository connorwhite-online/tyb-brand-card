'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useFrame, useThree, ThreeEvent, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { CustomizableAsset, CardDimensions } from '../types';

interface DraggableAssetProps {
  asset: CustomizableAsset;
  cardDimensions: CardDimensions;
  isEditMode: boolean;
  onPositionChange: (assetId: string, newPosition: { x: number; y: number }) => void;
  onDragStart: (assetId: string) => void;
  onDragEnd: (assetId: string) => void;
}

const DraggableAsset: React.FC<DraggableAssetProps> = ({
  asset,
  cardDimensions,
  isEditMode,
  onPositionChange,
  onDragStart,
  onDragEnd,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [peelIntensity, setPeelIntensity] = useState(0);
  const [dragPlane] = useState(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const [lastPointerPosition] = useState(() => new THREE.Vector3());
  
  const { camera, raycaster, gl } = useThree();
  
  // Load the sticker texture
  const stickerTexture = useLoader(THREE.TextureLoader, asset.src);

  // Calculate boundaries to keep asset within card bounds with safety margin
  const safetyMarginX = 0.1; // Small margin for X-axis
  const safetyMarginY = 1.0; // Much larger margin for Y-axis to prevent any edge bleeding
  const boundaries = {
    minX: -cardDimensions.width / 2 + asset.size.width / 2 + safetyMarginX,
    maxX: cardDimensions.width / 2 - asset.size.width / 2 - safetyMarginX,
    minY: -cardDimensions.height / 2 + asset.size.height / 2 + safetyMarginY,
    maxY: cardDimensions.height / 2 - asset.size.height / 2 - safetyMarginY,
  };


  const handlePointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!isEditMode) return;
    
    event.stopPropagation();
    setIsDragging(true);
    onDragStart(asset.id);
    
    // Calculate intersection with drag plane
    const mousePosition = new THREE.Vector2(
      (event.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(event.clientY / gl.domElement.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(mousePosition, camera);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragPlane, intersection);
    lastPointerPosition.copy(intersection);
    
    gl.domElement.setPointerCapture(event.pointerId);
  }, [isEditMode, onDragStart, asset.id, camera, raycaster, gl, dragPlane, lastPointerPosition]);

  const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !isEditMode) return;
    
    event.stopPropagation();
    
    // Calculate intersection with drag plane
    const mousePosition = new THREE.Vector2(
      (event.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(event.clientY / gl.domElement.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(mousePosition, camera);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragPlane, intersection);
    
    // Calculate movement delta
    const delta = intersection.clone().sub(lastPointerPosition);
    
    // Apply movement with strict boundaries and extra validation
    const proposedX = asset.position.x + delta.x;
    const proposedY = asset.position.y + delta.y;
    
    // Double-check boundaries with extra strict enforcement
    const newX = THREE.MathUtils.clamp(proposedX, boundaries.minX, boundaries.maxX);
    const newY = THREE.MathUtils.clamp(proposedY, boundaries.minY, boundaries.maxY);
    
    // Additional safety check: ensure we never exceed absolute card bounds
    const absoluteMinY = -cardDimensions.height / 2 + asset.size.height / 2 + 0.5;
    const absoluteMaxY = cardDimensions.height / 2 - asset.size.height / 2 - 0.5;
    const finalY = THREE.MathUtils.clamp(newY, absoluteMinY, absoluteMaxY);
    
    
    // Only update position if it's different from current position
    if (Math.abs(newX - asset.position.x) > 0.001 || Math.abs(finalY - asset.position.y) > 0.001) {
      onPositionChange(asset.id, { x: newX, y: finalY });
    }
    lastPointerPosition.copy(intersection);
  }, [isDragging, isEditMode, asset.position, asset.id, asset.size.height, boundaries, onPositionChange, camera, raycaster, gl, dragPlane, lastPointerPosition, cardDimensions.height]);

  const handlePointerUp = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    
    event.stopPropagation();
    setIsDragging(false);
    onDragEnd(asset.id);
    
    gl.domElement.releasePointerCapture(event.pointerId);
  }, [isDragging, onDragEnd, asset.id, gl]);

  // Animate peel effect when dragging
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Peel animation when dragging
    const targetPeel = isDragging ? 1 : 0;
    setPeelIntensity(prev => THREE.MathUtils.lerp(prev, targetPeel, delta * 10));

    // Apply peel effect (rotation and lift)
    if (isDragging || peelIntensity > 0.01) {
      meshRef.current.rotation.z = peelIntensity * 0.2;
      meshRef.current.position.z = peelIntensity * 0.1;
      meshRef.current.scale.setScalar(1 + peelIntensity * 0.1);
    }

    // Hover effect in edit mode
    if (isEditMode && !isDragging) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.z = Math.sin(time * 2) * 0.02 + 0.05;
    } else if (!isDragging) {
      meshRef.current.position.z = 0;
      meshRef.current.rotation.z = 0;
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[asset.position.x, asset.position.y, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <planeGeometry args={[asset.size.width, asset.size.height]} />
      <meshStandardMaterial
        map={stickerTexture}
        transparent
        opacity={isDragging ? 0.9 : 1.0}
      />
      
      {/* Visual indicator for edit mode */}
      {isEditMode && (
        <mesh position={[0, 0, 0.001]}>
          <ringGeometry args={[asset.size.width * 0.6, asset.size.width * 0.7, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </mesh>
  );
};

export default DraggableAsset;
