import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChestRegion {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  hoverColor: string;
  description: string;
}

const chestRegions: ChestRegion[] = [
  {
    id: "center-chest",
    name: "Center Chest",
    position: [0, 0.3, 0.8],
    color: "#ef4444",
    hoverColor: "#dc2626",
    description: "Central chest area, behind the breastbone"
  },
  {
    id: "left-chest",
    name: "Left Chest",
    position: [-0.6, 0.2, 0.6],
    color: "#f97316",
    hoverColor: "#ea580c",
    description: "Left side of chest, near the heart"
  },
  {
    id: "right-chest",
    name: "Right Chest",
    position: [0.6, 0.2, 0.6],
    color: "#eab308",
    hoverColor: "#ca8a04",
    description: "Right side of chest"
  },
  {
    id: "upper-chest",
    name: "Upper Chest",
    position: [0, 0.8, 0.5],
    color: "#22c55e",
    hoverColor: "#16a34a",
    description: "Upper chest area, near the collarbone"
  },
  {
    id: "lower-chest",
    name: "Lower Chest",
    position: [0, -0.3, 0.7],
    color: "#3b82f6",
    hoverColor: "#2563eb",
    description: "Lower chest area, above the stomach"
  },
  {
    id: "whole-chest",
    name: "Entire Chest",
    position: [0, -0.8, 0],
    color: "#8b5cf6",
    hoverColor: "#7c3aed",
    description: "Pain affecting the whole chest area"
  }
];

interface ChestRegionProps {
  region: ChestRegion;
  onSelect: (region: ChestRegion) => void;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const ChestRegionMarker = ({ region, onSelect, isHovered, onHover }: ChestRegionProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={region.position}
      onClick={() => onSelect(region)}
      onPointerOver={() => onHover(region.id)}
      onPointerOut={() => onHover(null)}
    >
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial 
        color={isHovered ? region.hoverColor : region.color} 
        emissive={isHovered ? region.hoverColor : region.color}
        emissiveIntensity={isHovered ? 0.4 : 0.15}
      />
    </mesh>
  );
};

const HeartOrgan = () => {
  const heartRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (heartRef.current) {
      // Gentle heartbeat animation
      const beat = Math.sin(state.clock.elapsedTime * 2.5) * 0.03 + 1;
      heartRef.current.scale.setScalar(beat);
      heartRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={heartRef}>
      {/* Main heart body - left ventricle */}
      <mesh position={[-0.15, -0.1, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#b91c1c"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      
      {/* Right ventricle */}
      <mesh position={[0.2, -0.05, 0.1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color="#991b1b"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      
      {/* Left atrium */}
      <mesh position={[-0.2, 0.4, -0.1]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#dc2626"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      
      {/* Right atrium */}
      <mesh position={[0.25, 0.35, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial 
          color="#ef4444"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      
      {/* Aorta */}
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.12, 0.15, 0.5, 16]} />
        <meshStandardMaterial 
          color="#dc2626"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Pulmonary artery */}
      <mesh position={[0.15, 0.65, 0.1]} rotation={[0.3, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 16]} />
        <meshStandardMaterial 
          color="#3b82f6"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Veins */}
      <mesh position={[-0.3, 0.5, -0.15]} rotation={[0.2, 0, -0.3]}>
        <cylinderGeometry args={[0.06, 0.08, 0.3, 16]} />
        <meshStandardMaterial 
          color="#1d4ed8"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

interface HeartSceneProps {
  onSelectRegion: (region: ChestRegion) => void;
  hoveredRegion: string | null;
  onHoverRegion: (id: string | null) => void;
}

const HeartScene = ({ onSelectRegion, hoveredRegion, onHoverRegion }: HeartSceneProps) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#ff6b6b" />
      <pointLight position={[0, 3, 3]} intensity={0.4} color="#ffffff" />
      
      <HeartOrgan />
      
      {chestRegions.map((region) => (
        <ChestRegionMarker
          key={region.id}
          region={region}
          onSelect={onSelectRegion}
          isHovered={hoveredRegion === region.id}
          onHover={onHoverRegion}
        />
      ))}
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
};

interface HeartModel3DProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string, description: string) => void;
}

const HeartModel3D = ({ isOpen, onClose, onSelectLocation }: HeartModel3DProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<ChestRegion | null>(null);

  const handleSelectRegion = (region: ChestRegion) => {
    setSelectedRegion(region);
  };

  const handleConfirmSelection = () => {
    if (selectedRegion) {
      onSelectLocation(selectedRegion.name, selectedRegion.description);
      onClose();
      setSelectedRegion(null);
    }
  };

  const hoveredInfo = chestRegions.find(r => r.id === hoveredRegion);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-2xl w-full max-w-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold">Where is your chest pain?</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 3D Canvas */}
            <div className="h-80 bg-gradient-to-b from-red-950/20 to-background">
              <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <HeartScene 
                  onSelectRegion={handleSelectRegion}
                  hoveredRegion={hoveredRegion}
                  onHoverRegion={setHoveredRegion}
                />
              </Canvas>
            </div>

            {/* Region Info */}
            <div className="p-4 border-t border-border bg-muted/30">
              {hoveredInfo && !selectedRegion ? (
                <div className="text-center animate-fade-in">
                  <p className="font-medium text-foreground">{hoveredInfo.name}</p>
                  <p className="text-sm text-muted-foreground">{hoveredInfo.description}</p>
                </div>
              ) : selectedRegion ? (
                <div className="text-center animate-fade-in">
                  <div 
                    className="inline-block w-4 h-4 rounded-full mb-2"
                    style={{ backgroundColor: selectedRegion.color }}
                  />
                  <p className="font-medium text-foreground">Selected: {selectedRegion.name}</p>
                  <p className="text-sm text-muted-foreground mb-3">{selectedRegion.description}</p>
                  <Button variant="hero" onClick={handleConfirmSelection}>
                    Confirm Selection
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Click on a colored region to select where your chest hurts
                </p>
              )}
            </div>

            {/* Legend */}
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Pain Regions:</p>
              <div className="flex flex-wrap gap-2">
                {chestRegions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => handleSelectRegion(region)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all ${
                      selectedRegion?.id === region.id 
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-foreground">{region.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeartModel3D;
