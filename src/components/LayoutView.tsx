import { createSignal, Show } from 'solid-js';
import { IDRCItem, parseMagicDRC } from '~/model/drc';
import { layout } from '~/model/layout';
import { toMagic } from '~/model/toMagic';
import { downloadFile } from '~/utils/download-file';
import { parseTCLList } from '~/utils/tcl-parser';
import DRCList from './DRCList';
import Editor from './Editor';
import Palette from './Palette';

interface IMagicResponse {
  spiceFile: string;
  magicOutput: string;
}

export default function LayoutView() {
  const [drc, setDRC] = createSignal<IDRCItem[]>([]);

  return (
    <>
      <Palette />
      <Editor />
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
          const start = new Date().getTime();
          const magic = toMagic(layout);
          const res = await fetch('https://siliwiz-server-73miufol2q-uc.a.run.app/magic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ magicFile: magic }),
          });
          const data: IMagicResponse = await res.json();
          setDRC(parseMagicDRC(data.magicOutput));
          console.log('Download time:', new Date().getTime() - start, 'ms');
        }}
      >
        Magic DRC
      </button>
      &nbsp;
      <button
        onClick={async () => {
          const start = new Date().getTime();
          const magic = toMagic(layout);
          const res = await fetch('https://siliwiz-server-73miufol2q-uc.a.run.app/magic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ magicFile: magic }),
          });
          const data: IMagicResponse = await res.json();
          downloadFile('siliwiz.spice', data.spiceFile);
          console.log('Download time:', new Date().getTime() - start, 'ms');
        }}
      >
        Download Extracted Spice
      </button>
      <DRCList drc={drc()} />
    </>
  );
}
