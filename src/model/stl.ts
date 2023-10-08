import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry';
import { Group } from 'three/src/objects/Group';
import { Mesh } from 'three/src/objects/Mesh';
import { downloadFile } from '~/utils/download-file';
import { layerTypes } from './layerTypes';
import { layout } from './layout';

export function exportSTL() {
  const exporter = new STLExporter();

  const scene = new Group();

  for (const rect of layout.rects) {
    const layer = layerTypes.find((l) => l.name === rect.layer);
    if (layer == null) {
      continue;
    }

    const geometry = new BoxGeometry(rect.width, rect.height, layer.crossHeight);
    const cube = new Mesh(geometry);
    cube.position.set(
      rect.x + rect.width / 2,
      -(rect.y + rect.height / 2),
      -layer.crossY - layer.crossHeight / 2,
    );
    cube.updateMatrixWorld();
    scene.add(cube);
  }

  const result = exporter.parse(scene, { binary: true }) as unknown as ArrayBuffer;
  downloadFile('siliwiz.stl', result);
}
