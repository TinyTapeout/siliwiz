import { createSignal } from 'solid-js';
import { parseTCLList } from '~/utils/tcl-parser';

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
  const drcLines = magicOutput.split('\n').filter((line) => line.startsWith('SILIWIZ_DRC_ITEM'));
  const result = [];
  for (const line of drcLines) {
    const elements = parseTCLList(line);
    const coords = [];
    for (const coordRect of elements.slice(2)) {
      const [x0, y0, x1, y1] = coordRect.split(' ').map((n) => parseInt(n, 10));
      coords.push({ x0, y0, x1, y1 });
    }
    result.push({ message: elements[1], coords });
  }
  return result;
}

export const [activeDRCItem, setActiveDRCItem] = createSignal<IDRCItem | null>(null);
