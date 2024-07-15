import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Toolbar } from '@mui/material';
import { useTranslation } from 'react-i18next';

const sections = ['aboutMe', 'skills', 'experience', 'portfolio', 'contact'];

const Sidebar = ({ mobileOpen, handleDrawerToggle, onSectionChange }) => {
  const { t } = useTranslation();

  return (
    <Box component="nav" sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Toolbar />
        <List>
          {sections.map((text) => (
            <ListItem button key={text} onClick={() => {
              onSectionChange(text);
              handleDrawerToggle();
            }}>
              <ListItemText primary={t(text)} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
        open
      >
        <Toolbar />
        <List>
          {sections.map((text) => (
            <ListItem button key={text} onClick={() => onSectionChange(text)}>
              <ListItemText primary={t(text)} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
