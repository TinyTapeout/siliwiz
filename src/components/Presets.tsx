import { For } from 'solid-js';
import { setLayout, setSelectedRectIndex } from '~/model/layout';
import { setSpiceParams } from '~/model/spiceFile';
import { basename } from '~/utils/files';

export default function Presets() {
  const pages = import.meta.glob('~/../presets/*.json', { eager: true });
  return (
    <>
      Preset:{' '}
      <select
        onChange={(e) => {
          const selected = (e.target as HTMLSelectElement).value;
          if (selected) {
            const preset = pages[selected] as any;
            setLayout('rects', preset?.rects ?? []);
            setSpiceParams(preset?.graph ?? {});
            setSelectedRectIndex(null);
          }
        }}
      >
        <option></option>
        <For each={Object.keys(pages)}>
          {(name) => <option value={name}>{basename(name)}</option>}
        </For>
      </select>
    </>
  );
}
