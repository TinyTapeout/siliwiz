import { createSignal, lazy, Show, Suspense } from 'solid-js';
import { layout, layoutUndo, setLayout } from '~/model/layout';
import { downloadFile } from '~/utils/download-file';
import { openFiles } from '~/utils/files';
import { tryJsonParse } from '~/utils/json';
import Canvas from './Canvas';
import CrossSection from './CrossSection';
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

  const clear = () => {
    setLayout('rects', []);
  };

  const canvasSize = () => 2;
  const [activeTab, setActiveTab] = createSignal('graph');

  const Graph = lazy(() => import('./Graph'));

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
        <Canvas size={canvasSize() * 200} />
        <div>
          <div style={{ 'padding-left': '32px' }}>
            <button onclick={() => setActiveTab('graph')}>Graph</button>&nbsp;
            <button onclick={() => setActiveTab('xsection')}>Cross Section</button>
          </div>
          <Show when={activeTab() === 'graph'}>
            <Suspense fallback={<div>Loading graph...</div>}>
              <Graph />
            </Suspense>
            <div style={{ 'padding-left': '32px' }}>
              <SimulationParams />
            </div>
          </Show>

          <Show when={activeTab() === 'xsection'}>
            <CrossSection height={canvasSize() * 200} />
          </Show>
        </div>
      </div>
    </>
  );
}
