import { lazy, Suspense } from 'solid-js';
import { layout, layoutUndo, setLayout, setSelectedRectIndex } from '~/model/layout';
import { getSpiceParams, setSpiceParams } from '~/model/spiceFile';
import { downloadFile } from '~/utils/download-file';
import { openFiles } from '~/utils/files';
import { tryJsonParse } from '~/utils/json';
import CrossSection from './CrossSection';
import CrossSectionSlider from './CrossSectionSlider';
import Presets from './Presets';
import SimulationParams from './SimulationParams';

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
    setLayout('rects', frozenLayout.rects ?? []);
    setSpiceParams(frozenLayout.graph ?? {});
    setSelectedRectIndex(null);
  };

  const saveDesign = () => {
    downloadFile(
      'siliwiz-design.json',
      JSON.stringify({
        version: 1,
        app: 'siliwiz',
        timestamp: Math.floor(new Date().getTime() / 1000),
        rects: layout.rects,
        graph: getSpiceParams(),
      }),
    );
  };

  const clear = () => {
    setLayout('rects', []);
    setSelectedRectIndex(null);
  };

  const canvasSize = () => 2;

  const Graph = lazy(() => import('./Graph'));
  const Canvas = lazy(() => import('./Canvas'));

  return (
    <>
      <div style={{ margin: '16px 0 8px' }}>
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
        &nbsp;
        <button onClick={clear}>Clear</button>
        &nbsp;
        <Presets />
      </div>
      <div style={{ display: 'flex' }}>
        <Suspense
          fallback={
            <div
              style={{
                width: '400px',
                height: '400px',
                'line-height': '400px',
                'text-align': 'center',
              }}
            >
              Loading...
            </div>
          }
        >
          <Canvas size={canvasSize() * 200} />
        </Suspense>
        <CrossSectionSlider />
        <div>
          <Suspense fallback={<div>Loading graph...</div>}>
            <Graph />
          </Suspense>
          <div style={{ 'padding-left': '32px' }}>
            <SimulationParams />
          </div>
        </div>
      </div>
      <div>
        <CrossSection />
      </div>
    </>
  );
}
