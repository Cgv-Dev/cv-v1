import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import avatarImg from '../assets/images/pc.png';
import spainFlag from '../assets/images/spain.png';
import ukFlag from '../assets/images/uk.png';

const Header = ({ onMenuClick }) => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Box
            component="img"
            src={avatarImg}
            alt="Carlos González Valtierra"
            sx={{ width: 56, height: 56, marginRight: 2 }}
          />
          <Typography variant="h6" noWrap sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
            Portfolio - Curriculum Vitae
          </Typography>
        </Box>
        <div>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="language"
            onClick={handleMenu}
          >
            <Box
              component="img"
              src={i18n.language === 'es' ? spainFlag : ukFlag}
              alt="language flag"
              sx={{ width: 24, height: 24, borderRadius: '25%' }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleLanguageChange('en')}>
              <Box
                component="img"
                src={ukFlag}
                alt="English"
                sx={{ width: 24, height: 24, marginRight: 1, borderRadius: '25%' }}
              />
              English
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange('es')}>
              <Box
                component="img"
                src={spainFlag}
                alt="Español"
                sx={{ width: 24, height: 24, marginRight: 1, borderRadius: '25%' }}
              />
              Español
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
