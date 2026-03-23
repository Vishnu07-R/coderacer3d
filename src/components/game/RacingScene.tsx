import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import RacingTrack from "./RacingTrack";
import PlayerCar from "./PlayerCar";
import OpponentCar from "./OpponentCar";

interface RacingSceneProps {
  speed: number;
  playerPosition: number;
  boosting: boolean;
}

// Dynamic camera that responds to speed & boost
const DynamicCamera = ({ speed, boosting, playerPosition }: { speed: number; boosting: boolean; playerPosition: number }) => {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame((_, delta) => {
    if (!camRef.current) return;
    // Camera follows player laterally
    const targetX = playerPosition * 1.2;
    camRef.current.position.x = THREE.MathUtils.lerp(camRef.current.position.x, targetX, delta * 4);
    
    // Pull back on boost for dramatic speed feel
    const targetZ = boosting ? 10 : 8;
    camRef.current.position.z = THREE.MathUtils.lerp(camRef.current.position.z, targetZ, delta * 3);
    
    // Slight FOV change with speed
    const targetFov = 60 + (speed - 60) * 0.15;
    camRef.current.fov = THREE.MathUtils.lerp(camRef.current.fov, targetFov, delta * 3);
    camRef.current.updateProjectionMatrix();
    
    // Subtle camera shake at high speed
    if (speed > 100) {
      const shake = (speed - 100) * 0.001;
      camRef.current.position.x += (Math.random() - 0.5) * shake;
      camRef.current.position.y += (Math.random() - 0.5) * shake * 0.5;
    }
  });

  return <PerspectiveCamera ref={camRef} makeDefault position={[0, 3.5, 8]} rotation={[-0.35, 0, 0]} fov={65} />;
};

// Floating code symbols in the sky
const FloatingCodeSymbols = () => {
  const symbols = ["{ }", "< />", "=>", "[ ]", "//", "&&", "++", "fn()", "0x", "!="];
  return (
    <>
      {symbols.map((_, i) => (
        <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.5} floatIntensity={2}>
          <mesh position={[
            (Math.random() - 0.5) * 30,
            5 + Math.random() * 10,
            -10 - Math.random() * 50
          ]}>
            <boxGeometry args={[0.3, 0.3, 0.05]} />
            <meshStandardMaterial 
              color={["#00f0ff", "#ff00ff", "#00ff88", "#ffcc00", "#ff3366"][i % 5]}
              emissive={["#00f0ff", "#ff00ff", "#00ff88", "#ffcc00", "#ff3366"][i % 5]}
              emissiveIntensity={2}
              transparent 
              opacity={0.4}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

// Speed lines effect
const SpeedLines = ({ speed }: { speed: number }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 40;
  const tempMatrix = new THREE.Matrix4();

  useFrame((state) => {
    if (!ref.current || speed < 50) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const z = ((i * 3 + t * speed * 0.3) % (count * 3)) - count * 1.5;
      const x = (Math.sin(i * 7.13) * 8) * (i % 2 === 0 ? 1 : -1);
      const y = 0.5 + Math.abs(Math.sin(i * 3.7)) * 3;
      tempMatrix.makeScale(0.01, 0.01, 0.5 + speed * 0.005);
      tempMatrix.setPosition(x, y, -z);
      ref.current.setMatrixAt(i, tempMatrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.3} />
    </instancedMesh>
  );
};

const RacingScene = ({ speed, playerPosition, boosting }: RacingSceneProps) => {
  return (
    <Canvas 
      gl={{ 
        antialias: false, // Disable for performance on mobile
        alpha: false, 
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }} 
      style={{ background: "#050510" }}
      dpr={[1, 1.2]} // Lower DPR for mobile
    >
      <DynamicCamera speed={speed} boosting={boosting} playerPosition={playerPosition} />

      {/* Atmospheric lighting */}
      <ambientLight intensity={0.15} color="#2222ff" />
      <directionalLight position={[5, 15, 5]} intensity={0.3} color="#6666ff" />
      
      {/* Dramatic fog */}
      <fog attach="fog" args={["#050510", 15, 60]} />

      {/* Starfield sky - Reduced count for mobile */}
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={boosting ? 2 : 0.5} />

      {/* Floating code symbols */}
      <FloatingCodeSymbols />

      {/* Speed lines */}
      <SpeedLines speed={speed} />

      {/* Track */}
      <RacingTrack speed={speed} boosting={boosting} />

      {/* Player */}
      <PlayerCar position={playerPosition} boosting={boosting} speed={speed} />

      {/* Opponents */}
      <OpponentCar lane={-1} speed={speed * 0.75} color="#330011" glowColor="#ff3366" offset={0} name="SYNTAX_ERROR" />
      <OpponentCar lane={1} speed={speed * 0.55} color="#220033" glowColor="#aa44ff" offset={3} name="NULL_PTR" />
    </Canvas>
  );
};

export default RacingScene;
