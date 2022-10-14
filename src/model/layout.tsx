import { createStore } from 'solid-js/store';

export interface ILayoutRect {
  x: number;
  y: number;
  width: number;
  height: number;
  layer: string;
}

export const [layout, setLayout] = createStore({
  rects: [
    { x: 0, y: 0, width: 200, height: 200, layer: 'P SUB' },
    { x: 70, y: 80, width: 60, height: 40, layer: 'N DIFF' },
    { x: 90, y: 60, width: 20, height: 80, layer: 'POLY' },
    { x: 60, y: 90, width: 20, height: 20, layer: 'CONTACT' },
    { x: 120, y: 90, width: 20, height: 20, layer: 'CONTACT' },
  ] as ILayoutRect[],
});
