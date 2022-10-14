import { ILayout } from '~/model/layout';
import { layerTypes } from './layerTypes';

export function toMagic(layout: ILayout) {
  const result = [
    `magic`,
    `tech sky130A`,
    `magscale 1 2`,
    `timestamp ${Math.floor(new Date().getTime() / 1000)}`,
  ];
  for (const layer of layerTypes) {
    const rects = layout.rects.filter((r) => r.layer === layer.name);
    if (rects.length) {
      result.push(`<< ${layer.magicName} >>`);
      for (const rect of rects) {
        result.push(`rect ${rect.x} ${rect.y} ${rect.x + rect.width} ${rect.y + rect.height}`);
      }
    }
  }
  result.push('<< end >>');

  return result.join('\n');
}
