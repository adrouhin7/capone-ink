import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

function MachineModel() {
  try {
    const { scene } = useGLTF("/models/tattoo-machine.glb");
    // Centr et ajuste le modèle
    scene.position.set(0, 0, 0);
    return (
      <primitive
        object={scene}
        scale={0.8}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    );
  } catch (error) {
    // Fallback: cube de test
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#C41E3A" />
      </mesh>
    );
  }
}

export default function TattooMachine() {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "280px",
        height: "280px",
        pointerEvents: "none",
        zIndex: 2
      }}
    >
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <Suspense fallback={null}>
          <MachineModel />
          <Environment preset="studio" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
