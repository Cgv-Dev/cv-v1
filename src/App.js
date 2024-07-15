import React, { useState } from 'react';
import { CssBaseline, Box, Toolbar } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';

function App() {
  const [currentSection, setCurrentSection] = useState('aboutMe');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'aboutMe':
        return <About />;
      case 'skills':
        return <Skills />;
      case 'experience':
        return <Experience />;
      case 'portfolio':
        return <Portfolio />;
      case 'contact':
        return <Contact />;
      default:
        return <About />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header onMenuClick={handleDrawerToggle} />
      <Sidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
        onSectionChange={setCurrentSection} 
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderSection()}
      </Box>
    </Box>
  );
}

export default App;
