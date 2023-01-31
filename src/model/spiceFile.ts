// SPDX-License-Identifier: Apache-2.0

import { createSignal } from 'solid-js';

export interface ISpiceParams {
  dcSweep: boolean;
  minInVoltage: number;
  maxInVoltage: number;
  pulseDelay: number;
  riseTime: number;
  signalNames: string;
}

export const [spiceInput, setSpiceInput] = createSignal<string>('');
export const [dcSweep, setDCSweep] = createSignal<boolean>(false);
export const [minInVoltage, setMinInVoltage] = createSignal<number>(0);
export const [maxInVoltage, setMaxInVoltage] = createSignal<number>(5);
export const [pulseDelay, setPulseDelay] = createSignal<number>(0);
export const [riseTime, setRiseTime] = createSignal<number>(50);
export const [enableCustomSpice, setEnableCustomSpice] = createSignal<boolean>(false);
export const [customSpice, setCustomSpice] = createSignal<string>('');
export const [signalNames, setSignalNames] = createSignal('in out');

export function getSpiceParams(): ISpiceParams {
  return {
    dcSweep: dcSweep(),
    minInVoltage: minInVoltage(),
    maxInVoltage: maxInVoltage(),
    pulseDelay: pulseDelay(),
    riseTime: riseTime(),
    signalNames: signalNames(),
  };
}

export function setSpiceParams(params: Partial<ISpiceParams>) {
  if (params.dcSweep !== undefined) {
    setDCSweep(params.dcSweep);
  }
  if (params.minInVoltage !== undefined) {
    setMinInVoltage(params.minInVoltage);
  }
  if (params.maxInVoltage !== undefined) {
    setMaxInVoltage(params.maxInVoltage);
  }
  if (params.pulseDelay !== undefined) {
    setPulseDelay(params.pulseDelay);
  }
  if (params.riseTime !== undefined) {
    setRiseTime(params.riseTime);
  }
  if (params.signalNames !== undefined) {
    setSignalNames(params.signalNames);
  }
}

export function processMagicSpice(magicSpice: string) {
  const circuit = magicSpice.match(/\n.subckt ([^\n]*)\n(.+)\n.ends\n/s);
  if (circuit == null) {
    return null;
  }

  const signals = circuit[1].split(' ').slice(1);

  return {
    signals,
    netlist: circuit[2],
  };
}

export function spiceFile() {
  if (enableCustomSpice()) {
    return customSpice();
  }

  const input = processMagicSpice(spiceInput());

  const signals = input?.signals ?? [];
  const netlist = input?.netlist ?? '';

  const inputPulse = dcSweep()
    ? [`* Input is constant at 2.5v`, 'Vin in 0 2.5']
    : [
        '* Input pulse: ramp the `in` signal',
        `Vin in 0 pulse (${minInVoltage()} ${maxInVoltage()} ${pulseDelay()}u ${riseTime()}u 50u 1 1)`,
      ];
  const simulationCode = dcSweep()
    ? `.dc vdd ${minInVoltage()} ${maxInVoltage()} 0.1`
    : `.tran 500n 60u`;

  return `* SiliWiz Simulation (app rev ${__COMMIT_HASH__})

*signals: ${signals?.join(' ')}

Vdd vdd 0 5 ; power supply: 5V
Vss vss 0 0 ; ground

${inputPulse.join('\n')}

* Extracted circuit:
${netlist}

* Models:
.model nmos nmos (vto=1 tox=15n uo=600 cbd=20f cbs=20f gamma=0.37)
.model pmos pmos (vto=-1 tox=15n uo=230 cbd=20f cbs=20f gamma=0.37)

* Simulation parameters:
${simulationCode}

.end
`;
}
