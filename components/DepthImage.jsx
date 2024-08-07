// https://github.com/akella/fake3d/blob/master/js/shaders/fragment.glsl
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { damp2 } from "maath/easing"

const DepthImageMaterial = shaderMaterial(
  { uDepthTexture: null, uImageTexture: null, uMouse: [0, 0] },
  /* glsl */ `
varying vec2 vUv;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vUv = uv;
}
`,
  /* glsl */ `
uniform sampler2D uImageTexture;
uniform sampler2D uDepthTexture;
uniform vec2 uMouse;

varying vec2 vUv;

vec2 mirrored(vec2 v) {
  vec2 m = mod(v,2.);
  return mix(m,2.0 - m, step(1.0 ,m));
}

void main() {
  vec4 depth = texture(uDepthTexture, mirrored(vUv));

  vec2 fake3d = vUv + uMouse * 0.05 * depth.r;

  gl_FragColor = texture(uImageTexture, mirrored(fake3d));

  // #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`
);

extend({ DepthImageMaterial });

const DepthImage = ({ imageTexture, depthTexture }) => {
  const ref = useRef();

  useFrame(({ pointer }, delta) => {
    // ref.current.uMouse = pointer;

    damp2(ref.current.uMouse, pointer, 0.25, delta)
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <depthImageMaterial
        ref={ref}
        uDepthTexture={depthTexture}
        uImageTexture={imageTexture}
      />
    </mesh>
  );
};

export default DepthImage;
