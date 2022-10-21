import { createEffect, createSignal } from 'solid-js';
import { simulate } from '~/sim/simulate';

export const [gateLength, setGateLength] = createSignal(5);

export default function SimulationParams() {
  createEffect(() => {
    simulate(1, gateLength());
  });
  return (
    <div>
      Gate length:{' '}
      <input
        type="range"
        min="1"
        max="5000"
        value={gateLength()}
        onInput={(e) => setGateLength((e.target as HTMLInputElement).valueAsNumber)}
      />
      {gateLength()}um
    </div>
  );
}
