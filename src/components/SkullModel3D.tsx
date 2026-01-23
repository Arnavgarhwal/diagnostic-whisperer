import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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
    position: [0, 0.85, 0.85],
    color: "#ef4444",
    hoverColor: "#dc2626",
    description: "Frontal bone - front of the head above the eyes"
  },
  {
    id: "parietal-left",
    name: "Left Parietal",
    position: [-0.7, 0.95, 0],
    color: "#f97316",
    hoverColor: "#ea580c",
    description: "Left parietal bone - upper left side of skull"
  },
  {
    id: "parietal-right",
    name: "Right Parietal",
    position: [0.7, 0.95, 0],
    color: "#f97316",
    hoverColor: "#ea580c",
    description: "Right parietal bone - upper right side of skull"
  },
  {
    id: "temporal-left",
    name: "Left Temple",
    position: [-0.95, 0.15, 0.25],
    color: "#eab308",
    hoverColor: "#ca8a04",
    description: "Left temporal bone - side of head near ear"
  },
  {
    id: "temporal-right",
    name: "Right Temple",
    position: [0.95, 0.15, 0.25],
    color: "#eab308",
    hoverColor: "#ca8a04",
    description: "Right temporal bone - side of head near ear"
  },
  {
    id: "occipital",
    name: "Occipital (Back)",
    position: [0, 0.4, -0.9],
    color: "#22c55e",
    hoverColor: "#16a34a",
    description: "Occipital bone - back of the head"
  },
  {
    id: "vertex",
    name: "Vertex (Crown)",
    position: [0, 1.15, 0.1],
    color: "#06b6d4",
    hoverColor: "#0891b2",
    description: "Top of the head - crown area"
  },
  {
    id: "supraorbital",
    name: "Above Eyes",
    position: [0, 0.25, 0.95],
    color: "#8b5cf6",
    hoverColor: "#7c3aed",
    description: "Supraorbital region - above the eye sockets"
  },
  {
    id: "mastoid-left",
    name: "Left Behind Ear",
    position: [-0.8, -0.2, -0.4],
    color: "#ec4899",
    hoverColor: "#db2777",
    description: "Left mastoid area - behind the ear"
  },
  {
    id: "mastoid-right",
    name: "Right Behind Ear",
    position: [0.8, -0.2, -0.4],
    color: "#ec4899",
    hoverColor: "#db2777",
    description: "Right mastoid area - behind the ear"
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
      <sphereGeometry args={[0.12, 24, 24]} />
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

const AnatomicalSkull = () => {
  const skullRef = useRef<THREE.Group>(null);
  
  // Bone colors matching the reference
  const boneColor = "#d4cdc4";
  const boneDark = "#b8b0a5";
  const boneLight = "#e8e2db";
  const cavityColor = "#2a2520";
  
  useFrame((state) => {
    if (skullRef.current) {
      skullRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
    }
  });

  // Create custom bone material
  const boneMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: boneColor,
    roughness: 0.75,
    metalness: 0.02,
  }), []);

  return (
    <group ref={skullRef} position={[0, -0.2, 0]}>
      {/* ===== CRANIUM ===== */}
      
      {/* Main cranial vault - large dome */}
      <mesh position={[0, 0.65, -0.05]}>
        <sphereGeometry args={[0.92, 48, 48]} />
        <meshStandardMaterial color={boneColor} roughness={0.7} />
      </mesh>
      
      {/* Frontal bone prominence */}
      <mesh position={[0, 0.55, 0.55]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial color={boneLight} roughness={0.65} />
      </mesh>
      
      {/* Parietal bulge left */}
      <mesh position={[-0.55, 0.8, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={boneColor} roughness={0.7} />
      </mesh>
      
      {/* Parietal bulge right */}
      <mesh position={[0.55, 0.8, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={boneColor} roughness={0.7} />
      </mesh>
      
      {/* Occipital protrusion */}
      <mesh position={[0, 0.35, -0.65]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={boneDark} roughness={0.75} />
      </mesh>
      
      {/* ===== TEMPORAL REGION ===== */}
      
      {/* Left temporal depression */}
      <mesh position={[-0.78, 0.35, 0.15]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      
      {/* Right temporal depression */}
      <mesh position={[0.78, 0.35, 0.15]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      
      {/* Left zygomatic arch */}
      <mesh position={[-0.65, -0.05, 0.45]} rotation={[0, 0.4, 0.2]}>
        <capsuleGeometry args={[0.06, 0.35, 8, 16]} />
        <meshStandardMaterial color={boneColor} roughness={0.6} />
      </mesh>
      
      {/* Right zygomatic arch */}
      <mesh position={[0.65, -0.05, 0.45]} rotation={[0, -0.4, -0.2]}>
        <capsuleGeometry args={[0.06, 0.35, 8, 16]} />
        <meshStandardMaterial color={boneColor} roughness={0.6} />
      </mesh>
      
      {/* ===== FACE ===== */}
      
      {/* Brow ridge - supraorbital torus */}
      <mesh position={[0, 0.2, 0.78]} rotation={[0.1, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.55, 8, 16]} />
        <meshStandardMaterial color={boneLight} roughness={0.6} />
      </mesh>
      
      {/* Left brow */}
      <mesh position={[-0.28, 0.22, 0.8]} rotation={[0, 0, 0.35]}>
        <capsuleGeometry args={[0.055, 0.18, 8, 16]} />
        <meshStandardMaterial color={boneLight} roughness={0.6} />
      </mesh>
      
      {/* Right brow */}
      <mesh position={[0.28, 0.22, 0.8]} rotation={[0, 0, -0.35]}>
        <capsuleGeometry args={[0.055, 0.18, 8, 16]} />
        <meshStandardMaterial color={boneLight} roughness={0.6} />
      </mesh>
      
      {/* ===== EYE SOCKETS ===== */}
      
      {/* Left orbit rim */}
      <mesh position={[-0.28, 0.05, 0.7]}>
        <torusGeometry args={[0.17, 0.04, 16, 24]} />
        <meshStandardMaterial color={boneDark} roughness={0.65} />
      </mesh>
      
      {/* Left orbit cavity */}
      <mesh position={[-0.28, 0.05, 0.68]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color={cavityColor} />
      </mesh>
      
      {/* Right orbit rim */}
      <mesh position={[0.28, 0.05, 0.7]}>
        <torusGeometry args={[0.17, 0.04, 16, 24]} />
        <meshStandardMaterial color={boneDark} roughness={0.65} />
      </mesh>
      
      {/* Right orbit cavity */}
      <mesh position={[0.28, 0.05, 0.68]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color={cavityColor} />
      </mesh>
      
      {/* ===== NOSE ===== */}
      
      {/* Nasal bone */}
      <mesh position={[0, -0.05, 0.82]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.1, 0.2, 0.08]} />
        <meshStandardMaterial color={boneLight} roughness={0.6} />
      </mesh>
      
      {/* Nasal aperture */}
      <mesh position={[0, -0.2, 0.75]}>
        <coneGeometry args={[0.1, 0.18, 3]} />
        <meshStandardMaterial color={cavityColor} />
      </mesh>
      
      {/* Nasal septum hint */}
      <mesh position={[0, -0.15, 0.78]}>
        <boxGeometry args={[0.02, 0.1, 0.05]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      
      {/* ===== CHEEKBONES ===== */}
      
      {/* Left zygomatic */}
      <mesh position={[-0.48, -0.05, 0.58]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color={boneColor} roughness={0.6} />
      </mesh>
      
      {/* Right zygomatic */}
      <mesh position={[0.48, -0.05, 0.58]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color={boneColor} roughness={0.6} />
      </mesh>
      
      {/* ===== MAXILLA (Upper Jaw) ===== */}
      
      <mesh position={[0, -0.35, 0.52]}>
        <boxGeometry args={[0.48, 0.22, 0.38]} />
        <meshStandardMaterial color={boneLight} roughness={0.65} />
      </mesh>
      
      {/* Upper teeth row */}
      <mesh position={[0, -0.42, 0.68]}>
        <boxGeometry args={[0.38, 0.08, 0.06]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.3} />
      </mesh>
      
      {/* ===== MANDIBLE (Lower Jaw) ===== */}
      
      {/* Main mandible body */}
      <mesh position={[0, -0.58, 0.42]}>
        <boxGeometry args={[0.42, 0.18, 0.32]} />
        <meshStandardMaterial color={boneColor} roughness={0.65} />
      </mesh>
      
      {/* Chin */}
      <mesh position={[0, -0.62, 0.58]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={boneLight} roughness={0.6} />
      </mesh>
      
      {/* Left mandible ramus */}
      <mesh position={[-0.32, -0.38, 0.2]} rotation={[0, 0.15, 0.2]}>
        <boxGeometry args={[0.12, 0.35, 0.15]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      
      {/* Right mandible ramus */}
      <mesh position={[0.32, -0.38, 0.2]} rotation={[0, -0.15, -0.2]}>
        <boxGeometry args={[0.12, 0.35, 0.15]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      
      {/* Left mandible angle */}
      <mesh position={[-0.38, -0.48, 0.12]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      
      {/* Right mandible angle */}
      <mesh position={[0.38, -0.48, 0.12]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      
      {/* Lower teeth row */}
      <mesh position={[0, -0.5, 0.58]}>
        <boxGeometry args={[0.32, 0.06, 0.05]} />
        <meshStandardMaterial color="#f0f0eb" roughness={0.35} />
      </mesh>
      
      {/* ===== MASTOID PROCESSES ===== */}
      
      <mesh position={[-0.68, -0.25, -0.3]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      
      <mesh position={[0.68, -0.25, -0.3]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshStandardMaterial color={boneDark} roughness={0.7} />
      </mesh>
      
      {/* ===== SUTURE LINES ===== */}
      
      {/* Sagittal suture (top) */}
      <mesh position={[0, 1.05, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.5, 8]} />
        <meshStandardMaterial color={boneDark} roughness={0.8} />
      </mesh>
      
      {/* Coronal suture left */}
      <mesh position={[-0.4, 0.85, 0.35]} rotation={[0.4, 0.3, 0.5]}>
        <cylinderGeometry args={[0.006, 0.006, 0.4, 8]} />
        <meshStandardMaterial color={boneDark} roughness={0.8} />
      </mesh>
      
      {/* Coronal suture right */}
      <mesh position={[0.4, 0.85, 0.35]} rotation={[0.4, -0.3, -0.5]}>
        <cylinderGeometry args={[0.006, 0.006, 0.4, 8]} />
        <meshStandardMaterial color={boneDark} roughness={0.8} />
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
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 5]} intensity={0.9} castShadow />
      <directionalLight position={[-3, 3, 3]} intensity={0.4} />
      <pointLight position={[0, -2, 4]} intensity={0.35} color="#fff5e6" />
      <pointLight position={[0, 3, -3]} intensity={0.25} color="#e6f0ff" />
      
      <AnatomicalSkull />
      
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
        enableZoom={true}
        minDistance={2.5}
        maxDistance={6}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.3}
        autoRotate={false}
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
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Select Pain Location on Skull</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 3D Canvas */}
            <div className="h-[400px] bg-gradient-to-b from-slate-800 to-slate-900">
              <Canvas camera={{ position: [0, 0, 3.8], fov: 42 }}>
                <SkullScene 
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
                {headRegions.map((region) => (
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

export default SkullModel3D;
