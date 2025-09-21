// SPDX-License-Identifier: Apache-2.0

import { Box, CssBaseline, Stack, ThemeProvider } from '@suid/material';
import { Show } from 'solid-js';
import MainView from './MainView';
import { theme } from '~/config/theme';
import { showSpice } from '~/model/spiceFile';
import { Footer } from './Footer';
import { Header } from './Header';
import { LinkBox } from './LinkBox';
import SpiceCodeView from './SpiceCodeView';

export default function Siliwiz() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Header />
      <Box sx={{ px: 2 }}>
        <Stack spacing={1} width="max-content">
          <MainView />
          <Show when={showSpice()}>
            <SpiceCodeView />
          </Show>
          <LinkBox />
        </Stack>
        <hr />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
