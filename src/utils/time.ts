export const ps = 1;
export const ns = 1e3 * ps;
export const us = 1e3 * ns;
export const ms = 1e3 * us;
export const second = 1e3 * ms;

export function formatPicos(picos: number) {
  if (picos < 1) {
    return `${Math.round(picos * 1000)}f`;
  }
  if (picos < 1 * ns) {
    return `${Math.round(picos)}p`;
  }
  if (picos < 1 * us) {
    return `${Math.round(picos / ns)}n`;
  }
  if (picos < 1 * ms) {
    return `${Math.round(picos / us)}μ`;
  }
  if (picos < 1 * second) {
    return `${Math.round(picos / ms)}m`;
  }
  return `${Math.round(picos / second)}s`;
}
