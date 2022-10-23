import { createEffect, createSignal } from 'solid-js';
import { maxInVoltage, minInVoltage, setMaxInVoltage, setMinInVoltage, spiceFile } from '~/model/spiceFile';
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
        min="1"
        max="5"
        step="0.05"
        value={minInVoltage()}
        onInput={(e) => setMinInVoltage((e.target as HTMLInputElement).valueAsNumber)}
      />
      {minInVoltage()}V <br />
      Max:{' '}
      <input
        type="range"
        min="1"
        max="5"
        step="0.05"
        value={maxInVoltage()}
        onInput={(e) => setMaxInVoltage((e.target as HTMLInputElement).valueAsNumber)}
      />
      {maxInVoltage()}V
    </div>
  );
}
