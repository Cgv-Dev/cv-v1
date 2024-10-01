import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import SchoolIcon from '@mui/icons-material/School';
import avatarImg from '../assets/images/yo1.jpeg';
import ukImg from '../assets/images/uk.png';
import spImg from '../assets/images/spain.png';

const About = () => {
  const { t } = useTranslation();

  const languages = [
    {
      name: t('languages_esp.Spanish'),
      level: t('languageLevels.Spanish'),
      flag: spImg,
    },
    {
      name: t('languages_esp.English'),
      level: t('languageLevels.English'),
      flag: ukImg,
    },
  ];

  const education = t('studies', { returnObjects: true });

  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3} style={{ textAlign: 'center' }}>
          <img
            src={avatarImg}
            alt="Carlos González Valtierra"
            style={{ width: '100%', maxWidth: '200px', borderRadius: '8px' }}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box mt={{ xs: 3, md: 0 }} mb={3}>
            <Typography variant="h4" component="h2" gutterBottom>
              {t('name')}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {t('description')}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {t('relevantData')}
            </Typography>

            <Typography variant="body2" color="textSecondary" paragraph>
              <strong>{t('birthDate')}</strong> 23 de Julio de 1999
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              <strong>{t('phone')}</strong> 653585181
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              <strong>{t('residence')}</strong> Alcorcón, Madrid
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              <strong>{t('email')}</strong> c.gonzalez23799@gmail.com
            </Typography>

            <Typography variant="body2" color="textSecondary">
              {t('responsible')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Typography variant="h5" component="h3" gutterBottom>
          {t('languages')}
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {languages.map((lang, index) => (
            <Grid item xs={6} sm={4} md={3} key={index} style={{ textAlign: 'center' }}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Box
                  component="img"
                  src={lang.flag}
                  alt={lang.name}
                  sx={{
                    width: '50px',
                    height: '40px',
                    mb: 1,
                    borderRadius: '25%',
                    objectFit: 'cover',
                  }}
                />
                <Typography variant="body1" color="textSecondary">
                  {lang.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {lang.level}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mt={4}>
        <Typography variant="h5" component="h3" gutterBottom>
          {t('education')}
        </Typography>
        <Timeline position="alternate">
          {education.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot>
                  <SchoolIcon />
                </TimelineDot>
                {index < education.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" component="span">
                  {item.degree}
                </Typography>
                <Typography color="textSecondary">
                  {item.institution}
                </Typography>
                <Typography color="textSecondary">
                  {item.period}
                </Typography>
                <Typography color="textSecondary">
                  {item.grade}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    </Container>
  );
};

export default About;
