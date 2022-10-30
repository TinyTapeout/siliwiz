import { For } from 'solid-js';
import { setLayout } from '~/model/layout';
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
            setLayout('rects', (pages[selected] as any)?.rects ?? []);
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
