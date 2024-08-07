import { rotate } from "@/lib/glsl";
import { ComputedAttribute, shaderMaterial, useGLTF } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material";

const AnimatedTrianglesMaterial = shaderMaterial(
  { uTime: 0 },
  /* glsl */ `
uniform float uTime;

attribute float aRandom;

varying vec2 vUv;

void main() {
  vec3 pos = position;
  pos += aRandom * normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vUv = uv;
}
`,
  /* glsl */ `
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
`
);

extend({ AnimatedTrianglesMaterial });

const Triangles = () => {
  const ref = useRef();

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uProgress: { value: 0 },
    };
  }, []);

  useEffect(() => {
    ref.current.geometry.toNonIndexed()
  }, [])

  useControls("triangles", {
    progress: {
      value: 0,
      min: 0,
      max: 1,
      onChange: (value) => {
        uniforms.uProgress.value = value;
      },
    },
  });

  useFrame(({}, delta) => {
    uniforms.uTime.value += delta;
  });

  return (
    <>
      <mesh ref={ref} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 9]}>
          <ComputedAttribute
            name="aRandom"
            compute={(geometry) => {
              const randoms = new Float32Array(
                geometry.attributes.position.count * 3
              );
              for (let i = 0; i < geometry.attributes.position.count; i += 3) {
                const r = Math.random();
                randoms[i] = r;
                randoms[i + 1] = r;
                randoms[i + 2] = r;
              }

              return new THREE.BufferAttribute(randoms, 1);
            }}
          />
          <ComputedAttribute
            name="aCenter"
            compute={(geometry) => {
              const centers = new Float32Array(
                geometry.attributes.position.count * 3
              );
              for (let i = 0; i < geometry.attributes.position.count; i += 3) {
                const x = geometry.attributes.position.array[i * 3];
                const y = geometry.attributes.position.array[i * 3 + 1];
                const z = geometry.attributes.position.array[i * 3 + 2];

                const x1 = geometry.attributes.position.array[i * 3 + 3];
                const y1 = geometry.attributes.position.array[i * 3 + 4];
                const z1 = geometry.attributes.position.array[i * 3 + 5];

                const x2 = geometry.attributes.position.array[i * 3 + 6];
                const y2 = geometry.attributes.position.array[i * 3 + 7];
                const z2 = geometry.attributes.position.array[i * 3 + 8];

                const center = new THREE.Vector3(x, y, z)
                  .add(new THREE.Vector3(x1, y1, z1))
                  .add(new THREE.Vector3(x2, y2, z2))
                  .divideScalar(3);

                centers.set([center.x, center.y, center.z], i * 3);
                centers.set([center.x, center.y, center.z], (i + 1) * 3);
                centers.set([center.x, center.y, center.z], (i + 2) * 3);
              }

              return new THREE.BufferAttribute(centers, 3);
            }}
          />
        </icosahedronGeometry>
        {/* <animatedTrianglesMaterial wireframe /> */}
        {/* <meshStandardMaterial color="red" /> */}
        <CustomShaderMaterial
          baseMaterial={THREE.MeshStandardMaterial}
          vertexShader={vertexShader}
          silent
          uniforms={uniforms}
          // flatShading
          color={"white"}
          side={THREE.DoubleSide}
        />
        <CustomShaderMaterial
          attach="customDepthMaterial"
          baseMaterial={THREE.MeshDepthMaterial}
          vertexShader={vertexShader}
          silent
          uniforms={uniforms}
          depthPacking={THREE.RGBADepthPacking}
        />
      </mesh>
    </>
  );
};

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;

attribute float aRandom;
attribute vec3 aCenter;

varying vec2 vUv;

${rotate}

void main() {
  float prog = (position.x + 1.0) / 2.0;
  float locprog = clamp((uProgress - 0.8 * prog) / 0.2, 0.0, 1.0);

  // Normalize to center
  vec3 pos = position - aCenter;
  // Offset from center
  pos += 3.0 * normal * aRandom * locprog;
  // Scale in
  pos *= (1.0 - locprog);
  // Translate back
  pos += aCenter;
  // Rotate
  pos = rotate(pos, vec3(0.0, 1.0, 0.0), aRandom * locprog * PI * 1.0);

  csm_Position = pos;

  vUv = uv;
}
`;

export default Triangles;
