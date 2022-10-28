import { createSignal } from 'solid-js';
import { IDRCItem, parseMagicDRC } from '~/model/drc';
import { layout } from '~/model/layout';
import { toMagic } from '~/model/magic';
import { setSpiceInput } from '~/model/spiceFile';
import { downloadFile } from '~/utils/download-file';
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
  const [tech, setTech] = createSignal<'sky130A' | 'sample_6m'>('sample_6m');

  return (
    <>
      <Palette />
      <Editor />
      <div>
        Tech:{' '}
        <label>
          <input type="radio" checked={tech() === 'sky130A'} onClick={() => setTech('sky130A')} />{' '}
          sky130A
        </label>{' '}
        <label>
          <input
            type="radio"
            checked={tech() === 'sample_6m'}
            onClick={() => setTech('sample_6m')}
          />{' '}
          sample_6m
        </label>
      </div>
      <button
        onClick={() => {
          downloadFile('siliwiz.mag', toMagic(layout));
        }}
      >
        Download magic
      </button>
      &nbsp;
      <button
        onClick={async () => {
          setDRC(undefined);
          const start = new Date().getTime();
          const magic = toMagic(layout, tech());
          const res = await fetch(serverUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ magicFile: magic, tech: tech() }),
          });
          const data: IMagicResponse = await res.json();
          setDRC(parseMagicDRC(data.magicOutput));
          setSpiceInput(data.spiceFile);
          console.log('Download time:', new Date().getTime() - start, 'ms');
        }}
      >
        Magic DRC + Extract spice
      </button>
      <DRCList drc={drc()} />
    </>
  );
}
