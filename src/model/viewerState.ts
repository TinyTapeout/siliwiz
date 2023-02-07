// SPDX-License-Identifier: Apache-2.0

import { createStore } from 'solid-js/store';

export interface IViewerState {
  crossSectionOffset: number;
  activeLayer?: string;
  hiddenLayers: string[];

  readonly crossSectionY: number;
}

export const [viewerState, setViewerState] = createStore<IViewerState>({
  crossSectionOffset: 100,
  hiddenLayers: [],

  get crossSectionY() {
    return this.crossSectionOffset;
  },
});

export const isLayerVisible = (layer: string) => !viewerState.hiddenLayers.includes(layer);
