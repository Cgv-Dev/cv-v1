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
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BugReportIcon from '@mui/icons-material/BugReport';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ShieldIcon from '@mui/icons-material/Shield';
import DnsIcon from '@mui/icons-material/Dns';
import LockIcon from '@mui/icons-material/Lock';
import WifiIcon from '@mui/icons-material/Wifi';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CIcon from '../assets/images/c.png';

const devOpsSkills = [
  { name: 'Kubernetes', icon: <img src={KubernetesIcon} style={{ width: 60, height: 60 }} alt="Kubernetes" /> },
  { name: 'Docker', icon: <img src={DockerIcon} style={{ width: 60, height: 60 }} alt="Docker" /> },
  { name: 'git', icon: <GitHub sx={{ fontSize: 60, color: '#F05032' }} alt="Git" /> },
];

const cyberSecuritySkills = [
  { name: 'Metasploit', icon: <img src={MetasploitIcon} style={{ width: 60, height: 60 }} alt="Metasploit" />, text: 'Metasploit' },
  { name: 'Bash', icon: <img src={BashIcon} style={{ width: 80, height: 60 }} alt="Bash" />, text: 'Bash' },
  { name: 'Python', icon: <img src={PythonIcon} style={{ width: 60, height: 60 }} alt="Python" />, text: 'Python' },
  { name: 'C', icon: <img src={CIcon} style={{ width: 60, height: 60 }} alt="C" />, text: 'C' },
  { name: 'SQL', icon: <img src={SQLIcon} style={{ width: 60, height: 60 }} alt="SQL" />, text: 'SQL' },
  { name: 'isoFamily', icon: <img src={ISOIcon} style={{ width: 60, height: 60 }} alt="ISO 27001" />, text: 'isoFamily' },
  { name: 'offensiveSecurity', icon: <SecurityIcon sx={{ fontSize: 60 }} />, text: 'offensiveSecurity' },
  { name: 'forensicAnalysis', icon: <AssessmentIcon sx={{ fontSize: 60 }} />, text: 'forensicAnalysis' },
  { name: 'malwareAnalysis', icon: <BugReportIcon sx={{ fontSize: 60 }} />, text: 'malwareAnalysis' },
  { name: 'riskAnalysis', icon: <ReportProblemIcon sx={{ fontSize: 60 }} />, text: 'riskAnalysis' },
  { name: 'siem', icon: <EventNoteIcon sx={{ fontSize: 60 }} />, text: 'siem' },
  { name: 'idsIps', icon: <ShieldIcon sx={{ fontSize: 60 }} />, text: 'idsIps' },
  { name: 'firewall', icon: <DnsIcon sx={{ fontSize: 60 }} />, text: 'firewall' },
  { name: 'dataProtection', icon: <LockIcon sx={{ fontSize: 60 }} />, text: 'dataProtection' },
  { name: 'communicationProtocols', icon: <WifiIcon sx={{ fontSize: 60 }} />, text: 'communicationProtocols' },
  { name: 'identificationAuthentication', icon: <FingerprintIcon sx={{ fontSize: 60 }} />, text: 'identificationAuthentication' },
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
                  {t(skill.name)}
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
                  {t(skill.name) !== skill.name ? t(skill.name) : t(skill.text)}
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
