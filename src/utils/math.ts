/**
 * Round the given number to 2 decimal places,
 * e.g. 3.1234 -> 3.12
 */
export function round2dp(n: number) {
  return Math.round(n * 100) / 100;
}
