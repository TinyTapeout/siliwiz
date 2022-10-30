import { For } from 'solid-js';
import { layerTypes } from '~/model/layerTypes';
import { setViewerState, viewerState } from '~/model/viewerState';
import styles from './Palette.module.css';

export default function Palette() {
  return (
    <div class={styles.palette}>
      <For each={layerTypes}>
        {(layer) => (
          <div
            classList={{
              [styles.item]: true,
              [styles.active]: viewerState.activeLayer == layer.name,
            }}
            title={layer.description}
            onClick={() => {
              setViewerState('activeLayer', layer.name);
            }}
          >
            <input
              type="checkbox"
              checked={!viewerState.hiddenLayers.includes(layer.name)}
              onChange={(e) =>
                setViewerState('hiddenLayers', (hiddenLayers) => {
                  const { checked } = e.target as HTMLInputElement;
                  if (checked) {
                    return hiddenLayers.filter((l) => l !== layer.name);
                  } else {
                    return !hiddenLayers.includes(layer.name)
                      ? [...hiddenLayers, layer.name]
                      : hiddenLayers;
                  }
                })
              }
            />
            <span class={styles.color} style={{ background: layer.color }} />
            <span>{layer.name}</span>
          </div>
        )}
      </For>
    </div>
  );
}
