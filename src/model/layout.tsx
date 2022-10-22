import { createStore } from 'solid-js/store';
import { record } from 'solid-record';
import { layerTypes } from './layerTypes';

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
    rects: [
      { x: 0, y: 0, width: 200, height: 200, layer: 'P SUB' },
      { x: 70, y: 80, width: 60, height: 40, layer: 'N DIFF' },
      { x: 90, y: 60, width: 20, height: 80, layer: 'POLY', label: 'C' },
      { x: 60, y: 90, width: 20, height: 20, layer: 'CONTACT', label: 'A' },
      { x: 120, y: 90, width: 20, height: 20, layer: 'CONTACT', label: 'B' },
    ],
  }),
);
