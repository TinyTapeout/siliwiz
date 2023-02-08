// SPDX-License-Identifier: Apache-2.0

import { Box, CssBaseline, Stack, ThemeProvider } from '@suid/material';
import { ErrorBoundary, Scripts } from 'solid-start';
import MainView from '~/components/MainView';
import { theme } from '~/config/theme';
import { ExpertOptions } from './ExpertOptions';
import { Footer } from './Footer';
import { Header } from './Header';
import { LinkBox } from './LinkBox';

export default function Siliwiz() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <CssBaseline enableColorScheme />
        <Header />
        <Box sx={{ px: 2 }}>
          <Stack spacing={1} width="max-content">
            <MainView />
            <LinkBox />
          </Stack>
          <hr style={{ margin: '1em 0' }} />
          <ExpertOptions />
          <hr />
          <Footer />
        </Box>
      </ErrorBoundary>
      <Scripts />
    </ThemeProvider>
  );
}
