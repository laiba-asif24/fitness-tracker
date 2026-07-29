import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Stack,
  Divider,
  IconButton,
  Toolbar,
  AppBar,
} from '@mui/material';
import { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 256;

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/workouts', label: 'Workouts', icon: <FitnessCenterIcon /> },
  { to: '/nutrition', label: 'Nutrition', icon: <RestaurantIcon /> },
  { to: '/progress', label: 'Progress', icon: <TrendingUpIcon /> },
  { to: '/notifications', label: 'Notifications', icon: <NotificationsActiveIcon /> },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#12181B', color: '#fff' }}>
      <Box sx={{ px: 3, py: 3 }}>
        <Stack
          component={Link}
          to="/"
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ textDecoration: 'none', width: 'fit-content' }}
        >
          <Avatar sx={{ bgcolor: '#FF5A36', width: 32, height: 32 }}>
            <FitnessCenterIcon sx={{ fontSize: 16 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.05rem', color: '#fff' }}>
            FIT<Box component="span" sx={{ color: '#FF5A36' }}>PULSE</Box>
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', display: 'block', mt: 1 }}>
          {user?.name || 'Athlete'}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <ListItemButton
                selected={isActive}
                sx={{
                  borderRadius: '10px',
                  mb: 0.5,
                  color: isActive ? '#12181B' : 'rgba(255,255,255,0.75)',
                  bgcolor: isActive ? '#F7F5F0' : 'transparent',
                  transition: 'transform 0.15s, background-color 0.15s',
                  '&:hover': {
                    bgcolor: isActive ? '#F7F5F0' : 'rgba(255,255,255,0.08)',
                    transform: 'translateX(3px)',
                  },
                  '&.Mui-selected:hover': { bgcolor: '#F7F5F0' },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#FF5A36' : 'rgba(255,255,255,0.6)', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 500 }}
                />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      <Box sx={{ px: 3, py: 3 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '10px',
            color: 'rgba(255,255,255,0.6)',
            '&:hover': { color: '#FF5A36', bgcolor: 'rgba(255,90,54,0.08)' },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Log out" primaryTypographyProps={{ fontSize: '0.85rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile top bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { xs: 'block', md: 'none' },
          bgcolor: '#12181B',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ fontFamily: '"Archivo Black"', ml: 1, fontSize: '1rem', color: '#fff', textDecoration: 'none' }}
          >
            FIT<Box component="span" sx={{ color: '#FF5A36' }}>PULSE</Box>
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 3, md: 5 }, mt: { xs: 7, md: 0 } }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;