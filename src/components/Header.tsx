import { AppBar, Box, Button, IconButton, Toolbar } from '@suid/material';
import { repo } from '~/config/consts';
import { GitHubIcon } from './GitHubIcon';

export function Header() {
  return (
    <AppBar position="static" sx={{ marginBottom: 2 }}>
      <Toolbar>
        <img src="/images/header-logo.png" alt="SiliWiz logo" width="166" height="32" />
        <Box flexGrow={1} />
        <Button color="inherit" href="https://docs.google.com/document/d/1H3jA7guvXT7toEvUObOQ1viQ6Qz_QSGDiJ5OBS2pDEI">
          Lessons
        </Button>
        <IconButton
          color="inherit"
          component="a"
          href={repo}
          target="_blank"
          title="GitHub repository"
        >
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
