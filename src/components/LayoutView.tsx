import { createSignal } from 'solid-js';
import { IDRCItem, parseMagicDRC } from '~/model/drc';
import { layout } from '~/model/layout';
import { defaultTech, toMagic } from '~/model/magic';
import { setSpiceInput } from '~/model/spiceFile';
import DRCList from './DRCList';
import Editor from './Editor';
import Palette from './Palette';

const serverUrl = 'https://siliwiz-server-73miufol2q-uc.a.run.app/magic';
// const serverUrl = 'http://localhost:8086/magic';

interface IMagicResponse {
  spiceFile: string;
  magicOutput: string;
}

export default function LayoutView() {
  const [drc, setDRC] = createSignal<IDRCItem[] | undefined>();

  return (
    <>
      <Palette />
      <Editor />
      <div style={{ 'margin-top': '8px' }}>
        <button
          onClick={async () => {
            setDRC(undefined);
            const start = new Date().getTime();
            const magic = toMagic(layout);
            const res = await fetch(serverUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ magicFile: magic, tech: defaultTech }),
            });
            const data: IMagicResponse = await res.json();
            setDRC(parseMagicDRC(data.magicOutput));
            setSpiceInput(data.spiceFile);
            console.log('Download time:', new Date().getTime() - start, 'ms');
          }}
        >
          Magic DRC + Extract spice
        </button>
      </div>
      <DRCList drc={drc()} />
    </>
  );
}
