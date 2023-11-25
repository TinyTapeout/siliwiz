// SPDX-License-Identifier: Apache-2.0

import { createSignal } from 'solid-js';
import { parseTCLList } from '~/utils/tcl-parser';
import { techScale } from './magic';

export interface IDRCRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface IDRCItem {
  message: string;
  coords: IDRCRect[];
}

export function parseMagicDRC(magicOutput: string) {
  const scale = techScale;
  const drcLines = magicOutput.split('\n').filter((line) => line.startsWith('SILIWIZ_DRC_ITEM'));
  const result = [];
  for (const line of drcLines) {
    const elements = parseTCLList(line);
    const coords = [];
    for (const coordRect of elements.slice(2)) {
      const [x0, y0, x1, y1] = coordRect.split(' ').map((n) => parseInt(n, 10));
      coords.push({ x0: x0 / scale, y0: y0 / scale, x1: x1 / scale, y1: y1 / scale });
    }
    result.push({ message: elements[1], coords });
  }
  return result;
}

export const [activeDRCItem, setActiveDRCItem] = createSignal<IDRCItem | null>(null);
