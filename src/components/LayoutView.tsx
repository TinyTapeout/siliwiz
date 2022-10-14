import { layout } from '~/model/layout';
import { toMagic } from '~/model/toMagic';
import { downloadFile } from '~/utils/download-file';
import Editor from './Editor';
import Palette from './Palette';

export default function LayoutView() {
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
      <button
        onClick={async () => {
          const magic = toMagic(layout)
          const res = await fetch('https://siliwiz-server-73miufol2q-uc.a.run.app/magic', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({magicFile :magic})})
          const data = await res.json()
          console.log(data)
          downloadFile('siliwiz.spice', data.spiceFile);
        }}
      >
        Download SPICE
      </button>
    </>
  );
}
