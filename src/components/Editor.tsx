// SPDX-License-Identifier: Apache-2.0

import { Redo, Undo } from '@suid/icons-material';
import { Button, IconButton } from '@suid/material';
import beautify from 'json-beautify';
import { layout, layoutUndo, loadPreset, setLayout, setSelectedRectIndex } from '~/model/layout';
import { getSpiceParams } from '~/model/spiceFile';
import { exportSTL } from '~/model/stl';
import { downloadFile } from '~/utils/download-file';
import { openFiles } from '~/utils/files';
import { tryJsonParse } from '~/utils/json';
import { round2dp } from '~/utils/math';
import Canvas from './Canvas';
import CrossSectionSlider from './CrossSectionSlider';
import Presets from './Presets';

export default function Editor() {
  const loadDesign = async () => {
    const files = await openFiles({ accept: ['application/json'] });
    const text = await files?.item(0)?.text();
    if (text == null) {
      return;
    }
    const frozenLayout = tryJsonParse(text);
    if (frozenLayout == null) {
      alert('Error: unsupported file format');
    }
    if (frozenLayout.version !== 1 || frozenLayout.app !== 'siliwiz') {
      alert('Error: unsupported file version');
    }
    loadPreset(frozenLayout);
  };

  const saveDesign = () => {
    const rects = layout.rects
      .filter((rect) => rect.width > 0 && rect.height > 0)
      .map((rect) => ({
        ...rect,
        x: round2dp(rect.x),
        y: round2dp(rect.y),
        width: round2dp(rect.width),
        height: round2dp(rect.height),
      }));
    downloadFile(
      'siliwiz-design.json',
      beautify(
        {
          version: 1,
          app: 'siliwiz',
          timestamp: Math.floor(new Date().getTime() / 1000),
          rects,
          graph: getSpiceParams(),
        },
        null as any,
        2,
        100,
      ) + '\n',
    );
  };

  const clear = () => {
    setLayout('rects', []);
    setSelectedRectIndex(null);
  };

  const canvasSize = () => 2;

  return (
    <div>
      <div style={{ margin: '16px 0 8px' }}>
        <IconButton
          onClick={() => layoutUndo.undo()}
          disabled={!layoutUndo.isUndoable()}
          title="Undo"
        >
          <Undo />
        </IconButton>
        &nbsp;
        <IconButton
          onClick={() => layoutUndo.redo()}
          disabled={!layoutUndo.isRedoable()}
          title="Redo"
        >
          <Redo />
        </IconButton>
        &nbsp;
        <Button onClick={loadDesign}>Load</Button>
        &nbsp;
        <Button onClick={saveDesign}>Save</Button>
        &nbsp;
        <Button onClick={clear}>Clear</Button>
        &nbsp;
        <Button onClick={exportSTL}>STL</Button>
        <br />
        <Presets />
      </div>
      <div style={{ display: 'flex' }}>
        <Canvas size={canvasSize() * 200} />
        <CrossSectionSlider />
      </div>
    </div>
  );
}
