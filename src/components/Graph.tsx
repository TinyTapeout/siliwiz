// SPDX-License-Identifier: Apache-2.0

import { react } from 'plotly.js-basic-dist';
import { createEffect, onMount } from 'solid-js';
import { simulationResult } from '~/model/simulationResult';
import { signalNames } from '~/model/spiceFile';

export default function Graph() {
  let graphDiv: HTMLDivElement | undefined;

  onMount(() => {
    const layout = {
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4,
      },
      yaxis: {
        range: [-0.25, 5.25],
      },
    };

    createEffect(() => {
      if (!graphDiv) {
        return;
      }
      const table = simulationResult();
      const signals = signalNames();
      react(
        graphDiv,
        signals.split(' ').map((name, index) => ({
          x: table.map((row) => row[0]),
          y: table.map((row) => row[index + 1]),
          name,
          type: 'scatter',
        })),
        layout,
      );
    });
  });
  return <div ref={graphDiv} style={{ width: '400px', height: '400px' }} />;
}
