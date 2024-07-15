import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Experience = () => {
  const { t } = useTranslation();
  const experiences = t('experienceList', { returnObjects: true });

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {t('experience')}
      </Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        <List>
          {experiences.map((exp, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={exp.title}
                secondary={
                  <>
                    <Typography variant="subtitle1" component="h3" style={{ fontWeight: 'bold' }}>
                      {exp.company}
                    </Typography>
                    <Typography variant="subtitle2" component="h4" style={{ marginTop: '4px' }}>
                      {exp.date}
                    </Typography>
                    <Typography component="div" style={{ fontFamily: 'Roboto', fontSize: '16px' }}>
                      <ul>
                        {exp.description.split('\n').map((line, lineIndex) => (
                          line.trim() ? <li key={lineIndex}>{line}</li> : null
                        ))}
                      </ul>
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Experience;
