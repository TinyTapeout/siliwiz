// SPDX-License-Identifier: Apache-2.0

import { Visibility, VisibilityOff } from '@suid/icons-material';
import { Checkbox, Paper, Typography } from '@suid/material';
import { For } from 'solid-js';
import { LayerCategory, layerTypes } from '~/model/layerTypes';
import { isLayerVisible, setViewerState, viewerState } from '~/model/viewerState';
import styles from './Layers.module.css';

export default function Layers() {
  return (
    <Paper class={styles.layersPanel}>
      <Typography variant="h6" sx={{ p: 1 }}>
        Layers
      </Typography>
      <For each={Object.values(LayerCategory)}>
        {(category) => (
          <>
            <Typography variant="subtitle2" marginTop={1}>
              {category}
            </Typography>
            <For each={layerTypes.filter((l) => l.category === category)}>
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
                  <Checkbox
                    sx={{ p: 0.5 }}
                    color="default"
                    icon={<VisibilityOff />}
                    checkedIcon={<Visibility />}
                    checked={isLayerVisible(layer.name)}
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
          </>
        )}
      </For>
    </Paper>
  );
}
