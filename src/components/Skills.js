import React from 'react';
import { Container, Typography, Grid, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GitHub } from '@mui/icons-material';
import KubernetesIcon from '../assets/images/Kubernetes.png';
import DockerIcon from '../assets/images/docker.png';
import MetasploitIcon from '../assets/images/metasploit.png';
import BashIcon from '../assets/images/bash.png';
import PythonIcon from '../assets/images/python.png';
import SQLIcon from '../assets/images/sql.png';
import ISOIcon from '../assets/images/iso.png';

const devOpsSkills = [
  { name: 'Kubernetes', icon: <img src={KubernetesIcon} style={{ width: 60, height: 60 }} alt="Kubernetes" /> },
  { name: 'Docker', icon: <img src={DockerIcon} style={{ width: 60, height: 60 }} alt="Docker" /> },
  { name: 'Git', icon: <GitHub sx={{ fontSize: 60, color: '#F05032' }} alt="Git" /> },
];

const cyberSecuritySkills = [
  { name: 'Metasploit', icon: <img src={MetasploitIcon} style={{ width: 60, height: 60 }} alt="Metasploit" /> },
  { name: 'Bash', icon: <img src={BashIcon} style={{ width: 80, height: 60 }} alt="Bash" /> },
  { name: 'Python', icon: <img src={PythonIcon} style={{ width: 60, height: 60 }} alt="Python" /> },
  { name: 'SQL', icon: <img src={SQLIcon} style={{ width: 60, height: 60 }} alt="SQL" /> },
  { name: 'isoFamily', icon: <img src={ISOIcon} style={{ width: 60, height: 60 }} alt="ISO 27001" /> },
];

const Skills = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        {t('skills')}
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          {t('devOpsSkills')}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {devOpsSkills.map((skill) => (
            <Grid item xs={6} sm={4} md={3} key={skill.name}>
              <Box display="flex" flexDirection="column" alignItems="center">
                {skill.icon}
                <Typography variant="subtitle1" align="center">
                  {skill.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          {t('cyberSecuritySkills')}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {cyberSecuritySkills.map((skill) => (
            <Grid item xs={6} sm={4} md={3} key={skill.name}>
              <Box display="flex" flexDirection="column" alignItems="center">
                {skill.icon}
                <Typography variant="subtitle1" align="center">
                  {t(skill.name)} {/*Se usa t para traducir el nombre con i18n */}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Skills;
