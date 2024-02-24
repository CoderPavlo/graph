import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, Container, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TimelineIcon from '@mui/icons-material/Timeline';
const pages:string[] = [];

function NavBar() {
  const theme = useTheme();
  return (
    <AppBar position="static" sx={{background: theme.palette.background.paper}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TimelineIcon sx={{ mr: 1 }} />
          <Typography
            variant='h5'
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Граф
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex'}}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;