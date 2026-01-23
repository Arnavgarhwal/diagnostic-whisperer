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
    name: "Epigastric (Upper Center)",
    position: [0, 0.7, 0.8],
    color: "#ef4444",
    hoverColor: "#dc2626",
    description: "Upper middle abdomen below breastbone",
    organ: "Stomach, Pancreas"
  },
  {
    id: "right-hypochondriac",
    name: "Right Upper (Hypochondriac)",
    position: [0.6, 0.6, 0.7],
    color: "#f97316",
    hoverColor: "#ea580c",
    description: "Upper right below ribs",
    organ: "Liver, Gallbladder"
  },
  {
    id: "left-hypochondriac",
    name: "Left Upper (Hypochondriac)",
    position: [-0.6, 0.6, 0.7],
    color: "#eab308",
    hoverColor: "#ca8a04",
    description: "Upper left below ribs",
    organ: "Spleen, Stomach"
  },
  {
    id: "umbilical",
    name: "Umbilical (Around Navel)",
    position: [0, 0.1, 0.9],
    color: "#22c55e",
    hoverColor: "#16a34a",
    description: "Center around belly button",
    organ: "Small Intestine"
  },
  {
    id: "right-lumbar",
    name: "Right Flank (Lumbar)",
    position: [0.7, 0.15, 0.6],
    color: "#3b82f6",
    hoverColor: "#2563eb",
    description: "Right side at waist level",
    organ: "Ascending Colon, Right Kidney"
  },
  {
    id: "left-lumbar",
    name: "Left Flank (Lumbar)",
    position: [-0.7, 0.15, 0.6],
    color: "#8b5cf6",
    hoverColor: "#7c3aed",
    description: "Left side at waist level",
    organ: "Descending Colon, Left Kidney"
  },
  {
    id: "right-iliac",
    name: "Right Lower (Iliac)",
    position: [0.55, -0.45, 0.75],
    color: "#ec4899",
    hoverColor: "#db2777",
    description: "Lower right abdomen",
    organ: "Appendix, Cecum"
  },
  {
    id: "left-iliac",
    name: "Left Lower (Iliac)",
    position: [-0.55, -0.45, 0.75],
    color: "#14b8a6",
    hoverColor: "#0d9488",
    description: "Lower left abdomen",
    organ: "Sigmoid Colon"
  },
  {
    id: "suprapubic",
    name: "Suprapubic (Lower Center)",
    position: [0, -0.55, 0.8],
    color: "#06b6d4",
    hoverColor: "#0891b2",
    description: "Lower middle above pubic bone",
    organ: "Bladder, Uterus (female)"
  },
  {
    id: "periumbilical",
    name: "Around Navel (Deep)",
    position: [0, 0.1, 0.5],
    color: "#f59e0b",
    hoverColor: "#d97706",
    description: "Deep central abdominal pain",
    organ: "Aorta, Mesenteric vessels"
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

const AnatomicalAbdomen = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const skinColor = "#e8c4a8";
  const organPink = "#de8a8a";
  const liverBrown = "#8b4a3c";
  const stomachPink = "#d4868a";
  const intestineRed = "#c97878";
  const kidneyBrown = "#9e6b5a";
  const spleenPurple = "#7c5a7a";
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
      // Breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 0.7) * 0.015 + 1;
      groupRef.current.scale.z = breathe;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ===== TORSO OUTLINE ===== */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.85, 0.75, 1.8, 32]} />
        <meshStandardMaterial 
          color={skinColor}
          transparent 
          opacity={0.18}
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Ribcage hint */}
      <mesh position={[0, 0.7, 0.3]}>
        <sphereGeometry args={[0.7, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#f0d0b8"
          transparent 
          opacity={0.12}
          roughness={0.7}
        />
      </mesh>
      
      {/* ===== LIVER ===== */}
      <mesh position={[0.35, 0.55, 0.25]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={liverBrown} roughness={0.5} transparent opacity={0.85} />
      </mesh>
      
      {/* Liver right lobe */}
      <mesh position={[0.55, 0.45, 0.2]}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color={liverBrown} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      
      {/* Liver left lobe */}
      <mesh position={[0.1, 0.5, 0.3]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#7a4035" roughness={0.5} transparent opacity={0.8} />
      </mesh>
      
      {/* ===== GALLBLADDER ===== */}
      <mesh position={[0.4, 0.35, 0.4]} rotation={[0.3, 0, 0.2]}>
        <capsuleGeometry args={[0.05, 0.12, 8, 12]} />
        <meshStandardMaterial color="#4a8c4a" roughness={0.4} transparent opacity={0.9} />
      </mesh>
      
      {/* ===== STOMACH ===== */}
      <mesh position={[-0.2, 0.45, 0.3]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color={stomachPink} roughness={0.45} transparent opacity={0.8} />
      </mesh>
      
      {/* Stomach body */}
      <mesh position={[-0.15, 0.25, 0.35]} rotation={[0.2, 0.3, 0.4]}>
        <capsuleGeometry args={[0.15, 0.25, 12, 16]} />
        <meshStandardMaterial color={stomachPink} roughness={0.45} transparent opacity={0.75} />
      </mesh>
      
      {/* ===== SPLEEN ===== */}
      <mesh position={[-0.6, 0.5, 0.1]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color={spleenPurple} roughness={0.5} transparent opacity={0.85} />
      </mesh>
      
      {/* ===== PANCREAS ===== */}
      <mesh position={[0, 0.3, 0.15]} rotation={[0, 0, 0.1]}>
        <capsuleGeometry args={[0.06, 0.5, 8, 16]} />
        <meshStandardMaterial color="#e8c090" roughness={0.5} transparent opacity={0.7} />
      </mesh>
      
      {/* ===== KIDNEYS ===== */}
      {/* Right kidney */}
      <mesh position={[0.5, 0.15, -0.15]} rotation={[0, -0.2, 0.15]}>
        <capsuleGeometry args={[0.1, 0.18, 12, 16]} />
        <meshStandardMaterial color={kidneyBrown} roughness={0.5} transparent opacity={0.85} />
      </mesh>
      
      {/* Left kidney */}
      <mesh position={[-0.5, 0.2, -0.15]} rotation={[0, 0.2, -0.15]}>
        <capsuleGeometry args={[0.1, 0.18, 12, 16]} />
        <meshStandardMaterial color={kidneyBrown} roughness={0.5} transparent opacity={0.85} />
      </mesh>
      
      {/* ===== SMALL INTESTINE ===== */}
      <mesh position={[0, 0, 0.25]}>
        <torusGeometry args={[0.2, 0.08, 12, 24]} />
        <meshStandardMaterial color={intestineRed} roughness={0.55} transparent opacity={0.7} />
      </mesh>
      
      <mesh position={[0.1, -0.1, 0.3]}>
        <torusGeometry args={[0.15, 0.06, 12, 20]} />
        <meshStandardMaterial color={intestineRed} roughness={0.55} transparent opacity={0.65} />
      </mesh>
      
      <mesh position={[-0.1, 0.05, 0.28]}>
        <torusGeometry args={[0.12, 0.055, 10, 18]} />
        <meshStandardMaterial color={intestineRed} roughness={0.55} transparent opacity={0.6} />
      </mesh>
      
      {/* ===== LARGE INTESTINE (COLON) ===== */}
      {/* Ascending colon */}
      <mesh position={[0.5, -0.1, 0.2]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#c4a088" roughness={0.5} transparent opacity={0.75} />
      </mesh>
      
      {/* Transverse colon */}
      <mesh position={[0, 0.25, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.8, 16]} />
        <meshStandardMaterial color="#c4a088" roughness={0.5} transparent opacity={0.7} />
      </mesh>
      
      {/* Descending colon */}
      <mesh position={[-0.5, -0.1, 0.2]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#c4a088" roughness={0.5} transparent opacity={0.75} />
      </mesh>
      
      {/* Sigmoid colon */}
      <mesh position={[-0.35, -0.45, 0.3]} rotation={[0.3, 0.5, 0.2]}>
        <torusGeometry args={[0.12, 0.05, 12, 16, Math.PI]} />
        <meshStandardMaterial color="#b89878" roughness={0.5} transparent opacity={0.75} />
      </mesh>
      
      {/* ===== APPENDIX ===== */}
      <mesh position={[0.45, -0.5, 0.35]} rotation={[0.5, 0, 0.3]}>
        <capsuleGeometry args={[0.025, 0.1, 6, 10]} />
        <meshStandardMaterial color="#d08888" roughness={0.5} transparent opacity={0.9} />
      </mesh>
      
      {/* ===== BLADDER ===== */}
      <mesh position={[0, -0.55, 0.35]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color="#d4b896" roughness={0.5} transparent opacity={0.75} />
      </mesh>
      
      {/* ===== AORTA ===== */}
      <mesh position={[0, 0.1, -0.1]}>
        <cylinderGeometry args={[0.04, 0.05, 1.2, 12]} />
        <meshStandardMaterial color="#cc4444" roughness={0.4} transparent opacity={0.8} />
      </mesh>
      
      {/* ===== NAVEL MARKER ===== */}
      <mesh position={[0, 0.05, 0.75]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#c4a090" roughness={0.6} />
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
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 4, 5]} intensity={0.75} />
      <directionalLight position={[-3, 2, 3]} intensity={0.35} />
      <pointLight position={[0, -2, 4]} intensity={0.3} color="#ffe4d4" />
      <pointLight position={[2, 2, -2]} intensity={0.2} color="#d4e4ff" />
      
      <AnatomicalAbdomen />
      
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
        ? `${selectedRegion.description}. Related organs: ${selectedRegion.organ}`
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
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-orange-500/10 to-transparent">
              <div className="flex items-center gap-2">
                <CircleDot className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Select Abdominal Pain Location</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 3D Canvas */}
            <div className="h-[400px] bg-gradient-to-b from-orange-950/20 to-slate-900">
              <Canvas camera={{ position: [0, 0, 2.8], fov: 42 }}>
                <AbdomenScene 
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
                  {hoveredInfo.organ && (
                    <p className="text-xs text-primary mt-1">Organs: {hoveredInfo.organ}</p>
                  )}
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
                  <p className="text-sm text-muted-foreground">{selectedRegion.description}</p>
                  {selectedRegion.organ && (
                    <p className="text-xs text-primary mt-1">Organs: {selectedRegion.organ}</p>
                  )}
                  <Button variant="hero" className="mt-3" onClick={handleConfirmSelection}>
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
              <p className="text-xs text-muted-foreground mb-2">10 Abdominal Regions:</p>
              <div className="flex flex-wrap gap-1.5">
                {abdomenRegions.map((region) => (
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

export default AbdomenModel3D;
