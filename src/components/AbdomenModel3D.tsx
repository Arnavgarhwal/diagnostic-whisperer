import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AbdomenRegion {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  hoverColor: string;
  description: string;
  organ?: string;
}

const abdomenRegions: AbdomenRegion[] = [
  {
    id: "epigastric",
    name: "Upper Center (Epigastric)",
    position: [0, 0.6, 0.6],
    color: "#ef4444",
    hoverColor: "#dc2626",
    description: "Upper middle abdomen, below the breastbone",
    organ: "Stomach"
  },
  {
    id: "right-upper",
    name: "Right Upper Quadrant",
    position: [0.5, 0.4, 0.5],
    color: "#f97316",
    hoverColor: "#ea580c",
    description: "Upper right abdomen",
    organ: "Liver, Gallbladder"
  },
  {
    id: "left-upper",
    name: "Left Upper Quadrant",
    position: [-0.5, 0.4, 0.5],
    color: "#eab308",
    hoverColor: "#ca8a04",
    description: "Upper left abdomen",
    organ: "Spleen, Stomach"
  },
  {
    id: "umbilical",
    name: "Around Navel",
    position: [0, 0, 0.7],
    color: "#22c55e",
    hoverColor: "#16a34a",
    description: "Center of abdomen, around the belly button",
    organ: "Small Intestine"
  },
  {
    id: "right-lower",
    name: "Right Lower Quadrant",
    position: [0.5, -0.4, 0.5],
    color: "#3b82f6",
    hoverColor: "#2563eb",
    description: "Lower right abdomen",
    organ: "Appendix"
  },
  {
    id: "left-lower",
    name: "Left Lower Quadrant",
    position: [-0.5, -0.4, 0.5],
    color: "#6366f1",
    hoverColor: "#4f46e5",
    description: "Lower left abdomen",
    organ: "Colon"
  },
  {
    id: "suprapubic",
    name: "Lower Center",
    position: [0, -0.6, 0.6],
    color: "#a855f7",
    hoverColor: "#9333ea",
    description: "Lower middle abdomen, above the pelvis",
    organ: "Bladder"
  },
  {
    id: "whole-abdomen",
    name: "Entire Abdomen",
    position: [0, -1, 0],
    color: "#ec4899",
    hoverColor: "#db2777",
    description: "Pain affecting the whole abdominal area"
  }
];

interface AbdomenRegionProps {
  region: AbdomenRegion;
  onSelect: (region: AbdomenRegion) => void;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const AbdomenRegionMarker = ({ region, onSelect, isHovered, onHover }: AbdomenRegionProps) => {
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
      <sphereGeometry args={[0.12, 32, 32]} />
      <meshStandardMaterial 
        color={isHovered ? region.hoverColor : region.color} 
        emissive={isHovered ? region.hoverColor : region.color}
        emissiveIntensity={isHovered ? 0.4 : 0.15}
      />
    </mesh>
  );
};

const AbdomenOrgans = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      // Subtle breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.02 + 1;
      groupRef.current.scale.z = breathe;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Torso outline - transparent */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.7, 2, 32]} />
        <meshStandardMaterial 
          color="#fcd9b6"
          transparent 
          opacity={0.15}
          roughness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Stomach */}
      <mesh position={[-0.15, 0.4, 0.2]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial 
          color="#f472b6"
          roughness={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Liver */}
      <mesh position={[0.35, 0.35, 0.15]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial 
          color="#991b1b"
          roughness={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Gallbladder */}
      <mesh position={[0.25, 0.2, 0.3]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color="#22c55e"
          roughness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Small intestine representation */}
      <mesh position={[0, -0.1, 0.25]}>
        <torusGeometry args={[0.25, 0.08, 16, 32]} />
        <meshStandardMaterial 
          color="#fca5a5"
          roughness={0.6}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Large intestine - colon */}
      <mesh position={[0, -0.15, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.1, 16, 32, Math.PI * 1.5]} />
        <meshStandardMaterial 
          color="#c084fc"
          roughness={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Spleen */}
      <mesh position={[-0.45, 0.3, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial 
          color="#7c3aed"
          roughness={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Bladder */}
      <mesh position={[0, -0.6, 0.3]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#fbbf24"
          roughness={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

interface AbdomenSceneProps {
  onSelectRegion: (region: AbdomenRegion) => void;
  hoveredRegion: string | null;
  onHoverRegion: (id: string | null) => void;
}

const AbdomenScene = ({ onSelectRegion, hoveredRegion, onHoverRegion }: AbdomenSceneProps) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#fef3c7" />
      <pointLight position={[3, -3, 3]} intensity={0.3} color="#dbeafe" />
      
      <AbdomenOrgans />
      
      {abdomenRegions.map((region) => (
        <AbdomenRegionMarker
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

interface AbdomenModel3DProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string, description: string) => void;
}

const AbdomenModel3D = ({ isOpen, onClose, onSelectLocation }: AbdomenModel3DProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<AbdomenRegion | null>(null);

  const handleSelectRegion = (region: AbdomenRegion) => {
    setSelectedRegion(region);
  };

  const handleConfirmSelection = () => {
    if (selectedRegion) {
      const description = selectedRegion.organ 
        ? `${selectedRegion.description}. Related organ: ${selectedRegion.organ}`
        : selectedRegion.description;
      onSelectLocation(selectedRegion.name, description);
      onClose();
      setSelectedRegion(null);
    }
  };

  const hoveredInfo = abdomenRegions.find(r => r.id === hoveredRegion);

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
                <CircleDot className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Where is your stomach/abdominal pain?</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 3D Canvas */}
            <div className="h-80 bg-gradient-to-b from-orange-950/20 to-background">
              <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
                <AbdomenScene 
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
                  {hoveredInfo.organ && (
                    <p className="text-xs text-primary mt-1">Related: {hoveredInfo.organ}</p>
                  )}
                </div>
              ) : selectedRegion ? (
                <div className="text-center animate-fade-in">
                  <div 
                    className="inline-block w-4 h-4 rounded-full mb-2"
                    style={{ backgroundColor: selectedRegion.color }}
                  />
                  <p className="font-medium text-foreground">Selected: {selectedRegion.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedRegion.description}</p>
                  {selectedRegion.organ && (
                    <p className="text-xs text-primary mt-1">Related: {selectedRegion.organ}</p>
                  )}
                  <Button variant="hero" className="mt-3" onClick={handleConfirmSelection}>
                    Confirm Selection
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Click on a colored region to select where your abdomen hurts
                </p>
              )}
            </div>

            {/* Legend */}
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Pain Regions:</p>
              <div className="flex flex-wrap gap-2">
                {abdomenRegions.map((region) => (
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

export default AbdomenModel3D;
