import { layoutUndo } from '~/model/layout';
import Canvas from './Canvas';
import CrossSection from './CrossSection';

export default function Editor() {
  return (
    <>
      <div style={{ 'margin-top': '16px' }}>
        <button onClick={() => layoutUndo.undo()} disabled={!layoutUndo.isUndoable()}>
          Undo
        </button>&nbsp;
        <button onClick={() => layoutUndo.redo()} disabled={!layoutUndo.isRedoable()}>
          Redo
        </button>
      </div>
      <div style={{ display: 'flex' }}>
        <Canvas />
        <CrossSection />
      </div>
    </>
  );
}
