import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Menu,
  MenuItem,
  Grid,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ExploreIcon from '@mui/icons-material/Explore';
import HotelIcon from '@mui/icons-material/Hotel';
import WeekendIcon from '@mui/icons-material/Weekend';
import useStyles from './styles';

/**
 * The Header component renders the main header of the application.
 * It includes a drawer on the left that contains links to different parts of the application.
 * It also includes a menu on the right that contains links to different parts of the application.
 * The menu is styled to look like a Google-style menu.
 *
 * @function
 * @returns {ReactElement} The Header component.
 */
const Header = () => {

  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);
  const handleBentoMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleBentoMenuClose = () => setAnchorEl(null);

  
  const navLinks = [
    { label: 'Travel', icon: <FlightTakeoffIcon /> },
    { label: 'Explore', icon: <ExploreIcon /> },
    { label: 'Flights', icon: <FlightTakeoffIcon /> },
    { label: 'Hotels', icon: <HotelIcon /> },
    { label: 'Vacation rentals', icon: <WeekendIcon /> },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#202124', borderBottom: '1px solid #5F6368'}}>
        
        <Toolbar className={classes.toolbar}>
          <Box className={classes.menu}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h5" className={classes.title}>
              Google
            </Typography>
            <Box className={classes.buttonsContainer}>
              {navLinks.map((link) => (
                <a href="#" key={link.label} className={classes.flightsButton}>
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </Box>
          </Box>
          <Box className={classes.logoContainer}>
          <IconButton
              edge="end"
              color="inherit"
              aria-label="bento-menu"
              onClick={handleBentoMenuOpen}
            >
              <AppsIcon />
            </IconButton>
            <div className={classes.logo}></div>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleBentoMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#202125', 
                    border: '3px solid #36373A',
                    borderRadius: '18px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '8px',
                    marginTop: '13px',
                  },
                  className: classes.bentoMenu, 
                }}
              >
                <Grid container spacing={2}>
                  {navLinks.map((link) => (
                    <Grid item xs={6} key={link.label}>
                      <MenuItem
                        onClick={handleBentoMenuClose}
                        className={classes.bentoMenuItem} 
                      >
                        <Box className={classes.bentoIcon}>{link.icon}</Box> 
                        <Typography className={classes.bentoText}>
                          {link.label}
                        </Typography>
                      </MenuItem>
                    </Grid>
                  ))}
                </Grid>
              </Menu>

          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#303133',
            color: 'white',
            paddingTop: 2,
          },
        }}
      >
        <List>
          {navLinks.map((link) => (
            <ListItem button key={link.label} onClick={handleDrawerClose}>
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
          <hr />
          <ListItem button onClick={handleDrawerClose}>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={handleDrawerClose}>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button onClick={handleDrawerClose}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Header;

