import { AppBar, Box, Button, IconButton, Toolbar } from '@suid/material';
import { repo } from '~/config/consts';
import { GitHubIcon } from './GitHubIcon';

export function Header() {
  return (
    <AppBar position="static" sx={{ marginBottom: 2 }}>
      <Toolbar>
        <img src="/images/header-logo.png" alt="SiliWiz logo" width="166" height="32" />
        <Box flexGrow={1} />
        <Button color="inherit" href="https://tinytapeout.com/siliwiz/">
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
