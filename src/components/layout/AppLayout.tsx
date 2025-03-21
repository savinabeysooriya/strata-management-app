import { Link } from 'react-router-dom';
import { 
  Box, Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Toolbar, AppBar, Typography 
} from '@mui/material';
import { Home, People, Apartment, RequestPage, AddTask } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


export const AppLayout = () => {
  const { userRole } = useAuth();
  return (
  <Box sx={{ display: 'flex' }}>
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Property Management Dashboard
        </Typography>
      </Toolbar>
    </AppBar>

    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {userRole === 'Admin' ? (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/">
                  <ListItemIcon><Home /></ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/buildings">
                  <ListItemIcon><Apartment /></ListItemIcon>
                  <ListItemText primary="Buildings" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/owners">
                  <ListItemIcon><People /></ListItemIcon>
                  <ListItemText primary="Owners" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/requests">
                  <ListItemIcon><RequestPage /></ListItemIcon>
                  <ListItemText primary="Maintenance" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/">
                  <ListItemIcon><Home /></ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/my-building">
                  <ListItemIcon><Apartment /></ListItemIcon>
                  <ListItemText primary="My Building" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/new-request">
                  <ListItemIcon><AddTask /></ListItemIcon>
                  <ListItemText primary="New Request" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>

    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Outlet /> 
    </Box>
  </Box>
);
};