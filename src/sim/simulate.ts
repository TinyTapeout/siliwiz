import { setSimulationResult } from '~/model/simulationResult';
import { createSpice } from './spice/createSpice';
import init, { XenaUi } from 'wasm_xena_lite';
import { spiceFile } from '~/model/spiceFile';

const spicePromise = createSpice();

async function simulate_spice(spiceFile: string) {
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

async function createXena() {
  await init();
  return XenaUi.new();
}
const xenaPromise = createXena();

async function simulate_xena(spiceFile: string) {
  setSimulationResult([]);
  const xenaUi = await xenaPromise;
  const s = xenaUi.parse_cir(spiceFile, 0, 0);
  const start = new Date().getTime();
  const content = xenaUi.solve();
  console.log(`Simulation duration: ${new Date().getTime() - start}ms`);
  const newData: number[][] = [];
  for (const line of content.split('\n').slice(2)) {
    const parts = line.trim().split(/\s+/);
    newData.push([parseFloat(parts[0]), parseFloat(parts[3]), parseFloat(parts[4])]);
  }
  setSimulationResult(newData);
}

export async function simulate(spiceFile: string) {
  simulate_xena(spiceFile);
}