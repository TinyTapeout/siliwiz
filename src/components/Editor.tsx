// SPDX-License-Identifier: Apache-2.0

import { Redo, Undo } from '@suid/icons-material';
import { Button, IconButton, TextField } from '@suid/material';
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
import { createSignal } from 'solid-js';

export default function Editor() {
  const [projectName, setProjectName] = createSignal('my-siliwiz-project');

  const loadDesign = async () => {
    const files = await openFiles({ accept: ['application/json'] });
    const text = await files?.item(0)?.text();
    const filename = files?.item(0)?.name;

    if (text == null || filename == null) {
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
    setProjectName(filename.toString().substring(0, filename.lastIndexOf('.')));
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
      projectName().concat('.json'),
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

  const saveSTL = () => {
    exportSTL(projectName());
  };

  const clear = () => {
    setLayout('rects', []);
    setSelectedRectIndex(null);
  };

  const canvasSize = () => 2;

  return (
    <div>
      <div>
        <Presets />
        &nbsp;
        <TextField
          id="project-name-label"
          label="Project Name"
          size="small"
          value={projectName()}
          onChange={(e) => {
            setProjectName(e.target.value);
          }}
          error={projectName() === ''}
          helperText={projectName() === '' ? 'Cannot be empty!' : ''}
        />
        <br />
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
        <Button onClick={saveDesign} disabled={projectName() === ''}>
          Save
        </Button>
        &nbsp;
        <Button onClick={clear}>Clear</Button>
        &nbsp;
        <Button onClick={saveSTL} disabled={projectName() === ''}>
          STL
        </Button>
      </div>
      <div style={{ display: 'flex', 'margin-top': '12px' }}>
        <Canvas size={canvasSize() * 200} />
        <CrossSectionSlider />
      </div>
    </div>
  );
}
