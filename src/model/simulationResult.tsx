import { createSignal } from 'solid-js';

export const [simulationResult, setSimulationResult] = createSignal([
  // 'time', 'IN', 'OUT'
  [0.0, 0.0, 1.8],
  [1.0, 1.8, 0.0],
]);
