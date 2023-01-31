// SPDX-License-Identifier: Apache-2.0

import { CssBaseline, ThemeProvider } from '@suid/material';
import { createSignal, Show } from 'solid-js';
import { ErrorBoundary, Scripts } from 'solid-start';
import LayoutView from '~/components/LayoutView';
import SpiceDebugView from '~/components/SpiceDebugView';
import { theme } from '~/config/theme';
import { Footer } from './Footer';
import { Header } from './Header';

export default function Siliwiz() {
  const [showSpice, setShowSpice] = createSignal(false);

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <CssBaseline enableColorScheme />
        <Header />
        <LayoutView />
        <hr style={{ margin: '1em 0' }} />
        <label>
          <input
            type="checkbox"
            onClick={(e) => setShowSpice((e.target as HTMLInputElement).checked)}
          />
          Show SPICE
        </label>
        <br />
        <Show when={showSpice()}>
          <SpiceDebugView />
        </Show>
      </ErrorBoundary>
      <Scripts />
      <hr />
      <Footer />
    </ThemeProvider>
  );
}
