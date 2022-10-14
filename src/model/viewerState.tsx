import { createStore } from 'solid-js/store';

export interface IViewerState {
  crossSectionOffset: number;
  activeLayer?: string;
  hiddenLayers: string[];

  readonly crossSectionY: number;
}

export const [viewerState, setViewerState] = createStore<IViewerState>({
  crossSectionOffset: 50,
  hiddenLayers: [],

  get crossSectionY() {
    return this.crossSectionOffset * 2;
  },
});
