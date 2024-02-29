// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from '@solidjs/start/config';
import suidPlugin from '@suid/vite-plugin';
import child from 'child_process';

const commitHash = child.execSync('git rev-parse --short HEAD').toString();

export default defineConfig({
  vite() {
    return {
      define: {
        __COMMIT_HASH__: JSON.stringify(commitHash.trim()),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      },

      plugins: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        suidPlugin() as any, // types aren't compatible with vite 5, but it still works
      ],
    };
  },
});
