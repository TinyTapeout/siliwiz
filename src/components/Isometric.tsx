// SPDX-License-Identifier: Apache-2.0

import { For } from 'solid-js';
import { Canvas, Entity } from 'solid-three';
import * as THREE from 'three';
import { layout, rectLayer, rectViaLayer } from '../model/layout';

export default function Isometric() {
  const rects = () => layout.rects;

  return (
    <Canvas
      defaultCamera={{ position: [0, 0, 900] }}
      shadows
      style={{ width: '400px', height: '600px' }}
    >
      <Entity
        from={THREE.Group}
        position={[-275, 100, 0]}
        rotation={[(7 * Math.PI) / 4, 0, Math.PI / 4]}
      >
        <For each={rects()}>
          {(rect) => {
            const layer = rectLayer(rect);
            const viaLayer = rectViaLayer(layout, rect);
            if (!viaLayer || !layer) {
              return <Entity from={THREE.Mesh} />;
            }

            return (
              <Entity
                from={THREE.Mesh}
                position={[
                  rect.x + rect.width / 2,
                  -(rect.y + rect.height / 2),
                  -viaLayer.crossY - viaLayer.crossHeight / 2,
                ]}
              >
                <Entity
                  from={THREE.BoxGeometry}
                  args={[rect.width, rect.height, viaLayer.crossHeight]}
                />
                <Entity from={THREE.MeshStandardMaterial} color={layer.color} />
              </Entity>
            );
          }}
        </For>
      </Entity>
      <Entity from={THREE.AmbientLight} intensity={0.1} />
      <Entity from={THREE.PointLight} position={[0, 600, -250]} />
    </Canvas>
  );
}
