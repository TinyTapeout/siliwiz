// SPDX-License-Identifier: Apache-2.0

import { For } from 'solid-js';
import { loadPreset } from '~/model/layout';
import { basename } from '~/utils/files';

export default function Presets() {
  const pages = import.meta.glob('~/../presets/*.json', { eager: true });
  return (
    <>
      Preset:{' '}
      <select
        onChange={(e) => {
          const selected = (e.target as HTMLSelectElement).value;
          if (selected !== '') {
            loadPreset(pages[selected] as any);
          }
        }}
      >
        <option value="" />
        <For each={Object.keys(pages)}>
          {(name) => <option value={name}>{basename(name)}</option>}
        </For>
      </select>
    </>
  );
}
