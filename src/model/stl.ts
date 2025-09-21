import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js';
import { Group } from 'three/src/objects/Group.js';
import { Mesh } from 'three/src/objects/Mesh.js';
import { downloadFile } from '~/utils/download-file';
import { layout, rectLayer, rectViaLayer } from './layout';

export function exportSTL() {
  const exporter = new STLExporter();

  const scene = new Group();

  for (const rect of layout.rects) {
    const layer = rectLayer(rect);
    const viaLayer = rectViaLayer(layout, rect);
    if (!viaLayer || !layer) {
      continue;
    }

    const geometry = new BoxGeometry(rect.width, rect.height, viaLayer.crossHeight);
    const cube = new Mesh(geometry);
    cube.position.set(
      rect.x + rect.width / 2,
      -(rect.y + rect.height / 2),
      -viaLayer.crossY - viaLayer.crossHeight / 2,
    );
    cube.updateMatrixWorld();
    scene.add(cube);
  }

  const result = exporter.parse(scene, { binary: true }) as unknown as ArrayBuffer;
  downloadFile('siliwiz.stl', result);
}
