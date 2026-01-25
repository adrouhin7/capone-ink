import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function MachineModel() {
  try {
    const { scene } = useGLTF("/models/damascus_coil_tattoo_machine__gap_assignment_2.glb");
    console.log("3D Model loaded successfully:", scene);
    return (
      <primitive
        object={scene}
        scale={1.5}
        rotation={[0, 0, 0]}
      />
    );
  } catch (error) {
    console.error("Failed to load 3D model:", error);
    return <mesh><boxGeometry /><meshStandardMaterial color="red" /></mesh>;
  }
}

export default function TattooMachine() {
  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        left: "40px",
        width: "280px",
        height: "280px",
        pointerEvents: "none",
        zIndex: 2,
        border: "2px solid rgba(196, 30, 58, 0.3)"
      }}
    >
      <Canvas camera={{ position: [0, 0, 4] }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <MachineModel />
          <Environment preset="studio" />
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            enablePan={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
