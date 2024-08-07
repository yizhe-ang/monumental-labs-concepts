"use client";

import {
  Center,
  Environment,
  Float,
  OrbitControls,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Heart } from "./Heart";
import { Stone } from "./Stone";
import DepthImage from "./DepthImage";
import { Sculpture1 } from "./Sculpture1";
import { RigidBody } from "@react-three/rapier";
import VoxelizedModel from "./VoxelizedModel";
import * as THREE from "three";
import Triangles from "./Triangles";
import { DissolveMaterial } from "./DissolveMaterial";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Sculpture2 } from "./Sculpture2";
import { Sculpture3 } from "./Sculpture3";
import { useControls } from "leva";
import { useRef } from "react";
import { Sculpture4 } from "./Sculpture4";

const testMesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.3, 0.1, 50, 10),
  // new THREE.SphereGeometry(0.8),
  new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide })
);

const testMaterial = new THREE.MeshStandardMaterial({ color: "white" });

const Experience = () => {
  const imageTexture = useTexture("images/mount.jpg");
  const depthTexture = useTexture("images/mount-map.jpg");

  const model = useGLTF("/models/sculpture_2.glb");

  const explodeProgress = useRef();
  const sculpture1Progress = useRef();
  const sculpture2Progress = useRef();

  useControls("Explode", {
    progress: {
      value: 0,
      min: 0,
      max: 1,
      onChange: (value) => {
        explodeProgress.current = value;
      },
    },
  });
  useControls("Sculpture 1", {
    progress: {
      value: 1,
      min: 0,
      max: 1,
      onChange: (value) => {
        sculpture1Progress.current = value;
      },
    },
  });
  useControls("Sculpture 2", {
    progress: {
      value: 0,
      min: 0,
      max: 1,
      onChange: (value) => {
        sculpture2Progress.current = value;
      },
    },
  });

  return (
    <>
      {/* <OrbitControls enableZoom={false} /> */}
      <OrbitControls />

      <directionalLight position={[1, 2, 3]} intensity={1.5} castShadow />
      {/* <directionalLight position={[0, 1, 0]} intensity={1.5} castShadow /> */}

      {/* TODO: Physics simulation? */}
      <Float floatIntensity={0.5} speed={3}>
        <Stone progress={explodeProgress} />
      </Float>

      {/* <Center scale={0.25}>
        <Sculpture1 />
      </Center> */}

      {/* <Triangles /> */}

      {/* <VoxelizedModel mesh={testMesh}></VoxelizedModel> */}

      {/* <primitive object={testMesh} /> */}

      {/* FLOOR */}
      {/* <RigidBody type="fixed"> */}
      {/* <mesh position-y={-2} receiveShadow>
        <boxGeometry args={[20, 0.5, 20]} />
        <meshStandardMaterial color="white" />
      </mesh> */}
      {/* </RigidBody> */}

      {/* <primitive object={model.scene} /> */}

      {/* <mesh>
        <boxGeometry />
        <DissolveMaterial baseMaterial={testMaterial} />
      </mesh> */}

      {/* <DepthImage imageTexture={imageTexture} depthTexture={depthTexture} /> */}

      {/* <Sculpture2 progress={sculpture2Progress} /> */}
      <Sculpture3 progress={sculpture1Progress} />
      <Sculpture4 progress={sculpture2Progress} />

      <Environment preset="sunset" background backgroundBlurriness={0.4} />

      {/* POSTPROCESSING */}
      {/* FIXME: Why do the colors become different? */}
      <EffectComposer>
        <Bloom luminanceThreshold={1} intensity={1.25} mipmapBlur />
      </EffectComposer>
    </>
  );
};

export default Experience;
