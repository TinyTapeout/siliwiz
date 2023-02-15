// SPDX-License-Identifier: Apache-2.0

import { Add } from '@suid/icons-material';
import { Box, Chip, FormControlLabel, IconButton, Stack, Switch } from '@suid/material';
import { createEffect, For } from 'solid-js';
import {
  enableCustomSpice,
  maxInVoltage,
  minInVoltage,
  pulseDelay,
  removeSignalName,
  riseTime,
  setEnableCustomSpice,
  setMaxInVoltage,
  setMinInVoltage,
  setPulseDelay,
  setRiseTime,
  setShowSpice,
  setSignalNames,
  setTranTime,
  showSpice,
  signalNames,
  spiceFile,
  tranTime,
} from '~/model/spiceFile';
import { simulate } from '~/sim/simulate';
import { logSliderPosition, logSliderValue, type ILogSliderScale } from '~/utils/math';
import { formatPicos, ps, us } from '~/utils/time';

const tranTimeSlider: ILogSliderScale = {
  minPos: 0,
  maxPos: 100,
  minValue: 1 * ps,
  maxValue: 100 * us,
};

export default function SimulationParams() {
  createEffect(() => {
    void simulate(spiceFile(), signalNames());
  });

  const addSignal = () => {
    const signal = prompt('Signal name (you can add multiple signals separated by spaces)');
    if (signal != null && signal.trim().length > 0) {
      setSignalNames(signalNames().trim() + ' ' + signal.trim());
    }
  };

  return (
    <div>
      Plot signals:
      <br />
      <Stack direction="row" spacing={1}>
        <For
          each={signalNames()
            .split(' ')
            .filter((i) => i.length > 0)}
        >
          {(name) => <Chip label={name} onDelete={() => removeSignalName(name)} />}
        </For>
        <IconButton onClick={addSignal} size="small" color="primary">
          <Add />
        </IconButton>
      </Stack>
      <br /> Input voltage: <br />
      Min:{' '}
      <input
        type="range"
        min="0"
        max="5"
        step="0.05"
        disabled={enableCustomSpice()}
        value={minInVoltage()}
        onInput={(e) => setMinInVoltage((e.target as HTMLInputElement).valueAsNumber)}
      />
      {minInVoltage()}V <br />
      Max:{' '}
      <input
        type="range"
        min="0"
        max="5"
        step="0.05"
        disabled={enableCustomSpice()}
        value={maxInVoltage()}
        onInput={(e) => setMaxInVoltage((e.target as HTMLInputElement).valueAsNumber)}
      />
      {maxInVoltage()}V<br />
      Pulse delay:{' '}
      <input
        type="range"
        min="0"
        max="50"
        step="0.1"
        disabled={enableCustomSpice()}
        value={pulseDelay()}
        onInput={(e) => setPulseDelay((e.target as HTMLInputElement).valueAsNumber)}
      />
      {pulseDelay()}μs
      <br />
      Rise time:{' '}
      <input
        type="range"
        min="0"
        max="50"
        step="0.1"
        disabled={enableCustomSpice()}
        value={riseTime()}
        onInput={(e) => setRiseTime((e.target as HTMLInputElement).valueAsNumber)}
      />
      {riseTime()}µs
      <br />
      Time scale:
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={logSliderPosition(tranTime(), tranTimeSlider)}
        onInput={(e) => {
          setTranTime(logSliderValue((e.target as HTMLInputElement).valueAsNumber, tranTimeSlider));
        }}
      />
      {formatPicos(tranTime())}s
      <Box mt={1}>
        <FormControlLabel
          control={
            <Switch
              checked={showSpice()}
              onChange={(e, newValue) => {
                setShowSpice(newValue);
                if (!newValue) {
                  setEnableCustomSpice(false);
                }
              }}
            />
          }
          label="Show SPICE (advanced)"
        />
      </Box>
    </div>
  );
}
