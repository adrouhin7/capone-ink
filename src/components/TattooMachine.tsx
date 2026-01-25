import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function MachineModel() {
  const { scene } = useGLTF("/models/tattoo-machine.glb");
  return (
    <primitive
      object={scene}
      scale={1.5}
      rotation={[0, 0, 0]}
    />
  );
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
        zIndex: 2
      }}
    >
      <Canvas camera={{ position: [0, 0, 4] }}>
        <Suspense fallback={null}>
          <MachineModel />
          <Environment preset="studio" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
