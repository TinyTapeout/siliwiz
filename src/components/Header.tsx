import { AppBar, Button, IconButton, Toolbar, Typography } from '@suid/material';
import { repo } from '~/config/consts';
import { GitHubIcon } from './GitHubIcon';

export function Header() {
  return (
    <AppBar position="static" sx={{ marginBottom: 2 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SiliWiz
        </Typography>
        <Button color="inherit" href="https://lessons.siliwiz.com/">
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
