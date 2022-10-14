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
    </>
  );
}
