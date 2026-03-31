// SPDX-License-Identifier: Apache-2.0

import { createEffect, createMemo, onMount } from 'solid-js';
import { autodispose, Canvas, Entity, useFrame, useThree } from 'solid-three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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

        // reminder: as with cross sectional view, origin is
        // at top, so lower meshZ appears higher
        const meshZ: number = viaLayer.isoZ ?? viaLayer.crossY;
        const mesh = autodispose(new THREE.Mesh(geometry, material));
        mesh.position.set(
          rect.x + rect.width / 2,
          rect.y + rect.height / 2,
          meshZ + viaLayer.crossHeight / 2,
        );

        mesh.updateMatrix();

        group.add(mesh);
      }

      group.rotation.set((11 * Math.PI) / 4, 0, -Math.PI / 4);
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
      <Entity from={THREE.AmbientLight} intensity={0.25} />
    </Canvas>
  );
}
