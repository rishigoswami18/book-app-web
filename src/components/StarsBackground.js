import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

const StarBackground = () => {
  return (
    <Canvas style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}>
      <color attach="background" args={["#000000"]} />  {/* Make space black */}
      <Stars
        radius={300}
        depth={60}
        count={5000}
        factor={7}
        saturation={0}
        fade
        speed={1}
      />
      <OrbitControls enableZoom={false} autoRotate />
    </Canvas>
  );
};

export default StarBackground;
