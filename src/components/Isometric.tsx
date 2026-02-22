// SPDX-License-Identifier: Apache-2.0

import { createEffect, createMemo, onMount } from 'solid-js';
import { autodispose, Canvas, Entity, useFrame, useThree } from 'solid-three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSG } from 'three-csg-ts';
import { layout, rectLayer, rectViaLayer } from '../model/layout';

const SiliconMesh = () => {
  const rects = () => layout.rects;

  let group: THREE.Group | undefined;

  onMount(() => {
    createEffect(() => {
      // Had to circumvent `solid-three`'s intended
      // `Entity` pattern, as upon developing (10/2/2025),
      // despite `createEffect` properly running when
      // dependency `rects()` changed, `<Entity from={group} />`
      // wasn't correctly updating for whatever reason.
      const { scene } = useThree();

      scene.remove(group);

      group = autodispose(new THREE.Group());

      const meshes: THREE.Mesh[] = autodispose([]);

      for (const rect of rects()) {
        const layer = rectLayer(rect);
        const viaLayer = rectViaLayer(layout, rect);
        if (!viaLayer || !layer) {
          continue;
        }

        const geometry = autodispose(
          new THREE.BoxGeometry(rect.width, rect.height, viaLayer.crossHeight),
        );
        const material = autodispose(new THREE.MeshStandardMaterial({ color: layer.color }));

        const mesh = autodispose(new THREE.Mesh(geometry, material));
        mesh.position.set(
          rect.x + rect.width / 2,
          -(rect.y + rect.height / 2),
          -viaLayer.crossY - viaLayer.crossHeight / 2,
        );

        mesh.updateMatrix();

        meshes.push(mesh);
      }

      // Incredibly inefficient, to be fixed by someone,
      // some time, probably
      // Fixes z-fighting by subtracting
      // overlapping geometry
      for (let i = 1; i < meshes.length; i++) {
        for (let j = i - 1; j >= 0; j--) {
          meshes[j] = CSG.subtract(meshes[j], meshes[i]);
          meshes[j].updateMatrix();
        }
      }

      for (let i = 0; i < meshes.length; i++) {
        group.add(meshes[i]);
      }

      group.rotation.set((7 * Math.PI) / 4, 0, Math.PI / 4);
      group.position.set(-275, 100, 0);

      group.updateMatrix();

      scene.add(group);
    });
  });

  return null;
};

const OrbitController = () => {
  const { currentCamera, gl } = useThree();

  const controls = createMemo<OrbitControls>((previous) => {
    const controls = autodispose(new OrbitControls(currentCamera, gl.domElement));
    return controls;
  });

  useFrame(() => controls().update());

  return null;
};

export default function Isometric() {
  return (
    <Canvas
      defaultCamera={{ position: [0, 0, 900] }}
      shadows
      style={{ width: '400px', height: '600px' }}
    >
      <SiliconMesh />
      <OrbitController />
      <Entity from={THREE.AmbientLight} intensity={0.1} />
      <Entity from={THREE.PointLight} position={[0, 600, -250]} />
    </Canvas>
  );
}
