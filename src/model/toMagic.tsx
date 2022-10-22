import { ILayout, ILayoutRect } from '~/model/layout';
import { layerTypes } from './layerTypes';

function magicRect(rect: ILayoutRect) {
  const x = Math.round(rect.x);
  const y = Math.round(rect.y);
  const width = Math.round(rect.x + rect.width);
  const height = Math.round(rect.y + rect.height);
  return `${x} ${y} ${width} ${height}`;
}

export function toMagic(layout: ILayout, tech: string = `sky130A`) {
  const result = [
    `magic`,
    `tech ${tech}`,
    `magscale 1 ${tech === 'sky130A' ? 2 : 1}`,
    `timestamp ${Math.floor(new Date().getTime() / 1000)}`,
  ];
  for (const layer of layerTypes) {
    const rects = layout.rects.filter((r) => r.layer === layer.name);
    if (rects.length) {
      result.push(`<< ${layer.magicName} >>`);
      for (const rect of rects) {
        result.push(`rect ${magicRect(rect)}`);
      }
    }
  }
  result.push('<< labels >>');
  let portIndex = 1;
  for (const rect of layout.rects) {
    if (rect.label) {
      result.push(`flabel metal1 s ${magicRect(rect)} 0 FreeSans 240 90 0 0 ${rect.label}`);
      result.push(`port ${portIndex} nsew signal output`);
      portIndex++;
    }
  }
  result.push('<< end >>');

  return result.join('\n');
}
