import { createEffect, createSignal } from 'solid-js';
import {
  maxInVoltage,
  minInVoltage,
  pulseDelay,
  setMaxInVoltage,
  setMinInVoltage,
  setPulseDelay,
  spiceFile,
} from '~/model/spiceFile';
import { simulate } from '~/sim/simulate';

export const [gateLength, setGateLength] = createSignal(5);

export default function SimulationParams() {
  createEffect(() => {
    simulate(spiceFile());
  });
  return (
    <div>
      Input voltage: <br />
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
    </div>
  );
}
