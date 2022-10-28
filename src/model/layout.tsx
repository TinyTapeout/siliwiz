import { createStore } from 'solid-js/store';
import { record } from 'solid-record';
import { layerTypes } from './layerTypes';
import { fromMagic } from './magic';

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

const inverter = `magic
tech sample_6m
timestamp 1666617554
<< nwell >>
rect -12 14 13 41
<< ndiffusion >>
rect 0 2 2 7
rect -1 2 0 7
rect 2 2 3 7
<< pdiffusion >>
rect 0 19 2 24
rect -1 19 0 24
rect 2 19 3 24
<< ndcontact >>
rect -6 2 -1 7
rect 3 2 8 7
<< pdcontact >>
rect -6 19 -1 24
rect 3 19 8 24
<< psubstratepcontact >>
rect -6 -13 8 -8
<< nsubstratencontact >>
rect -6 34 8 39
<< polysilicon >>
rect 0 2 2 7
rect 0 19 2 24
rect 0 24 2 27
rect 0 15 2 19
rect -3 11 2 15
rect 0 7 2 11
rect 0 -1 2 2
<< polycontact >>
rect -7 11 -3 15
<< metal1 >>
rect -12 34 -6 39
rect 8 34 13 39
rect -6 24 -1 34
rect 3 15 8 19
rect -12 11 -7 15
rect 3 11 13 15
rect 3 7 8 11
rect -6 -8 -1 2
rect -12 -13 -6 -8
rect 8 -13 13 -8
<< labels >>
flabel metal1 -12 11 -8 15 0 FreeSans 18 0 0 0 in
port 0 nsew
flabel metal1 9 11 13 15 0 FreeSans 18 0 0 0 out
port 1 nsew
flabel metal1 -12 -13 -7 -8 0 FreeSans 18 0 0 0 vss
port 3 nsew
flabel metal1 -12 34 -7 39 0 FreeSans 18 0 0 0 vdd
port 2 nsew
<< end >>
`;

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
    rects: [
      { x: 0, y: 0, width: 200, height: 200, layer: 'P SUB' },
      // { x: 70, y: 80, width: 60, height: 40, layer: 'N DIFF' },
      // { x: 90, y: 60, width: 20, height: 80, layer: 'POLY', label: 'C' },
      // { x: 60, y: 90, width: 20, height: 20, layer: 'CONTACT', label: 'A' },
      // { x: 120, y: 90, width: 20, height: 20, layer: 'CONTACT', label: 'B' },

      ...fromMagic(inverter, { x: 100, y: 140 }, 3).rects,
    ],
  }),
);
