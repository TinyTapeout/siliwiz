import { createEffect, createSignal, Show } from 'solid-js';
import { IDRCItem } from '~/model/drc';
import { layout } from '~/model/layout';
import { runMagic } from '~/model/runMagic';
import DRCList from './DRCList';
import Editor from './Editor';
import Palette from './Palette';

export default function LayoutView() {
  const [drc, setDRC] = createSignal<IDRCItem[] | undefined>();
  const [updating, setUpdating] = createSignal(false);

  const update = async () => {
    setDRC(undefined);
    setUpdating(true);
    const drc = await runMagic(layout);
    setUpdating(false);
    setDRC(drc);
  };

  createEffect(update);

  return (
    <>
      <Palette />
      <Editor />
      <Show when={updating()}>
        <div style={{ 'margin-top': '16px' }}>⚙️ DRC Updating...</div>
      </Show>
      <DRCList drc={drc()} />
    </>
  );
}
