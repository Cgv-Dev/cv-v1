import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import tfgIcon from '../assets/images/tfg1.png';
import pdfFile from '../assets/pdf/portfolio.pdf';
import metaIcon from '../assets/images/metasploit2.png';

const projects = [
  {
    title: 'EducARlos',
    description: 'projects.0.description',
    image: tfgIcon,
    link: pdfFile,
    buttonText: 'projects.0.buttonText',
  },
  {
    title: 'projects.1.title',
    description: 'projects.1.description',
    image: metaIcon,
    link: 'https://github.com/Cgv-Dev/Metasploit-Module-TFM',
    buttonText: 'projects.1.buttonText',
  },
];

const Portfolio = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('portfolio')}
      </Typography>
      <Grid container spacing={4}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardMedia
                component="img"
                image={project.image}
                alt={project.title}
                sx={{ height: 140, objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{t(project.title)}</Typography>
                <Typography variant="body2" gutterBottom>{t(project.description)}</Typography>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button 
                    variant="contained" 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ width: '100%' }}
                  >
                    {t(project.buttonText)}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Portfolio;
