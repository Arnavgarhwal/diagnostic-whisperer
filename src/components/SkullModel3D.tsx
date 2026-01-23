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
    position: [0, 0.75, 0.72],
    color: "#ef4444",
    hoverColor: "#dc2626",
    description: "Frontal bone - front of the head above the eyes"
  },
  {
    id: "parietal-left",
    name: "Left Parietal",
    position: [-0.55, 0.85, 0.1],
    color: "#f97316",
    hoverColor: "#ea580c",
    description: "Left parietal bone - upper left side of skull"
  },
  {
    id: "parietal-right",
    name: "Right Parietal",
    position: [0.55, 0.85, 0.1],
    color: "#f97316",
    hoverColor: "#ea580c",
    description: "Right parietal bone - upper right side of skull"
  },
  {
    id: "temporal-left",
    name: "Left Temple",
    position: [-0.72, 0.2, 0.35],
    color: "#eab308",
    hoverColor: "#ca8a04",
    description: "Left temporal bone - side of head near ear"
  },
  {
    id: "temporal-right",
    name: "Right Temple",
    position: [0.72, 0.2, 0.35],
    color: "#eab308",
    hoverColor: "#ca8a04",
    description: "Right temporal bone - side of head near ear"
  },
  {
    id: "occipital",
    name: "Occipital (Back)",
    position: [0, 0.45, -0.72],
    color: "#22c55e",
    hoverColor: "#16a34a",
    description: "Occipital bone - back of the head"
  },
  {
    id: "vertex",
    name: "Vertex (Crown)",
    position: [0, 1.02, 0.15],
    color: "#06b6d4",
    hoverColor: "#0891b2",
    description: "Top of the head - crown area"
  },
  {
    id: "supraorbital",
    name: "Above Eyes",
    position: [0, 0.28, 0.78],
    color: "#8b5cf6",
    hoverColor: "#7c3aed",
    description: "Supraorbital region - above the eye sockets"
  },
  {
    id: "mastoid-left",
    name: "Left Behind Ear",
    position: [-0.62, -0.1, -0.35],
    color: "#ec4899",
    hoverColor: "#db2777",
    description: "Left mastoid area - behind the ear"
  },
  {
    id: "mastoid-right",
    name: "Right Behind Ear",
    position: [0.62, -0.1, -0.35],
    color: "#ec4899",
    hoverColor: "#db2777",
    description: "Right mastoid area - behind the ear"
  }
];

interface SkullRegionProps {
  region: HeadRegion;
  onSelect: (region: HeadRegion) => void;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
}

const SkullRegion = ({ region, onSelect, isHovered, isSelected, onHover }: SkullRegionProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = isHovered || isSelected ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group position={region.position}>
      {/* Outer ring for selected state */}
      {isSelected && (
        <mesh ref={ringRef}>
          <torusGeometry args={[0.14, 0.015, 8, 24]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
      )}
      
      {/* Main marker */}
      <mesh
        ref={meshRef}
        onClick={() => onSelect(region)}
        onPointerOver={() => onHover(region.id)}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.08, 20, 20]} />
        <meshStandardMaterial 
          color={isHovered || isSelected ? region.hoverColor : region.color} 
          emissive={isHovered || isSelected ? region.hoverColor : region.color}
          emissiveIntensity={isHovered || isSelected ? 0.7 : 0.35}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial 
          color={region.color}
          transparent
          opacity={isHovered || isSelected ? 0.3 : 0.15}
        />
      </mesh>
    </group>
  );
};

const RealisticSkull = () => {
  const skullRef = useRef<THREE.Group>(null);
  
  // Realistic bone colors matching reference image
  const boneBase = "#c9c2b8";
  const boneShadow = "#a39d94";
  const boneHighlight = "#ddd8d0";
  const cavityDark = "#1a1815";
  const teethColor = "#e8e4dc";
  
  useFrame((state) => {
    if (skullRef.current) {
      skullRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
  });

  return (
    <group ref={skullRef} position={[0, -0.15, 0]}>
      {/* ===== CRANIUM - Main Vault ===== */}
      
      {/* Primary cranial dome */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.85, 64, 64]} />
        <meshStandardMaterial color={boneBase} roughness={0.72} metalness={0.02} />
      </mesh>
      
      {/* Frontal bone bulge */}
      <mesh position={[0, 0.55, 0.42]}>
        <sphereGeometry args={[0.62, 48, 48]} />
        <meshStandardMaterial color={boneHighlight} roughness={0.68} metalness={0.01} />
      </mesh>
      
      {/* Left parietal eminence */}
      <mesh position={[-0.48, 0.72, 0.05]}>
        <sphereGeometry args={[0.48, 40, 40]} />
        <meshStandardMaterial color={boneBase} roughness={0.7} />
      </mesh>
      
      {/* Right parietal eminence */}
      <mesh position={[0.48, 0.72, 0.05]}>
        <sphereGeometry args={[0.48, 40, 40]} />
        <meshStandardMaterial color={boneBase} roughness={0.7} />
      </mesh>
      
      {/* Occipital bone */}
      <mesh position={[0, 0.4, -0.52]}>
        <sphereGeometry args={[0.58, 40, 40]} />
        <meshStandardMaterial color={boneShadow} roughness={0.75} />
      </mesh>
      
      {/* ===== TEMPORAL REGIONS ===== */}
      
      {/* Left temporal fossa */}
      <mesh position={[-0.68, 0.38, 0.18]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={boneShadow} roughness={0.72} />
      </mesh>
      
      {/* Right temporal fossa */}
      <mesh position={[0.68, 0.38, 0.18]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={boneShadow} roughness={0.72} />
      </mesh>
      
      {/* Left zygomatic arch */}
      <mesh position={[-0.58, 0.02, 0.42]} rotation={[0, 0.35, 0.15]}>
        <capsuleGeometry args={[0.05, 0.32, 12, 20]} />
        <meshStandardMaterial color={boneBase} roughness={0.65} />
      </mesh>
      
      {/* Right zygomatic arch */}
      <mesh position={[0.58, 0.02, 0.42]} rotation={[0, -0.35, -0.15]}>
        <capsuleGeometry args={[0.05, 0.32, 12, 20]} />
        <meshStandardMaterial color={boneBase} roughness={0.65} />
      </mesh>
      
      {/* ===== BROW RIDGE (Supraorbital) ===== */}
      
      {/* Central brow ridge */}
      <mesh position={[0, 0.22, 0.68]} rotation={[0.15, 0, 0]}>
        <capsuleGeometry args={[0.06, 0.48, 12, 20]} />
        <meshStandardMaterial color={boneHighlight} roughness={0.62} />
      </mesh>
      
      {/* Left brow prominence */}
      <mesh position={[-0.24, 0.25, 0.7]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.045, 0.15, 10, 16]} />
        <meshStandardMaterial color={boneHighlight} roughness={0.6} />
      </mesh>
      
      {/* Right brow prominence */}
      <mesh position={[0.24, 0.25, 0.7]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.045, 0.15, 10, 16]} />
        <meshStandardMaterial color={boneHighlight} roughness={0.6} />
      </mesh>
      
      {/* Glabella (between brows) */}
      <mesh position={[0, 0.18, 0.75]}>
        <sphereGeometry args={[0.08, 20, 20]} />
        <meshStandardMaterial color={boneBase} roughness={0.65} />
      </mesh>
      
      {/* ===== EYE SOCKETS (Orbits) ===== */}
      
      {/* Left orbit - outer rim */}
      <mesh position={[-0.26, 0.08, 0.62]}>
        <torusGeometry args={[0.15, 0.035, 20, 32]} />
        <meshStandardMaterial color={boneShadow} roughness={0.68} />
      </mesh>
      
      {/* Left orbit - cavity */}
      <mesh position={[-0.26, 0.08, 0.58]}>
        <sphereGeometry args={[0.13, 28, 28]} />
        <meshStandardMaterial color={cavityDark} roughness={0.9} />
      </mesh>
      
      {/* Left orbit - inner depth */}
      <mesh position={[-0.26, 0.08, 0.45]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color="#0d0c0a" />
      </mesh>
      
      {/* Right orbit - outer rim */}
      <mesh position={[0.26, 0.08, 0.62]}>
        <torusGeometry args={[0.15, 0.035, 20, 32]} />
        <meshStandardMaterial color={boneShadow} roughness={0.68} />
      </mesh>
      
      {/* Right orbit - cavity */}
      <mesh position={[0.26, 0.08, 0.58]}>
        <sphereGeometry args={[0.13, 28, 28]} />
        <meshStandardMaterial color={cavityDark} roughness={0.9} />
      </mesh>
      
      {/* Right orbit - inner depth */}
      <mesh position={[0.26, 0.08, 0.45]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color="#0d0c0a" />
      </mesh>
      
      {/* ===== NASAL REGION ===== */}
      
      {/* Nasal bones */}
      <mesh position={[0, -0.02, 0.72]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.09, 0.18, 0.06]} />
        <meshStandardMaterial color={boneHighlight} roughness={0.6} />
      </mesh>
      
      {/* Left nasal bone */}
      <mesh position={[-0.035, -0.04, 0.73]} rotation={[0.3, 0.1, 0]}>
        <boxGeometry args={[0.04, 0.14, 0.04]} />
        <meshStandardMaterial color={boneBase} roughness={0.65} />
      </mesh>
      
      {/* Right nasal bone */}
      <mesh position={[0.035, -0.04, 0.73]} rotation={[0.3, -0.1, 0]}>
        <boxGeometry args={[0.04, 0.14, 0.04]} />
        <meshStandardMaterial color={boneBase} roughness={0.65} />
      </mesh>
      
      {/* Nasal aperture (piriform) */}
      <mesh position={[0, -0.15, 0.68]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.15, 3, 1]} />
        <meshStandardMaterial color={cavityDark} roughness={0.9} />
      </mesh>
      
      {/* Nasal spine */}
      <mesh position={[0, -0.22, 0.72]}>
        <coneGeometry args={[0.025, 0.06, 6]} />
        <meshStandardMaterial color={boneBase} roughness={0.65} />
      </mesh>
      
      {/* ===== CHEEKBONES (Zygomatic) ===== */}
      
      {/* Left zygomatic bone */}
      <mesh position={[-0.42, -0.02, 0.52]}>
        <sphereGeometry args={[0.16, 28, 28]} />
        <meshStandardMaterial color={boneBase} roughness={0.62} />
      </mesh>
      
      {/* Left zygomatic prominence */}
      <mesh position={[-0.48, 0.02, 0.48]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color={boneHighlight} roughness={0.58} />
      </mesh>
      
      {/* Right zygomatic bone */}
      <mesh position={[0.42, -0.02, 0.52]}>
        <sphereGeometry args={[0.16, 28, 28]} />
        <meshStandardMaterial color={boneBase} roughness={0.62} />
      </mesh>
      
      {/* Right zygomatic prominence */}
      <mesh position={[0.48, 0.02, 0.48]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color={boneHighlight} roughness={0.58} />
      </mesh>
      
      {/* ===== MAXILLA (Upper Jaw) ===== */}
      
      {/* Main maxilla body */}
      <mesh position={[0, -0.28, 0.48]}>
        <boxGeometry args={[0.42, 0.18, 0.32]} />
        <meshStandardMaterial color={boneBase} roughness={0.68} />
      </mesh>
      
      {/* Left maxilla side */}
      <mesh position={[-0.18, -0.22, 0.52]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color={boneBase} roughness={0.65} />
      </mesh>
      
      {/* Right maxilla side */}
      <mesh position={[0.18, -0.22, 0.52]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color={boneBase} roughness={0.65} />
      </mesh>
      
      {/* Upper teeth (alveolar process) */}
      <mesh position={[0, -0.35, 0.58]}>
        <boxGeometry args={[0.34, 0.07, 0.08]} />
        <meshStandardMaterial color={teethColor} roughness={0.35} metalness={0.05} />
      </mesh>
      
      {/* Individual upper teeth hints */}
      {[-0.12, -0.06, 0, 0.06, 0.12].map((x, i) => (
        <mesh key={`upper-tooth-${i}`} position={[x, -0.36, 0.62]}>
          <boxGeometry args={[0.045, 0.08, 0.03]} />
          <meshStandardMaterial color={teethColor} roughness={0.3} />
        </mesh>
      ))}
      
      {/* ===== MANDIBLE (Lower Jaw) ===== */}
      
      {/* Mandible body */}
      <mesh position={[0, -0.48, 0.42]}>
        <boxGeometry args={[0.38, 0.14, 0.28]} />
        <meshStandardMaterial color={boneBase} roughness={0.68} />
      </mesh>
      
      {/* Chin (mental protuberance) */}
      <mesh position={[0, -0.52, 0.55]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color={boneHighlight} roughness={0.6} />
      </mesh>
      
      {/* Mental tubercle left */}
      <mesh position={[-0.06, -0.52, 0.56]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={boneBase} roughness={0.62} />
      </mesh>
      
      {/* Mental tubercle right */}
      <mesh position={[0.06, -0.52, 0.56]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={boneBase} roughness={0.62} />
      </mesh>
      
      {/* Left mandible ramus */}
      <mesh position={[-0.28, -0.32, 0.22]} rotation={[0, 0.12, 0.18]}>
        <boxGeometry args={[0.1, 0.32, 0.14]} />
        <meshStandardMaterial color={boneShadow} roughness={0.72} />
      </mesh>
      
      {/* Right mandible ramus */}
      <mesh position={[0.28, -0.32, 0.22]} rotation={[0, -0.12, -0.18]}>
        <boxGeometry args={[0.1, 0.32, 0.14]} />
        <meshStandardMaterial color={boneShadow} roughness={0.72} />
      </mesh>
      
      {/* Left mandible angle */}
      <mesh position={[-0.32, -0.42, 0.15]}>
        <sphereGeometry args={[0.08, 18, 18]} />
        <meshStandardMaterial color={boneShadow} roughness={0.7} />
      </mesh>
      
      {/* Right mandible angle */}
      <mesh position={[0.32, -0.42, 0.15]}>
        <sphereGeometry args={[0.08, 18, 18]} />
        <meshStandardMaterial color={boneShadow} roughness={0.7} />
      </mesh>
      
      {/* Left coronoid process */}
      <mesh position={[-0.24, -0.12, 0.25]} rotation={[0, 0.1, 0.3]}>
        <coneGeometry args={[0.04, 0.12, 8]} />
        <meshStandardMaterial color={boneShadow} roughness={0.7} />
      </mesh>
      
      {/* Right coronoid process */}
      <mesh position={[0.24, -0.12, 0.25]} rotation={[0, -0.1, -0.3]}>
        <coneGeometry args={[0.04, 0.12, 8]} />
        <meshStandardMaterial color={boneShadow} roughness={0.7} />
      </mesh>
      
      {/* Lower teeth */}
      <mesh position={[0, -0.42, 0.52]}>
        <boxGeometry args={[0.3, 0.06, 0.06]} />
        <meshStandardMaterial color={teethColor} roughness={0.35} metalness={0.05} />
      </mesh>
      
      {/* Individual lower teeth hints */}
      {[-0.1, -0.05, 0, 0.05, 0.1].map((x, i) => (
        <mesh key={`lower-tooth-${i}`} position={[x, -0.42, 0.56]}>
          <boxGeometry args={[0.04, 0.065, 0.025]} />
          <meshStandardMaterial color={teethColor} roughness={0.3} />
        </mesh>
      ))}
      
      {/* ===== MASTOID PROCESSES ===== */}
      
      {/* Left mastoid */}
      <mesh position={[-0.58, -0.18, -0.28]} rotation={[0.2, 0.15, 0]}>
        <coneGeometry args={[0.08, 0.18, 10]} />
        <meshStandardMaterial color={boneShadow} roughness={0.72} />
      </mesh>
      
      {/* Right mastoid */}
      <mesh position={[0.58, -0.18, -0.28]} rotation={[0.2, -0.15, 0]}>
        <coneGeometry args={[0.08, 0.18, 10]} />
        <meshStandardMaterial color={boneShadow} roughness={0.72} />
      </mesh>
      
      {/* ===== SUTURE LINES ===== */}
      
      {/* Sagittal suture */}
      <mesh position={[0, 0.98, 0.08]} rotation={[0.1, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.55, 6]} />
        <meshStandardMaterial color={boneShadow} roughness={0.85} />
      </mesh>
      
      {/* Left coronal suture */}
      <mesh position={[-0.35, 0.78, 0.38]} rotation={[0.5, 0.4, 0.6]}>
        <cylinderGeometry args={[0.005, 0.005, 0.45, 6]} />
        <meshStandardMaterial color={boneShadow} roughness={0.85} />
      </mesh>
      
      {/* Right coronal suture */}
      <mesh position={[0.35, 0.78, 0.38]} rotation={[0.5, -0.4, -0.6]}>
        <cylinderGeometry args={[0.005, 0.005, 0.45, 6]} />
        <meshStandardMaterial color={boneShadow} roughness={0.85} />
      </mesh>
      
      {/* Left squamosal suture */}
      <mesh position={[-0.62, 0.32, 0.12]} rotation={[0, 0.2, 0.8]}>
        <cylinderGeometry args={[0.004, 0.004, 0.35, 6]} />
        <meshStandardMaterial color={boneShadow} roughness={0.85} />
      </mesh>
      
      {/* Right squamosal suture */}
      <mesh position={[0.62, 0.32, 0.12]} rotation={[0, -0.2, -0.8]}>
        <cylinderGeometry args={[0.004, 0.004, 0.35, 6]} />
        <meshStandardMaterial color={boneShadow} roughness={0.85} />
      </mesh>
    </group>
  );
};

interface SkullSceneProps {
  onSelectRegion: (region: HeadRegion) => void;
  hoveredRegion: string | null;
  selectedRegion: HeadRegion | null;
  onHoverRegion: (id: string | null) => void;
}

const SkullScene = ({ onSelectRegion, hoveredRegion, selectedRegion, onHoverRegion }: SkullSceneProps) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 5]} intensity={0.85} castShadow />
      <directionalLight position={[-4, 3, 3]} intensity={0.35} />
      <pointLight position={[0, -2, 5]} intensity={0.3} color="#fff8f0" />
      <pointLight position={[0, 4, -4]} intensity={0.2} color="#f0f5ff" />
      
      <RealisticSkull />
      
      {headRegions.map((region) => (
        <SkullRegion
          key={region.id}
          region={region}
          onSelect={onSelectRegion}
          isHovered={hoveredRegion === region.id}
          isSelected={selectedRegion?.id === region.id}
          onHover={onHoverRegion}
        />
      ))}
      
      <OrbitControls 
        enableZoom={true}
        minDistance={2.2}
        maxDistance={5.5}
        enablePan={false}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 1.2}
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
            <div className="h-[420px] bg-gradient-to-b from-[#4a4a4a] to-[#3d3d3d]">
              <Canvas camera={{ position: [0, 0.2, 3.5], fov: 40 }}>
                <SkullScene 
                  onSelectRegion={handleSelectRegion}
                  hoveredRegion={hoveredRegion}
                  selectedRegion={selectedRegion}
                  onHoverRegion={setHoveredRegion}
                />
              </Canvas>
            </div>

            {/* Region Info */}
            <div className="p-4 border-t border-border bg-muted/30 min-h-[90px]">
              {hoveredInfo && !selectedRegion ? (
                <div className="text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: hoveredInfo.color }}
                    />
                    <span className="font-medium">{hoveredInfo.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{hoveredInfo.description}</p>
                </div>
              ) : selectedRegion ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full animate-pulse" 
                      style={{ backgroundColor: selectedRegion.color }}
                    />
                    <span className="font-semibold text-primary">{selectedRegion.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{selectedRegion.description}</p>
                  <Button onClick={handleConfirmSelection} className="gap-2">
                    Confirm Selection
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Rotate the skull and click on a colored marker to select a pain region
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkullModel3D;
