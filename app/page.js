"use client";

import Experience from "@/components/Experience";
import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

export default function Home() {
  return (
    <div className="fixed inset-0">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 30 }}>
        {/* <ScrollControls pages={4}> */}
          <Physics>
            <Experience />
          </Physics>
        {/* </ScrollControls> */}
      </Canvas>
    </div>
  );
}
