import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import emailjs from 'emailjs-com';

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_8mjqjmf', 
      'template_1m70253',
      {
        from_name: form.name,
        from_email: form.email,
        subject: form.subject,
        message: form.message,
      },
      'L2gJ2aN1u9l9JQZuU' 
    ).then((result) => {
      console.log(result.text);
      setNotification({ open: true, message: t('emailSuccess'), severity: 'success' });
    }, (error) => {
      console.log(error.text);
      setNotification({ open: true, message: t('emailError'), severity: 'error' });
    });

    setForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        {t('contactTitle')}
      </Typography>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label={t('nameLabel')}
          name="name"
          value={form.name}
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          fullWidth
          margin="normal"
          label={t('emailLabel')}
          name="email"
          value={form.email}
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          fullWidth
          margin="normal"
          label={t('subjectLabel')}
          name="subject"
          value={form.subject}
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          fullWidth
          margin="normal"
          label={t('messageLabel')}
          name="message"
          value={form.message}
          onChange={handleChange}
          multiline
          rows={4}
          variant="outlined"
        />
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: 10 }}>
          {t('sendMessage')}
        </Button>
      </Box>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;
