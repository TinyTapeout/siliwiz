// SPDX-License-Identifier: Apache-2.0

import { layout } from '~/model/layout';
import { toMagic } from '~/model/magic';
import {
  enableCustomSpice,
  setCustomSpice,
  setEnableCustomSpice,
  setSignalNames,
  signalNames,
  spiceFile,
} from '~/model/spiceFile';
import { downloadFile } from '~/utils/download-file';

export default function SpiceDebugView() {
  const isReadOnly = () => !enableCustomSpice();
  return (
    <>
      Plot signals (space separated):{' '}
      <input
        value={signalNames()}
        onChange={(e) => setSignalNames((e.target as HTMLInputElement).value)}
      />
      <br />
      <textarea
        value={spiceFile()}
        cols="100"
        rows="15"
        readonly={isReadOnly()}
        onChange={(e) => {
          setCustomSpice((e.target as HTMLTextAreaElement).value);
        }}
      />
      <br />
      <button onClick={() => downloadFile('siliwiz.mag', toMagic(layout))}>Download MAGIC</button>
      &nbsp;
      <a href="/assets/siliwiz.tech" target="_blank" download="siliwiz.tech">
        Tech File
      </a>
      &nbsp;
      <button onClick={() => downloadFile('siliwiz.spice', spiceFile())}>Download SPICE</button>
      &nbsp;
      <label>
        <input
          type="checkbox"
          checked={enableCustomSpice()}
          onChange={(e) => {
            const { checked } = e.target as HTMLInputElement;
            if (checked) {
              setCustomSpice(spiceFile());
            }
            setEnableCustomSpice(checked);
          }}
        />
        Edit SPICE
      </label>
    </>
  );
}
