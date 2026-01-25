import React, { Suspense, useEffect, useState } from "react";

const Canvas = React.lazy(() => import("@react-three/fiber").then(m => ({ default: m.Canvas })));
const OrbitControls = React.lazy(() => import("@react-three/drei").then(m => ({ default: m.OrbitControls })));
const Environment = React.lazy(() => import("@react-three/drei").then(m => ({ default: m.Environment })));
const useGLTF = React.lazy(() => import("@react-three/drei").then(m => ({ default: m.useGLTF })));

function MachineModel() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("TattooMachine: Attempting to load model...");
    fetch("/models/damascus_coil_tattoo_machine__gap_assignment_2.glb")
      .then(res => {
        console.log("Model fetch status:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then(() => {
        console.log("Model file exists!");
        setLoaded(true);
      })
      .catch(err => {
        console.error("Model loading error:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div style={{ color: "#C41E3A", fontSize: "12px", padding: "10px" }}>
        ❌ Model Error: {error}
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={{ color: "#C41E3A", fontSize: "12px", padding: "10px" }}>
        ⏳ Loading...
      </div>
    );
  }

  return (
    <div style={{ color: "#C41E3A", fontSize: "12px", padding: "10px" }}>
      ✅ Model Loaded
    </div>
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
        zIndex: 2,
        border: "2px solid rgba(196, 30, 58, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        color: "#C41E3A"
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <MachineModel />
      </Suspense>
    </div>
  );
}
