// SPDX-License-Identifier: Apache-2.0

import { createEffect, Show } from 'solid-js';
import {
  dcSweep,
  maxInVoltage,
  minInVoltage,
  pulseDelay,
  riseTime,
  setDCSweep,
  setMaxInVoltage,
  setMinInVoltage,
  setPulseDelay,
  setRiseTime,
  setSignalNames,
  signalNames,
  spiceFile,
} from '~/model/spiceFile';
import { simulate } from '~/sim/simulate';

export default function SimulationParams() {
  createEffect(() => {
    void simulate(spiceFile(), signalNames());
  });
  return (
    <div>
      Plot signals (space separated):
      <br />
      <input
        value={signalNames()}
        onChange={(e) => setSignalNames((e.target as HTMLInputElement).value)}
      />
      <br />
      <input
        type="checkbox"
        checked={dcSweep()}
        onChange={(e) => setDCSweep((e.target as HTMLInputElement).checked)}
      />{' '}
      DC Sweep
      <br /> Input voltage: <br />
      Min:{' '}
      <input
        type="range"
        min="0"
        max="5"
        step="0.05"
        value={minInVoltage()}
        onInput={(e) => setMinInVoltage((e.target as HTMLInputElement).valueAsNumber)}
      />
      {minInVoltage()}V <br />
      Max:{' '}
      <input
        type="range"
        min="0"
        max="5"
        step="0.05"
        value={maxInVoltage()}
        onInput={(e) => setMaxInVoltage((e.target as HTMLInputElement).valueAsNumber)}
      />
      {maxInVoltage()}V<br />
      <Show when={!dcSweep()}>
        Pulse delay:{' '}
        <input
          type="range"
          min="0"
          max="50"
          step="0.1"
          value={pulseDelay()}
          onInput={(e) => setPulseDelay((e.target as HTMLInputElement).valueAsNumber)}
        />
        {pulseDelay()} us
        <br />
        Rise time:{' '}
        <input
          type="range"
          min="0"
          max="50"
          step="0.1"
          value={riseTime()}
          onInput={(e) => setRiseTime((e.target as HTMLInputElement).valueAsNumber)}
        />
        {riseTime()} us
        <br />
      </Show>
    </div>
  );
}
