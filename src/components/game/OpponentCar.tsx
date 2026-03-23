import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OpponentCarProps {
  lane: number;
  speed: number;
  color: string;
  glowColor: string;
  offset: number;
  name: string;
}

const OpponentCar = ({ lane, speed, color, glowColor, offset }: OpponentCarProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // More dynamic movement pattern
    const z = ((t * speed * 0.25 + offset * 25) % 100) - 50;
    groupRef.current.position.z = -z;
    
    // Lane weaving AI behavior
    const targetX = lane * 2.5 + Math.sin(t * 0.3 + offset * 2) * 0.8;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 3);
    
    // Slight rotation into turns
    const dx = targetX - groupRef.current.position.x;
    groupRef.current.rotation.z = -dx * 0.05;
    groupRef.current.position.y = 0.25;

    // Spin wheels
    wheelRefs.current.forEach(w => { if (w) w.rotation.x += delta * speed * 0.2; });
  });

  const addWheel = (ref: THREE.Mesh | null, i: number) => { if (ref) wheelRefs.current[i] = ref; };

  return (
    <group ref={groupRef} position={[lane * 2.5, 0.25, -15]}>
      {/* Body */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.2, 0.28, 2.6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Accent stripe */}
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[1.0, 0.03, 2.4]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.8, 0.25, 1.2]} />
        <meshLambertMaterial color="#111" transparent opacity={0.5} />
      </mesh>
      {/* Front */}
      <mesh position={[0, 0.02, 1.5]}>
        <boxGeometry args={[1.4, 0.06, 0.12]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      {/* Rear wing */}
      <mesh position={[0, 0.55, -1.3]}>
        <boxGeometry args={[1.4, 0.04, 0.3]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Side skirts */}
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={`s-${i}`} position={[x, 0.03, 0]}>
          <boxGeometry args={[0.06, 0.1, 2.4]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>
      ))}
      {/* Wheels */}
      {[[-0.65, -0.05, 0.8], [0.65, -0.05, 0.8], [-0.65, -0.05, -0.8], [0.65, -0.05, -0.8]].map((pos, i) => (
        <mesh key={i} ref={r => addWheel(r, i)} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 6]} />
          <meshLambertMaterial color="#222" />
        </mesh>
      ))}
      {/* Tail lights */}
      <mesh position={[0, 0.15, -1.35]}>
        <boxGeometry args={[1, 0.08, 0.04]} />
        <meshBasicMaterial color="#ff0033" />
      </mesh>
      {/* Exhaust */}
      <mesh position={[0, 0.08, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.3, 6]} />
        <meshLambertMaterial color="#ff3300" emissive="#ff3300" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

export default OpponentCar;
