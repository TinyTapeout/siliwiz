// SPDX-License-Identifier: Apache-2.0

import { Add } from '@suid/icons-material';
import { Checkbox, Chip, FormControlLabel, IconButton, Stack } from '@suid/material';
import { createEffect, For, Show } from 'solid-js';
import {
  dcSweep,
  maxInVoltage,
  minInVoltage,
  pulseDelay,
  removeSignalName,
  riseTime,
  setDCSweep,
  setMaxInVoltage,
  setMinInVoltage,
  setPulseDelay,
  setRiseTime,
  setSignalNames,
  signalNames,
  spiceFile,
} from '~/model/spiceFile';
import { simulate } from '~/sim/simulate';

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
      <FormControlLabel
        control={<Checkbox checked={dcSweep()} onChange={(e, checked) => setDCSweep(checked)} />}
        label="DC Sweep"
      />
      <br /> Input voltage: <br />
      Min:{' '}
      <input
        type="range"
        min="0"
        max="5"
        step="0.05"
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
        value={maxInVoltage()}
        onInput={(e) => setMaxInVoltage((e.target as HTMLInputElement).valueAsNumber)}
      />
      {maxInVoltage()}V<br />
      <Show when={!dcSweep()}>
        Pulse delay:{' '}
        <input
          type="range"
          min="0"
          max="50"
          step="0.1"
          value={pulseDelay()}
          onInput={(e) => setPulseDelay((e.target as HTMLInputElement).valueAsNumber)}
        />
        {pulseDelay()} us
        <br />
        Rise time:{' '}
        <input
          type="range"
          min="0"
          max="50"
          step="0.1"
          value={riseTime()}
          onInput={(e) => setRiseTime((e.target as HTMLInputElement).valueAsNumber)}
        />
        {riseTime()} us
        <br />
      </Show>
    </div>
  );
}
