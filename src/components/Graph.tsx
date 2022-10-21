import { react } from 'plotly.js-basic-dist';
import { createEffect, createSignal, onMount } from 'solid-js';
import { simulationResult } from '~/model/simulationResult';

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
    };

    createEffect(() => {
      if (!graphDiv) {
        return;
      }
      const table = simulationResult();

      react(
        graphDiv,
        [
          {
            x: table.map((row) => row[0]),
            y: table.map((row) => row[1]),
            name: 'IN',
            type: 'scatter',
          },
          {
            x: table.map((row) => row[0]),
            y: table.map((row) => row[2]),
            name: 'OUT',
            type: 'scatter',
          },
        ],
        layout,
      );
    });
  });
  return <div ref={graphDiv} style={{ width: '400px', height: '400px' }} />;
}
