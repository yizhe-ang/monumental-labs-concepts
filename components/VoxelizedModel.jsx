import { extend } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

extend({ RoundedBoxGeometry });

const VoxelizedModel = ({ mesh, boxSize = 0.05, boxRoundness = 0.02 }) => {
  const ref = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const rayCaster = useMemo(() => new THREE.Raycaster(), []);

  const voxels = useMemo(() => {
    console.log("yo");
    return voxelizeMesh({ mesh, rayCaster, gridSize: boxSize });
  }, [mesh, rayCaster]);

  useEffect(() => {
    for (let i = 0; i < voxels.length; i++) {
      dummy.position.copy(voxels[i].position);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [voxels, dummy]);

  return (
    <>
      <instancedMesh
        ref={ref}
        args={[null, null, voxels.length]}
        castShadow
        receiveShadow
      >
        <roundedBoxGeometry
          args={[boxSize, boxSize, boxSize, 2, boxRoundness]}
        />
        <meshStandardMaterial color="mediumpurple" />
      </instancedMesh>
    </>
  );
};

function voxelizeMesh({ mesh, rayCaster, gridSize }) {
  const voxels = [];

  // TODO: Coordinate sampling can be a random function or something more advanced
  const boundingBox = new THREE.Box3().setFromObject(mesh);

  for (let i = boundingBox.min.x; i < boundingBox.max.x; i += gridSize) {
    for (let j = boundingBox.min.y; j < boundingBox.max.y; j += gridSize) {
      for (let k = boundingBox.min.z; k < boundingBox.max.z; k += gridSize) {
        const pos = new THREE.Vector3(i, j, k);
        if (isInsideMesh(pos, mesh, rayCaster)) {
          voxels.push({
            position: pos,
          });
        }
      }
    }
  }

  return voxels;
}

function isInsideMesh(pos, mesh, rayCaster) {
  // NOTE: Material's `side` property should be THREE.DoubleSide
  rayCaster.set(pos, { x: 0, y: -1, z: 0 });
  const rayCasterIntersects = rayCaster.intersectObject(mesh, false);
  // We need odd number of intersections
  return rayCasterIntersects.length % 2 === 1;
}

export default VoxelizedModel;
