// SPDX-License-Identifier: Apache-2.0

import { FormControl, InputLabel, MenuItem, Select } from '@suid/material';
import { createSignal, For } from 'solid-js';
import { loadPreset } from '~/model/layout';
import { basename } from '~/utils/files';

export default function Presets() {
  const [value, setValue] = createSignal('');
  const pages = import.meta.glob('~/../presets/*.json', { eager: true });
  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <InputLabel id="preset-select-label">Preset</InputLabel>
      <Select
        labelId="preset-select-label"
        label="Preset"
        value={value()}
        onChange={(e) => {
          const selected = (e.target as HTMLSelectElement).value;
          setValue(selected);
          if (selected !== '') {
            loadPreset(pages[selected] as any);
          }
        }}
      >
        <MenuItem value="">(none)</MenuItem>
        <For each={Object.keys(pages)}>
          {(name) => <MenuItem value={name}>{basename(name)}</MenuItem>}
        </For>
      </Select>
    </FormControl>
  );
}
