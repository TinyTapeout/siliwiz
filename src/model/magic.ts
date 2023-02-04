// SPDX-License-Identifier: Apache-2.0

import { rectLayer, sortRects, type ILayout, type ILayoutRect } from '~/model/layout';
import type { Point2D } from '~/utils/geometry';
import { layerTypes } from './layerTypes';

export const defaultTech = 'siliwiz';

function magicRect(rect: ILayoutRect) {
  const x = Math.round(rect.x);
  const y = Math.round(rect.y);
  const width = Math.round(rect.x + rect.width);
  const height = Math.round(rect.y + rect.height);
  return `${x} ${y} ${width} ${height}`;
}

export function fromMagic(source: string, translate: Point2D = { x: 0, y: 0 }, scale = 1) {
  let layer = '';
  const rects: ILayoutRect[] = [];
  for (const line of source.split('\n')) {
    if (line.startsWith('<< ')) {
      layer = line.replace('<< ', '').replace(' >>', '');
    } else if (line.startsWith('rect')) {
      const [x1, y1, x2, y2] = line
        .split(' ')
        .slice(1)
        .map((s) => parseInt(s, 10));
      rects.push({
        x: scale * x1 + translate.x,
        y: scale * -y2 + translate.y,
        width: scale * (x2 - x1),
        height: scale * (y2 - y1),
        layer,
      });
    } else if (line.startsWith('flabel')) {
      const lineParts = line.split(' ');
      const layerName = lineParts[1];
      const [x1Orig, , , y2Orig] = lineParts.slice(2, 6).map((s) => parseInt(s, 10));
      const label = lineParts[12];
      const x1 = scale * x1Orig + translate.x;
      const y2 = scale * -y2Orig + translate.y;
      for (const rect of rects) {
        if (
          rect.layer === layerName &&
          x1 >= rect.x &&
          x1 <= rect.x + rect.width &&
          y2 >= rect.y &&
          y2 <= rect.y + rect.height
        ) {
          rect.label = label;
        }
      }
    }
  }
  for (const rect of rects) {
    const layer = rectLayer(rect);
    for (const intersectLayer of layer?.intersectLayers ?? []) {
      rects.push({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        layer: intersectLayer,
      });
    }
  }

  const result: ILayout = { rects: sortRects(rects) };
  return result;
}

export function toMagic(layout: ILayout, tech = defaultTech) {
  const result = [
    `magic`,
    `tech ${tech}`,
    `magscale 1 ${tech === 'sky130A' ? 2 : 1}`,
    `timestamp ${Math.floor(new Date().getTime() / 1000)}`,
  ];
  const labels: Array<{ layerName: string; rect: ILayoutRect }> = [];
  for (const layer of layerTypes) {
    const rects = layout.rects.filter((r) => r.layer === layer.name);
    if (rects.length > 0) {
      result.push(`<< ${layer.magicName} >>`);
      for (const rect of rects) {
        result.push(`rect ${magicRect(rect)}`);
        if (rect.label != null) {
          labels.push({ layerName: layer.magicName, rect });
        }
      }
    }
  }
  result.push('<< labels >>');
  let portIndex = 1;
  for (const { layerName, rect } of labels) {
    if (rect.label == null) {
      continue;
    }
    result.push(`flabel ${layerName} s ${magicRect(rect)} 0 FreeSans 240 90 0 0 ${rect.label}`);
    result.push(`port ${portIndex} nsew signal output`);
    portIndex++;
  }
  result.push('<< end >>');

  return result.join('\n');
}
