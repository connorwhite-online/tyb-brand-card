'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { GyroscopeData } from '../types';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface Card3DProps {
  isEditMode: boolean;
  selectedStickers: string[];
  onStickerPositionChange?: (stickerId: string, position: { x: number; y: number }) => void;
  gyroscopeData?: GyroscopeData;
}

interface StickerPosition {
  id: string;
  x: number;
  y: number;
  z: number;
}

// Card mesh component with rounded corners
function CardMesh() {
  // Card dimensions (matching 2D aspect ratio 1.586:1)
  const cardWidth = 3.172;
  const cardHeight = 2;
  const cardDepth = 0.05;
  const cornerRadius = 0.12;

  // Create rounded rectangle shape
  const shape = React.useMemo(() => {
    const roundedRectShape = new THREE.Shape();
    const x = -cardWidth / 2;
    const y = -cardHeight / 2;
    const width = cardWidth;
    const height = cardHeight;
    const radius = cornerRadius;

    roundedRectShape.moveTo(x, y + radius);
    roundedRectShape.lineTo(x, y + height - radius);
    roundedRectShape.quadraticCurveTo(x, y + height, x + radius, y + height);
    roundedRectShape.lineTo(x + width - radius, y + height);
    roundedRectShape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    roundedRectShape.lineTo(x + width, y + radius);
    roundedRectShape.quadraticCurveTo(x + width, y, x + width - radius, y);
    roundedRectShape.lineTo(x + radius, y);
    roundedRectShape.quadraticCurveTo(x, y, x, y + radius);

    return roundedRectShape;
  }, [cardWidth, cardHeight, cornerRadius]);

  return (
    <mesh castShadow receiveShadow position={[0, 0, -cardDepth / 2]}>
      <extrudeGeometry
        args={[
          shape,
          {
            depth: cardDepth,
            bevelEnabled: false,
          },
        ]}
      />
      <meshStandardMaterial 
        color="#f6fbc7"
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  );
}

// Logo component with rounded corners
function LogoMesh() {
  const logoTexture = useTexture('/assets/logo.png');
  const logoSize = 0.5;
  const padding = 0.1;
  const cornerRadius = 0.06; // Rounded corners
  
  // Position: left edge + padding + half of logo size
  const xPos = -3.172/2 + padding + logoSize/2;
  const yPos = 2/2 - padding - logoSize/2;

  // Create rounded square shape with proper UVs
  const geometry = React.useMemo(() => {
    const roundedSquare = new THREE.Shape();
    const size = logoSize;
    const radius = cornerRadius;
    const x = -size / 2;
    const y = -size / 2;

    roundedSquare.moveTo(x, y + radius);
    roundedSquare.lineTo(x, y + size - radius);
    roundedSquare.quadraticCurveTo(x, y + size, x + radius, y + size);
    roundedSquare.lineTo(x + size - radius, y + size);
    roundedSquare.quadraticCurveTo(x + size, y + size, x + size, y + size - radius);
    roundedSquare.lineTo(x + size, y + radius);
    roundedSquare.quadraticCurveTo(x + size, y, x + size - radius, y);
    roundedSquare.lineTo(x + radius, y);
    roundedSquare.quadraticCurveTo(x, y, x, y + radius);

    const geom = new THREE.ShapeGeometry(roundedSquare);
    
    // Manually compute UVs for texture mapping
    const positions = geom.attributes.position;
    const uvs = new Float32Array(positions.count * 2);
    
    for (let i = 0; i < positions.count; i++) {
      const posX = positions.getX(i);
      const posY = positions.getY(i);
      
      // Map position to UV coordinates (0-1 range)
      uvs[i * 2] = (posX - x) / size;
      uvs[i * 2 + 1] = (posY - y) / size;
    }
    
    geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    
    return geom;
  }, [logoSize, cornerRadius]);

  return (
    <mesh position={[xPos, yPos, 0.026]} geometry={geometry}>
      <meshBasicMaterial map={logoTexture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

// Balance display with text
function BalanceMesh() {
  const padding = 0.1;
  
  // Position: right edge - padding, top edge - padding
  const xPos = 3.172/2 - padding;
  const yPos = 2/2 - padding;
  
  return (
    <Text
      position={[xPos, yPos, 0.026]}
      fontSize={0.2}
      color="black"
      anchorX="right"
      anchorY="top"
      fontWeight="bold"
      outlineWidth={0.005}
      outlineColor="black"
    >
      $60.14
    </Text>
  );
}

// TYB Logo
function TYBLogoMesh() {
  const tybLogoTexture = useTexture('/assets/tyb-logo.svg');
  const logoWidth = 0.5;
  const logoHeight = 0.25;
  const padding = 0.1;
  
  // Position: right edge - padding - half width, bottom edge + padding + half height
  const xPos = 3.172/2 - padding - logoWidth/2;
  const yPos = -2/2 + padding + logoHeight/2;
  
  return (
    <mesh position={[xPos, yPos, 0.026]}>
      <planeGeometry args={[logoWidth, logoHeight]} />
      <meshBasicMaterial map={tybLogoTexture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

// Individual sticker component
function StickerMesh({ 
  sticker, 
  isEditMode,
  isSelected,
  onDragStart,
  onDragEnd
}: { 
  sticker: StickerPosition;
  isEditMode: boolean;
  isSelected: boolean;
  onDragStart?: () => void;
  onDragEnd?: (position: { x: number; y: number }) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { camera, gl, raycaster, pointer } = useThree();
  
  // Load the sticker texture
  const stickerNumber = sticker.id.split('-')[1];
  const texture = useTexture(`/assets/sticker-0${stickerNumber}.png`);

  // Create custom depth material for shadows that respects alpha channel
  const customDepthMaterial = React.useMemo(() => {
    const material = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
    });
    
    // Modify shader to use texture's alpha channel
    material.onBeforeCompile = (shader) => {
      shader.uniforms.alphaMap = { value: texture };
      
      // Add uniform declaration at the top
      shader.fragmentShader = `
        uniform sampler2D alphaMap;
        ${shader.fragmentShader}
      `;
      
      // Add UV varying if not present
      if (!shader.fragmentShader.includes('varying vec2 vUv')) {
        shader.fragmentShader = `
          varying vec2 vUv;
          ${shader.fragmentShader}
        `;
        shader.vertexShader = `
          varying vec2 vUv;
          ${shader.vertexShader}
        `.replace(
          '#include <uv_vertex>',
          `#include <uv_vertex>
          vUv = uv;`
        );
      }
      
      // Add alpha test in the fragment shader
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
        vec4 texelColor = texture2D(alphaMap, vUv);
        if (texelColor.a < 0.5) discard;`
      );
    };
    
    return material;
  }, [texture]);

  // Animate z position and scale when dragging (lift effect)
  // Also handle continuous position updates while dragging
  useFrame(() => {
    if (!meshRef.current) return;
    const baseZ = sticker.z + 0.026;
    const targetZ = isDragging ? baseZ + 0.1 : baseZ;
    const targetScale = isDragging ? 1.001 : 1;
    
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      targetZ,
      0.15
    );
    
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      targetScale,
      0.15
    ));

    // Update position while dragging using the pointer from useThree
    if (isDragging) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const intersectPoint = new THREE.Vector3();
      
      // Use the raycaster from useThree which is automatically updated
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, intersectPoint);
      
      // Constrain to card bounds (account for sticker size)
      const cardWidth = 3.172;
      const cardHeight = 2;
      const stickerW = sticker.id === 'sticker-5' ? 1.05 : sticker.id === 'sticker-7' ? 0.87 : 0.52;
      const stickerH = sticker.id === 'sticker-5' ? 0.205 : sticker.id === 'sticker-7' ? 0.21 : 0.52;
      
      meshRef.current.position.x = Math.max(-cardWidth/2 + stickerW/2, Math.min(cardWidth/2 - stickerW/2, intersectPoint.x));
      meshRef.current.position.y = Math.max(-cardHeight/2 + stickerH/2, Math.min(cardHeight/2 - stickerH/2, intersectPoint.y));
    }
  });

  // Handle cursor styling
  useEffect(() => {
    if (hovered && isEditMode) {
      gl.domElement.style.cursor = 'grab';
    } else if (!isDragging) {
      gl.domElement.style.cursor = 'default';
    }
  }, [hovered, isEditMode, isDragging, gl]);

  // Add global pointer up handler to catch drag end even when pointer is off mesh
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalPointerUp = () => {
      setIsDragging(false);
      gl.domElement.style.cursor = hovered ? 'grab' : 'default';
      if (onDragEnd && meshRef.current) {
        onDragEnd({ x: meshRef.current.position.x, y: meshRef.current.position.y });
      }
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isDragging, hovered, onDragEnd, gl]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isEditMode) return;
    e.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
    if (onDragStart) onDragStart();
  };

  // Different sizes for non-square stickers (matching actual texture aspect ratios)
  // sticker-5: 333x65 (~5.12:1), sticker-7: 248x60 (~4.13:1)
  // All stickers scaled up for better visibility
  const stickerWidth = sticker.id === 'sticker-5' ? 1.05 : sticker.id === 'sticker-7' ? 0.87 : 0.52;
  const stickerHeight = sticker.id === 'sticker-5' ? 0.205 : sticker.id === 'sticker-7' ? 0.21 : 0.52;

  return (
    <mesh 
      ref={meshRef}
      position={[sticker.x, sticker.y, sticker.z + 0.026]}
      castShadow
      receiveShadow
      customDepthMaterial={customDepthMaterial}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <planeGeometry args={[stickerWidth, stickerHeight]} />
      <meshBasicMaterial 
        map={texture}
        transparent
        alphaTest={0.1}
        opacity={isSelected ? 1 : 0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Scene component
function Scene({ 
  isEditMode, 
  selectedStickers,
  stickers,
  setStickers,
  gyroscopeData
}: { 
  isEditMode: boolean;
  selectedStickers: string[];
  stickers: StickerPosition[];
  setStickers: React.Dispatch<React.SetStateAction<StickerPosition[]>>;
  gyroscopeData?: GyroscopeData;
}) {
  const cardGroupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  
  // Detect mobile device for responsive rotate speed
  const [isMobile, setIsMobile] = useState(false);
  
  // Gyroscope calibration - store initial values as neutral position
  const calibrationRef = useRef<{ beta: number; gamma: number } | null>(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Calibrate gyroscope on first valid reading
  useEffect(() => {
    if (gyroscopeData && gyroscopeData.beta !== null && gyroscopeData.gamma !== null && !calibrationRef.current) {
      calibrationRef.current = {
        beta: gyroscopeData.beta,
        gamma: gyroscopeData.gamma
      };
    }
  }, [gyroscopeData]);

  const handleDragEnd = (stickerId: string, position: { x: number; y: number }) => {
    setStickers(prev => 
      prev.map(s => s.id === stickerId ? { ...s, x: position.x, y: position.y } : s)
    );
  };

  // Handle rotation and animation for the entire card group
  useFrame((state) => {
    if (!cardGroupRef.current) return;

    if (isEditMode) {
      // In edit mode, smoothly rotate to face forward (0, 0, 0)
      const targetQuaternion = new THREE.Quaternion(); // Identity quaternion = no rotation
      
      // Slerp current quaternion towards target (0, 0, 0 rotation)
      cardGroupRef.current.quaternion.slerp(targetQuaternion, 0.08);
      
      // Keep position at origin (no floating)
      cardGroupRef.current.position.y = THREE.MathUtils.lerp(cardGroupRef.current.position.y, 0, 0.08);
      
      // Scale up slightly in edit mode
      const targetScale = 1.15;
      cardGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(cardGroupRef.current.scale.x, targetScale, 0.08)
      );
      
      // Smoothly move camera to default position when in edit mode
      const targetCameraPosition = new THREE.Vector3(0, 0, 5);
      state.camera.position.lerp(targetCameraPosition, 0.08);
      
      // Update controls target
      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.08);
        controlsRef.current.update();
      }
    } else {
      // Subtle floating animation in non-edit mode (smoothly lerp to floating target)
      const floatingTarget = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      cardGroupRef.current.position.y = THREE.MathUtils.lerp(
        cardGroupRef.current.position.y,
        floatingTarget,
        0.08
      );
      
      // Scale back to normal when not in edit mode
      const targetScale = 1.0;
      cardGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(cardGroupRef.current.scale.x, targetScale, 0.08)
      );

      // Apply gyroscope rotation if available
      if (gyroscopeData && gyroscopeData.beta !== null && gyroscopeData.gamma !== null && calibrationRef.current) {
        // Calculate relative rotation from calibrated neutral position
        const deltaBeta = gyroscopeData.beta - calibrationRef.current.beta;
        const deltaGamma = gyroscopeData.gamma - calibrationRef.current.gamma;
        
        // Convert to radians with subtle multiplier
        // Increased max rotation and smoother response
        const maxRotation = 0.5; // Increased from 0.15 to allow more tilt
        const targetRotationX = Math.max(-maxRotation, Math.min(maxRotation, (deltaBeta / 6) * (Math.PI / 180)));
        const targetRotationY = Math.max(-maxRotation, Math.min(maxRotation, (-deltaGamma / 6) * (Math.PI / 180)));

        // Create target quaternion from euler angles
        const targetEuler = new THREE.Euler(targetRotationX, targetRotationY, 0, 'XYZ');
        const targetQuaternion = new THREE.Quaternion().setFromEuler(targetEuler);
        
        // Smoothly lerp to target rotation
        cardGroupRef.current.quaternion.slerp(targetQuaternion, 0.05);
      }
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
      <OrbitControls 
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={!isEditMode}
        maxDistance={7}
        minDistance={3}
        target={[0, 0, 0]}
        rotateSpeed={isMobile ? 0.1 : 0.05}
        minPolarAngle={Math.PI / 2 - 0.5}
        maxPolarAngle={Math.PI / 2 + 0.5}
        minAzimuthAngle={-0.5}
        maxAzimuthAngle={0.5}
      />
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[2, 3, 5]} 
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0001}
      />
      
      {/* Card with all children grouped together */}
      <group ref={cardGroupRef}>
        <CardMesh />
        
        {/* Static elements */}
        <LogoMesh />
        <BalanceMesh />
        <TYBLogoMesh />
        
        {/* Stickers */}
        {stickers
          .filter(s => selectedStickers.includes(s.id))
          .map((sticker) => (
            <StickerMesh
              key={sticker.id}
              sticker={sticker}
              isEditMode={isEditMode}
              isSelected={selectedStickers.includes(sticker.id)}
              onDragEnd={(position) => handleDragEnd(sticker.id, position)}
            />
          ))}
      </group>
    </>
  );
}

const Card3D: React.FC<Card3DProps> = ({ 
  isEditMode, 
  selectedStickers,
  onStickerPositionChange,
  gyroscopeData
}) => {
  const [stickers, setStickers] = useState<StickerPosition[]>([
    { id: 'sticker-1', x: -0.8, y: 0.3, z: 0.001 },
    { id: 'sticker-2', x: 0.5, y: 0.2, z: 0.002 },
    { id: 'sticker-3', x: -1.0, y: -0.2, z: 0.003 },
    { id: 'sticker-4', x: 0.8, y: 0.4, z: 0.004 },
    { id: 'sticker-5', x: -0.2, y: 0.1, z: 0.005 },
    { id: 'sticker-6', x: -1.2, y: 0.0, z: 0.006 },
    { id: 'sticker-7', x: 0.3, y: -0.4, z: 0.007 },
  ]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas shadows>
        <Scene 
          isEditMode={isEditMode}
          selectedStickers={selectedStickers}
          stickers={stickers}
          setStickers={setStickers}
          gyroscopeData={gyroscopeData}
        />
      </Canvas>
    </div>
  );
};

export default Card3D;
