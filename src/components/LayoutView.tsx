// SPDX-License-Identifier: Apache-2.0

import { Box, Button, ButtonGroup, Paper } from '@suid/material';
import { createEffect, createSignal, lazy, Show, Suspense } from 'solid-js';
import type { IDRCItem } from '~/model/drc';
import { layout } from '~/model/layout';
import { runMagic } from '~/model/runMagic';
import CrossSection from './CrossSection';
import DRCList from './DRCList';
import Editor from './Editor';
import Layers from './Layers';
import SimulationParams from './SimulationParams';

type ITabName = 'xsection' | 'simulation';

export default function LayoutView() {
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

  return (
    <Box sx={{ display: 'flex' }}>
      <Layers />
      <Paper sx={{ padding: 1, marginRight: 1 }}>
        <Editor />
      </Paper>
      <Paper sx={{ padding: 1 }}>
        <ButtonGroup>
          <Button
            onClick={() => setActiveTab('xsection')}
            variant={activeTab() === 'xsection' ? 'contained' : 'outlined'}
          >
            Cross Section
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
          <Show when={updating()}>
            <div style={{ 'margin-top': '16px' }}>⚙️ DRC Updating...</div>
          </Show>
          <DRCList drc={drc()} />
        </Show>
      </Paper>
    </Box>
  );
}
