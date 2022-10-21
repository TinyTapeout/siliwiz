import { setSimulationResult } from '~/model/simulationResult';
import { createSpice } from './spice/createSpice';

const spicePromise = createSpice();

export function spiceFile(width: number, length: number) {
  return `*SiliWiz Simulation
Vdd dd1 0 5 ; power supply
Vss ss1 0 0 ; measuring the current

* input pulse (select by uncommenting)
*Vin in 0 pulse (0 5 5u 1u 1u 10u 20u) ; several pulses
Vin in 0 pulse (0 5 0 50u 50u 1 1)  ; ramp

MN1 out in ss1 ss1 nch W=${width}u L=${length}u
.model nch NMOS (vto=1 tox=15n cbd=20f cbs=20f gamma=0.37)
MP1 out in dd1 dd1 pch W=${width}u L=${length}u
.model pch PMOS (vto=-1 tox=15n cbd=20f cbs=20f gamma=0.37)

.tran 500n 50u

.end`;
}

export async function simulate(width: number, length: number) {
  const spiceController = await spicePromise;
  const start = new Date().getTime();
  spiceController.writeFile('/siliwiz.cir', spiceFile(width, length));
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
