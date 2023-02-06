// SPDX-License-Identifier: Apache-2.0

import { Checkbox } from '@suid/material';
import { For } from 'solid-js';
import { layerTypes } from '~/model/layerTypes';
import { setViewerState, viewerState } from '~/model/viewerState';
import styles from './Palette.module.css';
import { Visibility, VisibilityOff } from '@suid/icons-material';

function paletteLayers() {
  return layerTypes.filter((l) => l.contactName == null || l.contactDefault);
}

export default function Palette() {
  return (
    <div class={styles.palette}>
      <For each={paletteLayers()}>
        {(layer) => (
          <div
            classList={{
              [styles.item]: true,
              [styles.active]: viewerState.activeLayer === layer.name,
            }}
            title={layer.description}
            onClick={() => {
              setViewerState('activeLayer', layer.name);
            }}
          >
            {viewerState.hiddenLayers.includes(layer.name)}
            <Checkbox
              sx={{ p: 0.5 }}
              color="default"
              icon={<VisibilityOff />}
              checkedIcon={<Visibility />}
              checked={!viewerState.hiddenLayers.includes(layer.name)}
              onChange={(e, checked) => {
                e.stopPropagation();
                setViewerState('hiddenLayers', (hiddenLayers) => {
                  if (checked) {
                    return hiddenLayers.filter((l) => l !== layer.name);
                  } else {
                    return !hiddenLayers.includes(layer.name)
                      ? [...hiddenLayers, layer.name]
                      : hiddenLayers;
                  }
                });
              }}
            />
            <span class={styles.color} style={{ background: layer.color }} />
            &nbsp;
            <span>{layer.name}</span>
          </div>
        )}
      </For>
    </div>
  );
}
