import { createStore } from 'solid-js/store';
import { record } from 'solid-record';
import { layerTypes } from './layerTypes';
import { fromMagic } from './magic';
import inverter from '~/../presets/inverter.json';

export interface ILayoutRect {
  x: number;
  y: number;
  width: number;
  height: number;
  layer: string;
  label?: string;
}

export interface ILayout {
  rects: ILayoutRect[];
}

export function rectLayer(rect: Pick<ILayoutRect, 'layer'>) {
  return layerTypes.find((l) => l.name === rect.layer);
}

export function sortRects(rects: ILayoutRect[]) {
  return rects.sort((a, b) => {
    const layerA = layerTypes.findIndex((l) => l.name === a.layer);
    const layerB = layerTypes.findIndex((l) => l.name === b.layer);
    if (layerA == null || layerB == null) {
      return 0;
    }
    return layerA - layerB;
  });
}

export const [layout, setLayout, layoutUndo] = record(
  createStore<ILayout>({
    rects: inverter.rects,
  }),
);
