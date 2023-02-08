import { Link } from '@suid/icons-material';
import { Paper, Typography } from '@suid/material';

function Bullet() {
  return <Link sx={{ verticalAlign: 'bottom' }} />;
}

export function LinkBox() {
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Resources
      </Typography>
      <Typography gutterBottom>
        <Bullet /> Get your digital designs manufactured in silicon for an affordable price at{' '}
        <a href="https://tinytapeout.com" target="_blank">
          Tiny Tapeout
        </a>
      </Typography>
      <Typography>
        <Bullet /> Learn open source ASIC design with the{' '}
        <a href="https://zerotoasiccourse.com" target="_blank">
          Zero to ASIC course
        </a>
      </Typography>
    </Paper>
  );
}
