// SPDX-License-Identifier: Apache-2.0

import { Box, CssBaseline, ThemeProvider } from '@suid/material';
import { ErrorBoundary, Scripts } from 'solid-start';
import MainView from '~/components/MainView';
import { theme } from '~/config/theme';
import { ExpertOptions } from './ExpertOptions';
import { Footer } from './Footer';
import { Header } from './Header';

export default function Siliwiz() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <CssBaseline enableColorScheme />
        <Header />
        <Box sx={{ px: 2 }}>
          <MainView />
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
