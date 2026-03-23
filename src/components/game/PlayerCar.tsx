import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlayerCarProps {
  position: number;
  boosting: boolean;
  speed: number;
}

const PlayerCar = ({ position, boosting, speed }: PlayerCarProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const exhaustLeftRef = useRef<THREE.Mesh>(null);
  const exhaustRightRef = useRef<THREE.Mesh>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const neonPulseRef = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    neonPulseRef.current = Math.sin(t * 4) * 0.3 + 0.7;

    if (groupRef.current) {
      // Smooth lateral with tilt
      const targetX = position * 3;
      const currentX = groupRef.current.position.x;
      groupRef.current.position.x = THREE.MathUtils.lerp(currentX, targetX, delta * 10);
      
      // Tilt into turns
      const dx = targetX - currentX;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -dx * 0.06, delta * 5);
      
      // Speed bobbing
      groupRef.current.position.y = 0.25 + Math.sin(t * (2 + speed * 0.02)) * 0.015;
      
      // Subtle front pitch based on speed
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, boosting ? -0.03 : 0, delta * 3);
    }

    // Spinning wheels
    wheelRefs.current.forEach(wheel => {
      if (wheel) wheel.rotation.x += delta * speed * 0.3;
    });

    // Exhaust flame animation
    [exhaustLeftRef.current, exhaustRightRef.current].forEach(flame => {
      if (flame) {
        const flameScale = boosting ? 1.2 + Math.random() * 0.8 : 0.3 + Math.random() * 0.2;
        flame.scale.y = flameScale;
        flame.scale.x = 0.8 + Math.random() * 0.4;
      }
    });
  });

  const addWheelRef = (ref: THREE.Mesh | null, index: number) => {
    if (ref) wheelRefs.current[index] = ref;
  };

  const wheelPositions: [number, number, number][] = [
    [-0.7, -0.05, 0.85],
    [0.7, -0.05, 0.85],
    [-0.7, -0.05, -0.85],
    [0.7, -0.05, -0.85],
  ];

  return (
    <group ref={groupRef} position={[0, 0.25, 3]}>
      {/* Main body - sleek low profile */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.4, 0.3, 3]} />
        <meshStandardMaterial color="#0a0a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Body top accent */}
      <mesh position={[0, 0.32, -0.1]}>
        <boxGeometry args={[1.2, 0.05, 2.6]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Cockpit / windshield */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.9, 0.3, 1.4]} />
        <meshStandardMaterial color="#001133" metalness={1} roughness={0} transparent opacity={0.5} />
      </mesh>

      {/* Front nose - aggressive */}
      <mesh position={[0, 0.1, 1.6]}>
        <boxGeometry args={[1.6, 0.15, 0.5]} />
        <meshStandardMaterial color="#0a0a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Front splitter - neon */}
      <mesh position={[0, 0.02, 1.8]}>
        <boxGeometry args={[1.7, 0.06, 0.15]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={3} />
      </mesh>

      {/* Side skirts */}
      {[-0.75, 0.75].map((x, i) => (
        <mesh key={`skirt-${i}`} position={[x, 0.04, 0]}>
          <boxGeometry args={[0.08, 0.12, 2.8]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </mesh>
      ))}

      {/* Rear wing */}
      <mesh position={[0, 0.65, -1.4]}>
        <boxGeometry args={[1.6, 0.04, 0.35]} />
        <meshStandardMaterial color="#0a0a2a" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Wing supports */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={`wing-support-${i}`} position={[x, 0.5, -1.4]}>
          <boxGeometry args={[0.05, 0.3, 0.05]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
        </mesh>
      ))}

      {/* Rear diffuser */}
      <mesh position={[0, 0.06, -1.55]}>
        <boxGeometry args={[1.3, 0.15, 0.2]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Wheels with rims */}
      {wheelPositions.map((pos, i) => (
        <group key={`wheel-group-${i}`} position={pos}>
          <mesh ref={(ref) => addWheelRef(ref, i)} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.18, 12]} />
            <meshStandardMaterial color="#222" roughness={0.8} />
          </mesh>
          {/* Rim glow */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.19, 6]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={`headlight-${i}`} position={[x, 0.15, 1.5]}>
          <boxGeometry args={[0.25, 0.08, 0.05]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Tail lights */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={`tail-${i}`} position={[x, 0.15, -1.55]}>
          <boxGeometry args={[0.3, 0.1, 0.05]} />
          <meshBasicMaterial color="#ff0033" />
        </mesh>
      ))}

      {/* Exhaust flames */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh
          key={`exhaust-${i}`}
          ref={i === 0 ? exhaustLeftRef : exhaustRightRef}
          position={[x, 0.08, -1.7]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[0.08, 0.5, 6]} />
          <meshLambertMaterial
            color={boosting ? "#ff6600" : "#ff3300"}
            emissive={boosting ? "#ff6600" : "#ff3300"}
            transparent
            opacity={boosting ? 0.8 : 0.4}
          />
        </mesh>
      ))}

      {/* Simplified neon underglow - only one light for mobile */}
      <pointLight 
        position={[0, -0.1, 0.5]} 
        color={boosting ? "#ff00ff" : "#00f0ff"} 
        intensity={boosting ? 4 : 2} 
        distance={5} 
      />

      {/* Boost trail particles effect - reduced lights */}
      {boosting && (
        <pointLight position={[0, 0.1, -2.5]} color="#ff6600" intensity={6} distance={6} />
      )}
    </group>
  );
};

export default PlayerCar;
