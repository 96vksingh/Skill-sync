import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          color="inherit"
          sx={{ textDecoration: 'none', flexGrow: 1 }}
        >
          SkillSync AI
        </Typography>
        {user && (
          <Box>
            <Button
              color={location.pathname === '/dashboard' ? 'secondary' : 'inherit'}
              component={Link}
              to="/dashboard"
            >
              Dashboard
            </Button>
            <Button
              color={location.pathname === '/profile' ? 'secondary' : 'inherit'}
              component={Link}
              to="/profile"
            >
              Profile
            </Button>
            <Button
              color={location.pathname === '/skills' ? 'secondary' : 'inherit'}
              component={Link}
              to="/skills"
            >
              Skills
            </Button>
            <Button
              color={location.pathname === '/matches' ? 'secondary' : 'inherit'}
              component={Link}
              to="/matches"
            >
              Matches
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
