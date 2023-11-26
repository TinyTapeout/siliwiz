// SPDX-License-Identifier: Apache-2.0

import { rectViaLayer, sortRects, type ILayout, type ILayoutRect } from '~/model/layout';
import type { Point2D } from '~/utils/geometry';

export const defaultTech = 'siliwiz';

interface ITransform {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
}

export const identityTransform: ITransform = {
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
};

function magicRect(rect: ILayoutRect, transform = identityTransform) {
  const { scaleX, scaleY, translateX, translateY } = transform;
  const x1 = Math.round((rect.x + translateX) * scaleX);
  const y1 = Math.round((rect.y + translateY) * scaleY);
  const x2 = Math.round((rect.x + rect.width + translateX) * scaleX);
  const y2 = Math.round((rect.y + rect.height + translateY) * scaleY);
  return `${Math.min(x1, x2)} ${Math.min(y1, y2)} ${Math.max(x1, x2)} ${Math.max(y1, y2)}`;
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
  // for (const rect of rects) {
  //   const layer = rectLayer(rect);
  //   for (const intersectLayer of layer?.intersectLayers ?? []) {
  //     rects.push({
  //       x: rect.x,
  //       y: rect.y,
  //       width: rect.width,
  //       height: rect.height,
  //       layer: intersectLayer,
  //     });
  //   }
  // }

  const result: ILayout = { rects: sortRects(rects) };
  return result;
}

export interface IMagicOptions {
  tech?: string;
  mirrorY?: boolean;
}

export function toMagic(layout: ILayout, { tech = defaultTech, mirrorY = false }: IMagicOptions) {
  const scale = 1;
  const result = [
    `magic`,
    `tech ${tech}`,
    `magscale 1 ${tech === 'sky130A' ? 2 : 1}`,
    `timestamp ${Math.floor(new Date().getTime() / 1000)}`,
  ];
  const labels: Array<{ layerName: string; rect: ILayoutRect }> = [];
  const layerRects = new Map<string, ILayoutRect[]>();
  let maxY = 0;
  for (const rect of layout.rects) {
    const layer = rectViaLayer(layout, rect);
    if (layer == null) {
      continue;
    }
    const rects = layerRects.get(layer.magicName) ?? [];
    rects.push(rect);
    layerRects.set(layer.magicName, rects);
    if (rect.y + rect.height > maxY) {
      maxY = rect.y + rect.height;
    }
  }
  const transform = {
    scaleX: scale,
    scaleY: mirrorY ? -scale : scale,
    translateX: 0,
    translateY: mirrorY ? -maxY : 0,
  };
  for (const [layerName, rects] of layerRects.entries()) {
    result.push(`<< ${layerName} >>`);
    for (const rect of rects) {
      result.push(`rect ${magicRect(rect, transform)}`);
      if (rect.label != null) {
        labels.push({ layerName, rect });
      }
    }
  }
  result.push('<< labels >>');
  let portIndex = 1;
  for (const { layerName, rect } of labels) {
    if (rect.label == null) {
      continue;
    }
    result.push(
      `flabel ${layerName} s ${magicRect(rect, transform)} 0 FreeSans 240 90 0 0 ${rect.label}`,
    );
    result.push(`port ${portIndex} nsew signal output`);
    portIndex++;
  }
  result.push('<< end >>');

  return result.join('\n');
}
