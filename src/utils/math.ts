/**
 * Round the given number to 2 decimal places,
 * e.g. 3.1234 -> 3.12
 */
export function round2dp(n: number) {
  return Math.round(n * 100) / 100;
}

export interface ILogSliderScale {
  /** Minimum actual slider position */
  minPos: number;

  /** Maximum actual slider position */
  maxPos: number;

  /** Minimum mapped value */
  minValue: number;

  /** Maximum mapped value */
  maxValue: number;
}

export function logSliderValue(
  position: number,
  { minPos, maxPos, minValue, maxValue }: ILogSliderScale,
) {
  const minLog = Math.log(minValue);
  const maxLog = Math.log(maxValue);
  const scale = (maxLog - minLog) / (maxPos - minPos);
  return Math.exp(minLog + scale * (position - minPos));
}

export function logSliderPosition(
  value: number,
  { minPos, maxPos, minValue, maxValue }: ILogSliderScale,
) {
  const minLog = Math.log(minValue);
  const maxLog = Math.log(maxValue);
  const scale = (maxLog - minLog) / (maxPos - minPos);
  return (Math.log(value) - minLog) / scale + minPos;
}
