// SPDX-License-Identifier: Apache-2.0

import { AutoFixHigh, Build, Download } from '@suid/icons-material';
import { Button, FormControlLabel, Paper, Stack, Switch, Typography } from '@suid/material';
import { layout } from '~/model/layout';
import { toMagic } from '~/model/magic';
import {
  enableCustomSpice,
  setCustomSpice,
  setEnableCustomSpice,
  spiceFile,
} from '~/model/spiceFile';
import { downloadFile } from '~/utils/download-file';

export default function SpiceCodeView() {
  const isReadOnly = () => !enableCustomSpice();
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        SPICE Code (advanced)
      </Typography>

      <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
        <Button
          onClick={() => downloadFile('siliwiz.mag', toMagic(layout, { mirrorY: true }))}
          startIcon={<AutoFixHigh />}
        >
          Download MAGIC
        </Button>
        <Button
          component="a"
          href="/assets/siliwiz.tech"
          target="_blank"
          download="siliwiz.tech"
          startIcon={<Build />}
        >
          Tech File
        </Button>
        <Button onClick={() => downloadFile('siliwiz.spice', spiceFile())} startIcon={<Download />}>
          Download SPICE
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={enableCustomSpice()}
              onChange={(e, newValue) => {
                if (newValue) {
                  setCustomSpice(spiceFile());
                }
                setEnableCustomSpice(newValue);
              }}
            />
          }
          label="Edit SPICE"
        />
      </Stack>
      <textarea
        value={spiceFile()}
        cols="100"
        rows="15"
        readonly={isReadOnly()}
        style={{ background: isReadOnly() ? '#eee' : 'white' }}
        onChange={(e) => {
          setCustomSpice((e.target as HTMLTextAreaElement).value);
        }}
      />
      <br />
    </Paper>
  );
}
