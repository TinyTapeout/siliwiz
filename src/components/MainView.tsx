// SPDX-License-Identifier: Apache-2.0

import { Check, Error } from '@suid/icons-material';
import { Box, Button, ButtonGroup, Paper, Typography } from '@suid/material';
import { createEffect, createSignal, lazy, Show, Suspense } from 'solid-js';
import type { IDRCItem } from '~/model/drc';
import { layout } from '~/model/layout';
import { runMagic } from '~/model/runMagic';
import CrossSection from './CrossSection';
import DRCList from './DRCList';
import Editor from './Editor';
import Layers from './Layers';
import Isometric from './Isometric';
import SimulationParams from './SimulationParams';

type ITabName = 'xsection' | 'simulation' | '3d';

export default function MainView() {
  const [drc, setDRC] = createSignal<IDRCItem[] | undefined>();
  const [updating, setUpdating] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal<ITabName>('simulation');

  const update = async () => {
    setDRC(undefined);
    setUpdating(true);
    const drc = await runMagic(layout);
    setUpdating(false);
    setDRC(drc);
  };

  createEffect(update);

  const Graph = lazy(() => import('./Graph'));
  const hasDRCErrors = () => {
    const drcList = drc();
    return drcList && drcList.length > 0;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Layers />
      <Paper sx={{ padding: 1, marginRight: 1 }}>
        <Editor />
      </Paper>
      <Paper sx={{ padding: 1 }}>
        <ButtonGroup>
          <Button
            onClick={() => setActiveTab('3d')}
            variant={activeTab() === '3d' ? 'contained' : 'outlined'}
          >
            3D
          </Button>
          <Button
            onClick={() => setActiveTab('xsection')}
            endIcon={hasDRCErrors() ? <Error /> : <Check />}
            color={hasDRCErrors() ? 'error' : 'primary'}
            variant={activeTab() === 'xsection' ? 'contained' : 'outlined'}
          >
            Cross Section &amp; DRC
          </Button>
          <Button
            onClick={() => setActiveTab('simulation')}
            variant={activeTab() === 'simulation' ? 'contained' : 'outlined'}
          >
            Simulation
          </Button>
        </ButtonGroup>
        <Show when={activeTab() === 'simulation'}>
          <Suspense fallback={<div>Loading graph...</div>}>
            <Graph />
          </Suspense>
          <div style={{ 'padding-left': '32px' }}>
            <SimulationParams />
          </div>
        </Show>
        <Show when={activeTab() === 'xsection'}>
          <CrossSection />
          <Box sx={{ marginTop: 2 }} />
          <Show when={updating()}>
            <Typography>⚙️ DRC Updating...</Typography>
          </Show>
          <DRCList drc={drc()} />
        </Show>
        <Show when={activeTab() === '3d'}>
          <Isometric />
        </Show>
      </Paper>
    </Box>
  );
}
