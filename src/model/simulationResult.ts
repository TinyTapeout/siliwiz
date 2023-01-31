// SPDX-License-Identifier: Apache-2.0

import { createSignal } from 'solid-js';

/** The data table that is used for plotting the graph */
export const [simulationResult, setSimulationResult] = createSignal<number[][]>([]);
