import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeadRegion {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  hoverColor: string;
  description: string;
}

const headRegions: HeadRegion[] = [
  {
    id: "frontal",
    name: "Frontal (Forehead)",
    position: [0, 0.8, 0.9],
    color: "#ef4444",
    hoverColor: "#dc2626",
    description: "Front of the head, above the eyes"
  },
  {
    id: "temporal-left",
    name: "Left Temple",
    position: [-1, 0.3, 0.3],
    color: "#f97316",
    hoverColor: "#ea580c",
    description: "Left side of the head, near the ear"
  },
  {
    id: "temporal-right",
    name: "Right Temple",
    position: [1, 0.3, 0.3],
    color: "#f97316",
    hoverColor: "#ea580c",
    description: "Right side of the head, near the ear"
  },
  {
    id: "parietal",
    name: "Top of Head",
    position: [0, 1.2, 0],
    color: "#eab308",
    hoverColor: "#ca8a04",
    description: "Crown of the head"
  },
  {
    id: "occipital",
    name: "Back of Head",
    position: [0, 0.5, -0.9],
    color: "#22c55e",
    hoverColor: "#16a34a",
    description: "Back of the head, above the neck"
  },
  {
    id: "whole-head",
    name: "Entire Head",
    position: [0, -0.5, 0],
    color: "#8b5cf6",
    hoverColor: "#7c3aed",
    description: "Pain affecting the whole head"
  }
];

interface SkullRegionProps {
  region: HeadRegion;
  onSelect: (region: HeadRegion) => void;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const SkullRegion = ({ region, onSelect, isHovered, onHover }: SkullRegionProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.2 : 1;
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
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial 
        color={isHovered ? region.hoverColor : region.color} 
        emissive={isHovered ? region.hoverColor : region.color}
        emissiveIntensity={isHovered ? 0.3 : 0.1}
      />
    </mesh>
  );
};

const SkullBase = () => {
  const skullRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (skullRef.current) {
      skullRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={skullRef}>
      {/* Main skull shape - ellipsoid */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial 
          color="#f5f5f4" 
          transparent 
          opacity={0.3}
          roughness={0.5}
        />
      </mesh>
      
      {/* Jaw area */}
      <mesh position={[0, -0.4, 0.3]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#f5f5f4" 
          transparent 
          opacity={0.2}
          roughness={0.5}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.35, 0.2, 0.85]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.35, 0.2, 0.85]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, -0.1, 1]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshStandardMaterial color="#e7e5e4" />
      </mesh>
    </group>
  );
};

interface SkullSceneProps {
  onSelectRegion: (region: HeadRegion) => void;
  hoveredRegion: string | null;
  onHoverRegion: (id: string | null) => void;
}

const SkullScene = ({ onSelectRegion, hoveredRegion, onHoverRegion }: SkullSceneProps) => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      
      <SkullBase />
      
      {headRegions.map((region) => (
        <SkullRegion
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

interface SkullModel3DProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string, description: string) => void;
}

const SkullModel3D = ({ isOpen, onClose, onSelectLocation }: SkullModel3DProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<HeadRegion | null>(null);

  const handleSelectRegion = (region: HeadRegion) => {
    setSelectedRegion(region);
  };

  const handleConfirmSelection = () => {
    if (selectedRegion) {
      onSelectLocation(selectedRegion.name, selectedRegion.description);
      onClose();
      setSelectedRegion(null);
    }
  };

  const hoveredInfo = headRegions.find(r => r.id === hoveredRegion);

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
                <Brain className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Where does your head hurt?</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 3D Canvas */}
            <div className="h-80 bg-gradient-to-b from-background to-muted/30">
              <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <SkullScene 
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
                  Click on a colored region to select where your head hurts
                </p>
              )}
            </div>

            {/* Legend */}
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Pain Regions:</p>
              <div className="flex flex-wrap gap-2">
                {headRegions.map((region) => (
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

export default SkullModel3D;
