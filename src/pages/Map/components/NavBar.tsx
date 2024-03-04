import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, Container, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TimelineIcon from '@mui/icons-material/Timeline';
import { pages } from '../../../data/pages';
import { useNavigate } from 'react-router';

function NavBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const firstPathSegment = window.location.href.split('/')[3];
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
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end'}}>
            {pages.map((page) => (
              <Button
                key={page.label}
                sx={{ my: 2, display: 'block', color: firstPathSegment===page.link ? theme.palette.primary.main : theme.palette.text.primary }}
                onClick={()=>navigate(page.link)}
              >
                {page.label}
              </Button>
            ))}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;