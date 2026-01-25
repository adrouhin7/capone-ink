import { useEffect } from "react";

export default function TattooMachine() {
  useEffect(() => {
    console.log("✅ TattooMachine component mounted!");
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        left: "40px",
        width: "280px",
        height: "280px",
        backgroundColor: "rgba(196, 30, 58, 0.2)",
        border: "3px solid #C41E3A",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#C41E3A",
        fontSize: "14px",
        fontWeight: "bold"
      }}
    >
      Test Box - Machine 3D
    </div>
  );
}
