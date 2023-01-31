import { AppBar, Button, CssBaseline, ThemeProvider, Toolbar, Typography } from '@suid/material';
import { createSignal, Show } from 'solid-js';
import { ErrorBoundary, Scripts } from 'solid-start';
import LayoutView from '~/components/LayoutView';
import SpiceDebugView from '~/components/SpiceDebugView';
import { theme } from '~/config/theme';

export default function Siliwiz() {
  const [showSpice, setShowSpice] = createSignal(false);

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <CssBaseline enableColorScheme />
        <AppBar position="static" sx={{ marginBottom: 2 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SiliWiz
            </Typography>
            <Button color="inherit" href="https://lessons.siliwiz.com/">
              Lessons
            </Button>
          </Toolbar>
        </AppBar>
        <LayoutView />
        <hr style={{ margin: '1em 0' }} />
        <label>
          <input
            type="checkbox"
            onclick={(e) => setShowSpice((e.target as HTMLInputElement).checked)}
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
      <footer>
        <small>
          SiliWiz revision{' '}
          <a href="https://github.com/wokwi/siliwiz/commit/__COMMIT_HASH__">{__COMMIT_HASH__}</a>,
          built at {__BUILD_TIME__}.
        </small>
      </footer>
    </ThemeProvider>
  );
}
