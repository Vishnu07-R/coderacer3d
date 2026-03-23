import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RacingTrackProps {
  speed: number;
  boosting: boolean;
}

const RacingTrack = ({ speed, boosting }: RacingTrackProps) => {
  const offsetRef = useRef(0);
  const dashesRef = useRef<THREE.InstancedMesh>(null);
  const buildingsLeftRef = useRef<THREE.InstancedMesh>(null);
  const buildingsRightRef = useRef<THREE.InstancedMesh>(null);
  const archesRef = useRef<THREE.InstancedMesh>(null);
  const floatingRingsRef = useRef<THREE.InstancedMesh>(null);
  const groundLightsLeftRef = useRef<THREE.InstancedMesh>(null);
  const groundLightsRightRef = useRef<THREE.InstancedMesh>(null);
  const barrierLeftRef = useRef<THREE.InstancedMesh>(null);
  const barrierRightRef = useRef<THREE.InstancedMesh>(null);

  const dashCount = 30;
  const buildingCount = 20;
  const archCount = 8;
  const ringCount = 12;
  const lightCount = 25;
  const barrierCount = 40;

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Pre-generate building heights and colors
  const buildingData = useMemo(() => 
    Array.from({ length: buildingCount }, (_, i) => ({
      height: 3 + Math.random() * 12,
      width: 1.5 + Math.random() * 3,
      depth: 1.5 + Math.random() * 2,
      colorIndex: i % 5,
    })), []
  );

  const neonColors = useMemo(() => [
    new THREE.Color("#00f0ff"),
    new THREE.Color("#ff00ff"),
    new THREE.Color("#00ff88"),
    new THREE.Color("#ff3366"),
    new THREE.Color("#aa44ff"),
  ], []);

  useFrame((state, delta) => {
    offsetRef.current += speed * delta * 0.5;
    const t = state.clock.elapsedTime;

    // Road dashes
    if (dashesRef.current) {
      for (let i = 0; i < dashCount; i++) {
        const z = ((i * 4 - offsetRef.current % (dashCount * 4)) + dashCount * 4) % (dashCount * 4) - dashCount * 2;
        tempMatrix.makeTranslation(0, 0.02, -z);
        dashesRef.current.setMatrixAt(i, tempMatrix);
      }
      dashesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Buildings left & right
    if (buildingsLeftRef.current && buildingsRightRef.current) {
      for (let i = 0; i < buildingCount; i++) {
        const data = buildingData[i];
        const z = ((i * 7 - offsetRef.current * 0.3 % (buildingCount * 7)) + buildingCount * 7) % (buildingCount * 7) - buildingCount * 3.5;

        tempMatrix.makeScale(data.width, data.height, data.depth);
        tempMatrix.setPosition(-8 - data.width * 0.5 - (i % 3) * 2, data.height * 0.5, -z);
        buildingsLeftRef.current.setMatrixAt(i, tempMatrix);
        buildingsLeftRef.current.setColorAt(i, tempColor.copy(neonColors[data.colorIndex]).multiplyScalar(0.15));

        tempMatrix.setPosition(8 + data.width * 0.5 + (i % 3) * 2, data.height * 0.5, -z);
        buildingsRightRef.current.setMatrixAt(i, tempMatrix);
        buildingsRightRef.current.setColorAt(i, tempColor.copy(neonColors[(data.colorIndex + 2) % 5]).multiplyScalar(0.15));
      }
      buildingsLeftRef.current.instanceMatrix.needsUpdate = true;
      buildingsLeftRef.current.instanceColor!.needsUpdate = true;
      buildingsRightRef.current.instanceMatrix.needsUpdate = true;
      buildingsRightRef.current.instanceColor!.needsUpdate = true;
    }

    // Neon arches over road
    if (archesRef.current) {
      for (let i = 0; i < archCount; i++) {
        const z = ((i * 15 - offsetRef.current * 0.4 % (archCount * 15)) + archCount * 15) % (archCount * 15) - archCount * 7;
        tempMatrix.makeScale(10, 6, 0.3);
        tempMatrix.setPosition(0, 5, -z);
        archesRef.current.setMatrixAt(i, tempMatrix);
        const pulse = Math.sin(t * 2 + i) * 0.3 + 0.7;
        archesRef.current.setColorAt(i, tempColor.copy(neonColors[i % 5]).multiplyScalar(pulse));
      }
      archesRef.current.instanceMatrix.needsUpdate = true;
      archesRef.current.instanceColor!.needsUpdate = true;
    }

    // Floating holographic rings
    if (floatingRingsRef.current) {
      for (let i = 0; i < ringCount; i++) {
        const z = ((i * 10 - offsetRef.current * 0.5 % (ringCount * 10)) + ringCount * 10) % (ringCount * 10) - ringCount * 5;
        const rotation = new THREE.Euler(t * 0.5 + i, t * 0.3, Math.sin(t + i) * 0.3);
        const quat = new THREE.Quaternion().setFromEuler(rotation);
        const scale = new THREE.Vector3(1, 1, 1);
        const pos = new THREE.Vector3(
          Math.sin(i * 1.7) * 3,
          3 + Math.sin(t * 0.8 + i) * 1.5,
          -z
        );
        tempMatrix.compose(pos, quat, scale);
        floatingRingsRef.current.setMatrixAt(i, tempMatrix);
        const ringPulse = Math.sin(t * 3 + i * 2) * 0.5 + 0.5;
        floatingRingsRef.current.setColorAt(i, tempColor.copy(neonColors[i % 5]).multiplyScalar(0.5 + ringPulse * 0.5));
      }
      floatingRingsRef.current.instanceMatrix.needsUpdate = true;
      floatingRingsRef.current.instanceColor!.needsUpdate = true;
    }

    // Ground accent lights
    if (groundLightsLeftRef.current && groundLightsRightRef.current) {
      for (let i = 0; i < lightCount; i++) {
        const z = ((i * 4 - offsetRef.current % (lightCount * 4)) + lightCount * 4) % (lightCount * 4) - lightCount * 2;
        const glow = Math.sin(t * 4 + i * 0.5) * 0.3 + 0.7;
        
        tempMatrix.makeScale(0.15, 0.4 * glow, 0.15);
        tempMatrix.setPosition(-4.5, 0.2 * glow, -z);
        groundLightsLeftRef.current.setMatrixAt(i, tempMatrix);
        groundLightsLeftRef.current.setColorAt(i, tempColor.setHSL((t * 0.05 + i * 0.04) % 1, 1, 0.5));

        tempMatrix.setPosition(4.5, 0.2 * glow, -z);
        groundLightsRightRef.current.setMatrixAt(i, tempMatrix);
        groundLightsRightRef.current.setColorAt(i, tempColor.setHSL((t * 0.05 + i * 0.04 + 0.5) % 1, 1, 0.5));
      }
      groundLightsLeftRef.current.instanceMatrix.needsUpdate = true;
      groundLightsLeftRef.current.instanceColor!.needsUpdate = true;
      groundLightsRightRef.current.instanceMatrix.needsUpdate = true;
      groundLightsRightRef.current.instanceColor!.needsUpdate = true;
    }

    // Barriers
    if (barrierLeftRef.current && barrierRightRef.current) {
      for (let i = 0; i < barrierCount; i++) {
        const z = ((i * 3 - offsetRef.current % (barrierCount * 3)) + barrierCount * 3) % (barrierCount * 3) - barrierCount * 1.5;
        
        tempMatrix.makeScale(0.1, 0.6, 0.8);
        tempMatrix.setPosition(-4.2, 0.3, -z);
        barrierLeftRef.current.setMatrixAt(i, tempMatrix);

        tempMatrix.setPosition(4.2, 0.3, -z);
        barrierRightRef.current.setMatrixAt(i, tempMatrix);
      }
      barrierLeftRef.current.instanceMatrix.needsUpdate = true;
      barrierRightRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[80, 200, 1, 1]} />
        <meshLambertMaterial color="#0a0a15" />
      </mesh>

      {/* Road surface - 3 lanes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[8.5, 200, 1, 1]} />
        <meshLambertMaterial color="#1a1a2e" />
      </mesh>

      {/* Lane dividers - glowing */}
      {[-2.8, 0, 2.8].map((x, i) => (
        <mesh key={`lane-${i}`} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.06, 200]} />
          <meshBasicMaterial color={i === 1 ? "#ffcc00" : "#00f0ff"} />
        </mesh>
      ))}

      {/* Road edge neon strips */}
      <mesh position={[-4.25, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 200]} />
        <meshBasicMaterial color="#ff00ff" />
      </mesh>
      <mesh position={[4.25, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 200]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Center dashes */}
      <instancedMesh ref={dashesRef} args={[undefined, undefined, dashCount]}>
        <planeGeometry args={[0.12, 1.8]} />
        <meshBasicMaterial color="#ffcc00" />
      </instancedMesh>

      {/* City buildings left */}
      <instancedMesh ref={buildingsLeftRef} args={[undefined, undefined, buildingCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial vertexColors />
      </instancedMesh>

      {/* City buildings right */}
      <instancedMesh ref={buildingsRightRef} args={[undefined, undefined, buildingCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial vertexColors />
      </instancedMesh>

      {/* Neon arches */}
      <instancedMesh ref={archesRef} args={[undefined, undefined, archCount]}>
        <torusGeometry args={[1, 0.04, 4, 16, Math.PI]} />
        <meshLambertMaterial transparent opacity={0.6} emissive="#00f0ff" />
      </instancedMesh>

      {/* Floating holographic rings */}
      <instancedMesh ref={floatingRingsRef} args={[undefined, undefined, ringCount]}>
        <torusGeometry args={[0.8, 0.05, 4, 16]} />
        <meshLambertMaterial transparent opacity={0.4} emissive="#ff00ff" />
      </instancedMesh>

      {/* Ground accent lights left */}
      <instancedMesh ref={groundLightsLeftRef} args={[undefined, undefined, lightCount]}>
        <cylinderGeometry args={[0.08, 0.08, 1, 4]} />
        <meshBasicMaterial transparent opacity={0.8} />
      </instancedMesh>

      {/* Ground accent lights right */}
      <instancedMesh ref={groundLightsRightRef} args={[undefined, undefined, lightCount]}>
        <cylinderGeometry args={[0.08, 0.08, 1, 4]} />
        <meshBasicMaterial transparent opacity={0.8} />
      </instancedMesh>

      {/* Road barriers left */}
      <instancedMesh ref={barrierLeftRef} args={[undefined, undefined, barrierCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color="#111122" />
      </instancedMesh>

      {/* Road barriers right */}
      <instancedMesh ref={barrierRightRef} args={[undefined, undefined, barrierCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color="#111122" />
      </instancedMesh>

      {/* Reduced point lights for mobile */}
      <pointLight position={[0, 5, -15]} color="#4444ff" intensity={1.5} distance={30} />
      <pointLight position={[0, 5, -45]} color="#ff00ff" intensity={1.5} distance={30} />

      {/* Boost-reactive floor glow */}
      {boosting && (
        <pointLight position={[0, 0.2, 5]} color="#ff6600" intensity={4} distance={10} />
      )}
    </group>
  );
};

export default RacingTrack;
