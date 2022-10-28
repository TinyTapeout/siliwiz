import { layout, layoutUndo, setLayout } from '~/model/layout';
import { downloadFile } from '~/utils/download-file';
import { openFiles } from '~/utils/files';
import { tryJsonParse } from '~/utils/json';
import Canvas from './Canvas';
import CrossSection from './CrossSection';

export default function Editor() {
  const loadDesign = async () => {
    const files = await openFiles({ accept: ['application/json'] });
    const text = await files?.item(0)?.text();
    if (!text) {
      return;
    }
    const frozenLayout = tryJsonParse(text);
    if (!frozenLayout) {
      alert('Error: unsupported file format');
    }
    if (frozenLayout.version !== 1 || frozenLayout.app !== 'siliwiz') {
      alert('Error: unsupported file version');
    }
    if (frozenLayout.rects) {
      setLayout('rects', frozenLayout.rects);
    }
  };

  const saveDesign = () => {
    downloadFile(
      'siliwiz-design.json',
      JSON.stringify({
        version: 1,
        app: 'siliwiz',
        timestamp: Math.floor(new Date().getTime() / 1000),
        rects: layout.rects,
      }),
    );
  };

  return (
    <>
      <div style={{ 'margin-top': '16px' }}>
        <button onClick={() => layoutUndo.undo()} disabled={!layoutUndo.isUndoable()}>
          Undo
        </button>
        &nbsp;
        <button onClick={() => layoutUndo.redo()} disabled={!layoutUndo.isRedoable()}>
          Redo
        </button>
        &nbsp;
        <button onClick={loadDesign}>Load</button>
        &nbsp;
        <button onClick={saveDesign}>Save</button>
      </div>
      <div style={{ display: 'flex' }}>
        <Canvas />
        <CrossSection />
      </div>
    </>
  );
}
