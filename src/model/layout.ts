// SPDX-License-Identifier: Apache-2.0

import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { record } from 'solid-record';
import inverter from '~/../presets/inverter.json';
import { layerTypes } from './layerTypes';
import { type ISpiceParams, setSpiceParams } from './spiceFile';

export const lambdaToMicrons = 0.09;

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

export function rectsOverlap(a: ILayoutRect, b: ILayoutRect) {
  return a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height;
}

export function rectLayer(rect: Pick<ILayoutRect, 'layer'>) {
  return layerTypes.find((l) => l.name === rect.layer);
}

export function rectUnmergedLayer(layout: ILayout, rect: ILayoutRect) {
  const baseLayer = rectLayer(rect);
  if (baseLayer?.contactName == null) {
    return baseLayer;
  }

  const candidateLayers = layerTypes.filter((l) => l.contactName === baseLayer.name).reverse();
  const intersectingLayers = new Set<string>();
  for (const otherRect of layout.rects) {
    if (rectsOverlap(rect, otherRect) && otherRect.layer) {
      intersectingLayers.add(otherRect.layer);
    }
  }

  for (const candidateLayer of candidateLayers) {
    if (
      candidateLayer.contactDepends != null &&
      intersectingLayers.has(candidateLayer.contactDepends)
    ) {
      return candidateLayer;
    }
  }

  return baseLayer;
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

export const [selectedRectIndex, setSelectedRectIndex] = createSignal<number | null>(null);
export const [layout, setLayout, layoutUndo] = record(
  // eslint-disable-next-line solid/reactivity
  createStore<ILayout>({
    rects: inverter.rects,
  }),
);

export interface ILayoutSnapshot {
  rects?: ILayoutRect[];
  graph?: Partial<ISpiceParams>;
}

export function loadPreset(preset: ILayoutSnapshot) {
  setLayout('rects', preset?.rects ?? []);
  setSpiceParams(preset?.graph ?? {});
  setSelectedRectIndex(null);
}
