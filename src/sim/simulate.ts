import { setSimulationResult } from '~/model/simulationResult';
import { createSpice } from './spice/createSpice';

const spicePromise = createSpice();

export async function simulate(spiceFile: string) {
  const spiceController = await spicePromise;
  const start = new Date().getTime();
  setSimulationResult([]);
  spiceController.writeFile('/siliwiz.cir', spiceFile);
  spiceController.run([
    'source siliwiz.cir',
    'run',
    'set wr_singlescale',
    'set wr_vecnames',
    'wrdata siliwiz.txt in out',
  ]);
  const file = spiceController.readFile('siliwiz.txt');
  const content = new TextDecoder().decode(file);
  const newData: number[][] = [];
  for (const line of content.split('\n').slice(1)) {
    const parts = line.trim().split(/\s+/);
    newData.push([parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2])]);
  }
  setSimulationResult(newData);
  console.log(`Simulation duration: ${new Date().getTime() - start}ms`);
}
