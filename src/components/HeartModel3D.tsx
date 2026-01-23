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
    name: "Central Chest (Sternum)",
    position: [0, 0.2, 1.1],
    color: "#ef4444",
    hoverColor: "#dc2626",
    description: "Behind the breastbone - most common angina location"
  },
  {
    id: "left-chest",
    name: "Left Chest (Heart Area)",
    position: [-0.5, 0.1, 1.0],
    color: "#f97316",
    hoverColor: "#ea580c",
    description: "Left side near the heart - cardiac-related pain"
  },
  {
    id: "right-chest",
    name: "Right Chest",
    position: [0.5, 0.1, 1.0],
    color: "#eab308",
    hoverColor: "#ca8a04",
    description: "Right side of chest - may indicate lung or muscle issues"
  },
  {
    id: "upper-chest",
    name: "Upper Chest",
    position: [0, 0.7, 0.9],
    color: "#22c55e",
    hoverColor: "#16a34a",
    description: "Upper chest near collarbone - may radiate to neck"
  },
  {
    id: "lower-chest",
    name: "Lower Chest",
    position: [0, -0.4, 1.0],
    color: "#3b82f6",
    hoverColor: "#2563eb",
    description: "Lower chest area - may be digestive or cardiac"
  },
  {
    id: "left-shoulder",
    name: "Left Shoulder/Arm",
    position: [-1.1, 0.3, 0.5],
    color: "#8b5cf6",
    hoverColor: "#7c3aed",
    description: "Radiating to left arm - classic heart attack symptom"
  },
  {
    id: "right-shoulder",
    name: "Right Shoulder/Arm",
    position: [1.1, 0.3, 0.5],
    color: "#06b6d4",
    hoverColor: "#0891b2",
    description: "Radiating to right arm - less common cardiac presentation"
  },
  {
    id: "back-chest",
    name: "Back (Behind Heart)",
    position: [0, 0.1, -0.8],
    color: "#ec4899",
    hoverColor: "#db2777",
    description: "Pain radiating to back - may indicate aortic issues"
  },
  {
    id: "left-ribs",
    name: "Left Rib Area",
    position: [-0.8, -0.2, 0.7],
    color: "#14b8a6",
    hoverColor: "#0d9488",
    description: "Left side ribs - may be muscular or cardiac"
  },
  {
    id: "right-ribs",
    name: "Right Rib Area",
    position: [0.8, -0.2, 0.7],
    color: "#f59e0b",
    hoverColor: "#d97706",
    description: "Right side ribs - often muscular or respiratory"
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
      const targetScale = isHovered ? 1.4 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
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
      <sphereGeometry args={[0.1, 24, 24]} />
      <meshStandardMaterial 
        color={isHovered ? region.hoverColor : region.color} 
        emissive={isHovered ? region.hoverColor : region.color}
        emissiveIntensity={isHovered ? 0.5 : 0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

const AnatomicalHeart = () => {
  const heartRef = useRef<THREE.Group>(null);
  
  const heartRed = "#8b1538";
  const heartDark = "#6b0f2a";
  const heartLight = "#a82040";
  const veinBlue = "#2d4a8c";
  const arteryRed = "#c41e3a";
  
  useFrame((state) => {
    if (heartRef.current) {
      // Heartbeat animation
      const beat = Math.sin(state.clock.elapsedTime * 2.8) * 0.04 + 1;
      heartRef.current.scale.setScalar(beat);
      heartRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
  });

  return (
    <group ref={heartRef} position={[0, -0.1, 0]}>
      {/* ===== LEFT VENTRICLE ===== */}
      <mesh position={[-0.15, -0.2, 0.1]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={heartRed} roughness={0.45} />
      </mesh>
      
      {/* Left ventricle apex */}
      <mesh position={[-0.1, -0.65, 0.15]} rotation={[0.2, 0, 0.15]}>
        <coneGeometry args={[0.35, 0.5, 24]} />
        <meshStandardMaterial color={heartDark} roughness={0.5} />
      </mesh>
      
      {/* ===== RIGHT VENTRICLE ===== */}
      <mesh position={[0.25, -0.15, 0.2]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={heartLight} roughness={0.45} />
      </mesh>
      
      {/* ===== LEFT ATRIUM ===== */}
      <mesh position={[-0.2, 0.35, -0.15]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={heartRed} roughness={0.4} />
      </mesh>
      
      {/* Left atrial appendage */}
      <mesh position={[-0.45, 0.4, 0.05]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.1, 0.18, 8, 16]} />
        <meshStandardMaterial color={heartDark} roughness={0.45} />
      </mesh>
      
      {/* ===== RIGHT ATRIUM ===== */}
      <mesh position={[0.3, 0.3, 0.05]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={heartLight} roughness={0.4} />
      </mesh>
      
      {/* Right atrial appendage */}
      <mesh position={[0.55, 0.35, 0.15]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.08, 0.15, 8, 16]} />
        <meshStandardMaterial color={heartLight} roughness={0.45} />
      </mesh>
      
      {/* ===== AORTA ===== */}
      <mesh position={[0, 0.6, 0]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.35, 24]} />
        <meshStandardMaterial color={arteryRed} roughness={0.35} />
      </mesh>
      
      {/* Aortic arch */}
      <mesh position={[0, 0.85, -0.15]} rotation={[1.2, 0, 0]}>
        <torusGeometry args={[0.2, 0.1, 16, 24, Math.PI]} />
        <meshStandardMaterial color={arteryRed} roughness={0.35} />
      </mesh>
      
      {/* Descending aorta */}
      <mesh position={[0, 0.65, -0.4]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 16]} />
        <meshStandardMaterial color={arteryRed} roughness={0.4} />
      </mesh>
      
      {/* ===== PULMONARY ARTERY ===== */}
      <mesh position={[0.15, 0.55, 0.15]} rotation={[-0.2, 0, 0.25]}>
        <cylinderGeometry args={[0.1, 0.12, 0.3, 16]} />
        <meshStandardMaterial color={veinBlue} roughness={0.4} />
      </mesh>
      
      {/* Pulmonary trunk split */}
      <mesh position={[-0.1, 0.7, 0.1]} rotation={[0.2, 0, 0.6]}>
        <cylinderGeometry args={[0.06, 0.08, 0.25, 12]} />
        <meshStandardMaterial color={veinBlue} roughness={0.4} />
      </mesh>
      
      <mesh position={[0.25, 0.7, 0.12]} rotation={[0.2, 0, -0.5]}>
        <cylinderGeometry args={[0.06, 0.08, 0.22, 12]} />
        <meshStandardMaterial color={veinBlue} roughness={0.4} />
      </mesh>
      
      {/* ===== SUPERIOR VENA CAVA ===== */}
      <mesh position={[0.35, 0.6, -0.1]} rotation={[0.15, 0, -0.1]}>
        <cylinderGeometry args={[0.08, 0.1, 0.35, 16]} />
        <meshStandardMaterial color={veinBlue} roughness={0.45} />
      </mesh>
      
      {/* ===== INFERIOR VENA CAVA ===== */}
      <mesh position={[0.25, -0.45, -0.1]} rotation={[0.1, 0, 0.05]}>
        <cylinderGeometry args={[0.1, 0.08, 0.3, 16]} />
        <meshStandardMaterial color={veinBlue} roughness={0.45} />
      </mesh>
      
      {/* ===== PULMONARY VEINS ===== */}
      <mesh position={[-0.4, 0.45, -0.25]} rotation={[0.3, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.2, 12]} />
        <meshStandardMaterial color={arteryRed} roughness={0.4} />
      </mesh>
      
      <mesh position={[-0.35, 0.3, -0.3]} rotation={[0.5, 0.3, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.18, 12]} />
        <meshStandardMaterial color={arteryRed} roughness={0.4} />
      </mesh>
      
      {/* ===== CORONARY ARTERIES ===== */}
      {/* Left coronary */}
      <mesh position={[-0.3, 0.1, 0.35]} rotation={[0.5, 0.8, 0.3]}>
        <torusGeometry args={[0.25, 0.025, 8, 24, Math.PI * 0.8]} />
        <meshStandardMaterial color="#ff6b6b" roughness={0.3} emissive="#ff6b6b" emissiveIntensity={0.1} />
      </mesh>
      
      {/* Right coronary */}
      <mesh position={[0.35, 0.05, 0.3]} rotation={[0.6, -0.6, -0.2]}>
        <torusGeometry args={[0.22, 0.022, 8, 24, Math.PI * 0.7]} />
        <meshStandardMaterial color="#ff6b6b" roughness={0.3} emissive="#ff6b6b" emissiveIntensity={0.1} />
      </mesh>
      
      {/* ===== SURFACE DETAILS ===== */}
      {/* Interventricular groove */}
      <mesh position={[0.05, -0.25, 0.45]} rotation={[0.15, 0, 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshStandardMaterial color={heartDark} roughness={0.5} />
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 4, 5]} intensity={0.85} castShadow />
      <directionalLight position={[-3, 2, 3]} intensity={0.35} />
      <pointLight position={[0, -2, 4]} intensity={0.3} color="#ffcccc" />
      <pointLight position={[0, 2, -2]} intensity={0.2} color="#ccccff" />
      
      <AnatomicalHeart />
      
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
        enableZoom={true}
        minDistance={2}
        maxDistance={5}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.3}
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
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold">Select Chest Pain Location</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 3D Canvas */}
            <div className="h-[400px] bg-gradient-to-b from-red-950/30 to-slate-900">
              <Canvas camera={{ position: [0, 0, 3.2], fov: 42 }}>
                <HeartScene 
                  onSelectRegion={handleSelectRegion}
                  hoveredRegion={hoveredRegion}
                  onHoverRegion={setHoveredRegion}
                />
              </Canvas>
            </div>

            {/* Region Info */}
            <div className="p-4 border-t border-border bg-muted/30 min-h-[80px]">
              {hoveredInfo && !selectedRegion ? (
                <div className="text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: hoveredInfo.color }}
                    />
                    <p className="font-medium text-foreground">{hoveredInfo.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{hoveredInfo.description}</p>
                </div>
              ) : selectedRegion ? (
                <div className="text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedRegion.color }}
                    />
                    <p className="font-medium text-foreground">Selected: {selectedRegion.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{selectedRegion.description}</p>
                  <Button variant="hero" onClick={handleConfirmSelection}>
                    Confirm Selection
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  🖱️ Click and drag to rotate • Click colored markers to select pain location
                </p>
              )}
            </div>

            {/* Legend */}
            <div className="p-4 border-t border-border max-h-32 overflow-y-auto">
              <p className="text-xs text-muted-foreground mb-2">10 Pain Regions:</p>
              <div className="flex flex-wrap gap-1.5">
                {chestRegions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => handleSelectRegion(region)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all ${
                      selectedRegion?.id === region.id 
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/10' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full"
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
