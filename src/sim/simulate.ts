// SPDX-License-Identifier: Apache-2.0

import { setSimulationResult } from '~/model/simulationResult';
import { createSpice } from './spice/createSpice';

const spicePromise = createSpice();

/**
 * This counter is used to prevent a race condition where older calls to `simulate()` return after newer calls finished, thus
 * displaying outdated results.
 */
let simulationCounter = 0;

export async function simulate(spiceFile: string, signalNames: string) {
  simulationCounter++;
  let currentSimulationIndex = simulationCounter;
  const spiceController = await spicePromise;
  const start = new Date().getTime();
  setSimulationResult([]);
  spiceController.writeFile('siliwiz.txt', '');
  spiceController.writeFile('/siliwiz.cir', spiceFile);
  spiceController.run([
    'source siliwiz.cir',
    'run',
    'set wr_singlescale',
    'set wr_vecnames',
    `wrdata siliwiz.txt ${signalNames}`,
  ]);
  const file = spiceController.readFile('siliwiz.txt');
  const content = new TextDecoder().decode(file);
  const newData: number[][] = [];
  for (const line of content.split('\n').slice(1)) {
    const parts = line.trim().split(/\s+/);
    newData.push(parts.map((item) => parseFloat(item)));
  }
  console.log(`Simulation duration: ${new Date().getTime() - start}ms`);
  if (currentSimulationIndex === simulationCounter) {
    setSimulationResult(newData);
  } else {
    console.log('Old simulation result discarded.');
  }
}
