// SPDX-License-Identifier: Apache-2.0

import suidPlugin from '@suid/vite-plugin';
import solid from 'solid-start/vite';
import { defineConfig } from 'vite';
import child from 'child_process';

const commitHash = child.execSync('git rev-parse --short HEAD').toString();

export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash.trim()),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  plugins: [suidPlugin(), solid({ ssr: false })],
});
