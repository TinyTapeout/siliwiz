// SPDX-License-Identifier: MIT

import spice from './spice';

export interface SpiceController {
  run(commands: string[]): void;
  readFile(name: string): Uint8Array | undefined;
  writeFile(name: string, content: string): void;
}

export async function createSpice(): Promise<SpiceController> {
  const module = await spice({
    noInitialRun: true,
    print: (e) => console.log(e),
    printErr: (e) => console.error(e),
  });
  const commandQueue: string[] = [];
  let wakeupCallback = () => {
    console.error('too soon!');
  };
  module.FS?.writeFile('/proc/meminfo', '');
  module.FS?.mkdir('/usr');
  module.FS?.mkdir('/usr/local');
  module.FS?.mkdir('/usr/local/share');
  module.FS?.mkdir('/usr/local/share/ngspice');
  module.FS?.mkdir('/usr/local/share/ngspice/scripts');
  module.FS?.writeFile('/usr/local/share/ngspice/scripts/spinit', '* Standard ngspice init file\n');
  module.setGetInput(() => {
    const command = commandQueue.shift() ?? '';
    return command;
  });
  module.setHandleThings(() => {
    module.Asyncify?.handleSleep((wakeup) => {
      if (commandQueue.length > 0) {
        wakeup();
      } else {
        wakeupCallback = wakeup;
      }
    });
  });
  module.runThings();
  return {
    readFile(name: string) {
      return module.FS?.readFile(name);
    },
    writeFile(name: string, content: string) {
      module.FS?.writeFile(name, content);
    },
    run(commands: string[]) {
      commandQueue.push(...commands);
      wakeupCallback();
    },
  };
}
