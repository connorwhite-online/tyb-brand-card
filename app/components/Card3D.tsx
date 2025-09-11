'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGyroscope } from '../hooks/useGyroscope';
import { CardDimensions, GyroscopeData } from '../types';
import AssetLayer from './AssetLayer';

// Credit card dimensions scaled up significantly for proper visibility
const CARD_DIMENSIONS: CardDimensions = {
  width: 20, // Much larger for proper scene filling
  height: 12.6, // Maintains credit card aspect ratio
  thickness: 0.2, // Thicker for better visibility
  aspectRatio: 85.6 / 53.98, // ~1.586
};

interface Card3DProps {
  isEditMode: boolean;
  className?: string;
}

const CardMesh: React.FC<{ 
  gyroscopeData: GyroscopeData; 
  isEditMode: boolean;
}> = ({ gyroscopeData, isEditMode }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current || isEditMode) return;

    // Apply gyroscope rotation when not in edit mode
    if (gyroscopeData.beta !== null && gyroscopeData.gamma !== null) {
      // Convert degrees to radians and limit rotation
      const maxRotation = Math.PI / 12; // 15 degrees max
      const betaRad = Math.max(-maxRotation, Math.min(maxRotation, (gyroscopeData.beta * Math.PI) / 180 / 6));
      const gammaRad = Math.max(-maxRotation, Math.min(maxRotation, (gyroscopeData.gamma * Math.PI) / 180 / 6));
      
      groupRef.current.rotation.x = betaRad;
      groupRef.current.rotation.y = -gammaRad;
    }
  });

  // Create custom geometry with rounded corners (only on the face, not beveled edges)
  const cardGeometry = useMemo(() => {
    const width = CARD_DIMENSIONS.width;
    const height = CARD_DIMENSIONS.height;
    const depth = CARD_DIMENSIONS.thickness;
    const radius = 1.2; // Corner radius - increased for more rounded appearance
    
    // Create a shape with rounded corners
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
    
    // Extrude the shape to create depth
    const extrudeSettings = {
      depth: depth,
      bevelEnabled: false,
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center the geometry so it's positioned like the original box
    geometry.translate(0, 0, -depth / 2);
    return geometry;
  }, []);

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={cardGeometry}>
        <meshStandardMaterial
          color="#f6fbc7"
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      <AssetLayer 
        cardDimensions={CARD_DIMENSIONS}
        isEditMode={isEditMode}
      />
    </group>
  );
};

const Card3D: React.FC<Card3DProps> = ({ isEditMode, className }) => {
  const { gyroscopeData } = useGyroscope(!isEditMode);

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <Canvas
        camera={{
          position: [0, 0, 15],
          fov: 60,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        
        <Suspense fallback={null}>
          <CardMesh 
            gyroscopeData={gyroscopeData} 
            isEditMode={isEditMode}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Card3D;
