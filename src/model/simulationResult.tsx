import { createSignal } from 'solid-js';

export const [simulationResult, setSimulationResult] = createSignal<number[][]>([
  // 'time', 'IN', 'OUT'
]);
