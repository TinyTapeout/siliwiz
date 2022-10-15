import spice from './spice';
import { nfet18 } from './nfet';

export async function simulate(model: string) {
  const module = await spice({
    noInitialRun: true,
    print: (e) => {
      /*do nothing*/
      console.log(e);
    },
    printErr: (e) => {
      console.error(e);
    },
  });
  module.FS?.writeFile('/proc/meminfo', '');
  module.FS?.mkdir('/usr');
  module.FS?.mkdir('/usr/local');
  module.FS?.mkdir('/usr/local/share');
  module.FS?.mkdir('/usr/local/share/ngspice');
  module.FS?.mkdir('/usr/local/share/ngspice/scripts');
  module.FS?.writeFile('/usr/local/share/ngspice/scripts/spinit', '* Standard ngspice init file\n');
  module.FS?.writeFile('/nfet.spice', nfet18);
  module.FS?.writeFile(
    '/test.cir',
    `MOSFET Simulation
* this file edited to remove everything not in tt lib
.include "./nfet.spice"
.param mc_switch=0

* instantiate the inverter
Xmosfet DRAIN GATE VGND X0

* NGSPICE file created from siliwiz-2522902362.ext - technology: sky130A

.subckt X0 C A B
X0 C B A VSUBS sky130_fd_pr__nfet_01v8 w=1u l=1u
C0 C B 0.00fF
C1 A B 0.00fF
C2 B VSUBS 0.07fF
.ends

.end

* set gnd and power
Vgnd C 0 0
Vdd VPWR C 1.8

* create a resistor between the MOSFET drain and VPWR
R VPWR DRAIN 10k

* create pulse
Vin GATE VGND pulse(0 1.8 1p 10p 10p 1n 2n)
.tran 10p 2n 0

.end
`,
  );
  module.setHandleThings(() => {
    module.Asyncify?.handleSleep((wakeup) => {
      try {
        const file = module.FS?.readFile('output.txt');
        const content = new TextDecoder().decode(file);
        const newData: number[][] = [];
        for (const line of content.split('\n').slice(1)) {
          const parts = line.trim().split(/\s+/);
          newData.push([parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2])]);
        }
        import('~/components/Graph').then(({ setData }) => {
          setData(newData);
        });
      } catch (err) {
        console.warn(err);
      }

      wakeup();
    });
  });
  module.setGetInput(() => {
    return 'source test.cir\nrun\nset wr_singlescale\nset wr_vecnames\nwrdata output.txt DRAIN GATE VGND\nquit';
  });
  console.log(module.runThings());
}
