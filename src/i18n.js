import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      Metasploit: 'Metasploit',
      Bash: 'Bash',
      Python: 'Python',
      SQL: 'SQL',
      skills: 'Skills',
      devOpsSkills: 'DevOps Skills',
      cyberSecuritySkills: 'Cybersecurity Skills',
      isoFamily: 'Family of ISO/IEC 27000 standards',
      aboutMe: 'About Me',
      experience: 'Experience',
      portfolio: 'Portfolio',
      contact: 'Contact',
      name: 'Carlos González Valtierra',
      description: 'I am a software engineer specialized in cybersecurity looking to continue increasing my work experience in real work environments.',
      relevantData: 'Some relevant data about me:',
      birthDate: 'Date of Birth:',
      phone: 'Phone:',
      residence: 'Residence:',
      email: 'Email:',
      responsible: "I consider myself a responsible person in the work environment; I always put forth my maximum effort in everything I do. Additionally, I believe I work well in teams and maintain a continuous focus on learning.\n" +
      "I am eager to apply the academic knowledge acquired during my master's in Cybersecurity.",
      languages: 'Languages',
      education: 'Education',
      degree: 'Degree',
      institution: 'Institution',
      period: 'Period',
      grade: 'Grade',
      git: 'Code Versioning with Git',
      portfolioProject: 'View Project Documentation',
      contactTitle: 'Contact',
      nameLabel: 'Your Name',
      emailLabel: 'Your Email',
      subjectLabel: 'Subject',
      messageLabel: 'Message',
      sendMessage: 'Send Message',
      emailSuccess: 'Message sent successfully!',
      emailError: 'An error occurred while sending the message. Please try again later.',
      experienceList: [
        {
          title: 'CURRICULAR INTERNSHIPS',
          company: 'VEXCEL IMAGING',
          date: 'November 2021 - March 2022',
          description: `Software development for internal company use
                        Helping data flow between the development and production teams
                        Various technologies used, including Python, PostgreSQL, AWS, and bash.`,
        },
        {
          title: 'JUNIOR CLOUD ENGINEER',
          company: 'UST ESPAÑA',
          date: 'December 2022 - July 2023',
          description: `Development of scripts in Powershell and Azure CLI
                        Tasks related to Azure and its environment, from navigating the portal to manage all available resources to performing queries in the Resource Graph Explorer using KQL to find different resources. Highlighted tasks include:
                        Scripting with Powershell and Azure CLI
                        Creating CSV reports for company interest
                        Deployment and automation with Azure DevOps and Pipelines for CD/CI.
                        Integration of ServiceNow with Azure DevOps
                        Creating and testing Webhooks.`,
        },
      ],
      languageLevels: {
        Spanish: 'Native',
        English: 'Intermediate-High Level (B2)',
      },
      studies: [
        {
          degree: 'Software Engineering',
          institution: 'Rey Juan Carlos University',
          period: '2017 - 2023',
          grade: 'Average grade: 7.21',
        },
        {
          degree: 'Bilingual Master in Cybersecurity',
          institution: 'Carlos III University of Madrid',
          period: '2023 - Present',
          grade: 'Average grade: 8.37 (Pending the final project)',
        },
      ],
      projects: {
        0: {
          description: 'Application based on Augmented Reality for the development of STEM skills, carried out for the Final Degree Project in Software Engineering.',
        },
      },
      offensiveSecurity: 'Offensive Security',
      forensicAnalysis: 'Forensic Analysis of IT Systems',
      malwareAnalysis: 'Malware Analysis',
      riskAnalysis: 'Risk Analysis',
      siem: 'Security Information and Event Management (SIEM)',
      idsIps: 'Intrusion Detection and Prevention',
      firewall: 'Firewalls and Network Segmentation',
      dataProtection: 'Data Protection',
      communicationProtocols: 'Communication Protocols',
      identificationAuthentication: 'Identification and Authentication',
    },
  },
  es: {
    translation: {
      Metasploit: 'Metasploit',
      Bash: 'Bash',
      Python: 'Python',
      SQL: 'SQL',
      welcome: 'Bienvenido',
      skills: 'Habilidades',
      devOpsSkills: 'Habilidades DevOps',
      cyberSecuritySkills: 'Habilidades de Ciberseguridad',
      isoFamily: 'Familia de normas ISO/IEC 27000',
      aboutMe: 'Sobre Mi',
      experience: 'Experiencia',
      portfolio: 'Portafolio',
      contact: 'Contacto',
      name: 'Carlos González Valtierra',
      description: 'Soy ingeniero del software especializado en la rama de Ciberseguridad en busca de seguir aumentando mi experiencia laboral en entornos laborales reales.',
      relevantData: 'Algunos datos relevantes sobre mí:',
      birthDate: 'Fecha de Nacimiento:',
      phone: 'Teléfono:',
      residence: 'Residencia:',
      email: 'Email:',
      responsible: "Me considero una persona responsable en el entorno de trabajo, siempre pongo el máximo esfuerzo en todo lo que hago y considero que soy bueno trabajando en equipo. Además, tengo un enfoque continuo en el aprendizaje.\n" +
      "Tengo muchas ganas de aplicar los conocimientos académicos adquiridos en el máster de Ciberseguridad.",
      languages: 'Idiomas',
      education: 'Educación',
      degree: 'Grado',
      institution: 'Institución',
      period: 'Periodo',
      grade: 'Nota',
      git: 'Versionado de Código con Git',
      portfolioProject: 'Ver Documentación del Proyecto',
      contactTitle: 'Contacto',
      nameLabel: 'Tu Nombre',
      emailLabel: 'Tu Email',
      subjectLabel: 'Asunto',
      messageLabel: 'Mensaje',
      sendMessage: 'Enviar Mensaje',
      emailSuccess: '¡Mensaje enviado con éxito!',
      emailError: 'Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
      experienceList: [
        {
          title: 'PRÁCTICAS CURRICULARES DE GRADO',
          company: 'VEXCEL IMAGING',
          date: 'Noviembre 2021 - Marzo 2022',
          description: `Desarrollo de software para el uso interno de la empresa
                        Ayuda al flujo de datos entre el equipo de desarrollo y producción
                        Distintas tecnologías usadas entre las que destacan: Python, PostgreSQL, AWS y bash.`,
        },
        {
          title: 'INGENIERO CLOUD JUNIOR',
          company: 'UST ESPAÑA',
          date: 'Diciembre 2022 - Julio 2023',
          description: `Desarrollo de scripts en Powershell y Azure CLI
                        Tareas relacionadas con Azure y su entorno, desde cómo navegar por el portal para gestionar todos los recursos disponibles hasta realizar consultas en el Explorador de Gráficos de Recursos en lenguaje KQL para encontrar diferentes recursos. Algunas tareas destacadas:
                        Scripting con Powershell y Azure CLI
                        Creación de informes CSV para el interés de la empresa
                        Despliegue y automatización con Azure Devops y Pipelines para CD/CI.
                        Integración de ServiceNow con Azure DevOps
                        Creación y prueba de Webhooks.`,
        },
      ],
      languageLevels: {
        Spanish: 'Nativo',
        English: 'Nivel medio-Alto (B2)',
      },
      studies: [
        {
          degree: 'Ingeniería del Software',
          institution: 'Universidad Rey Juan Carlos',
          period: '2017 - 2023',
          grade: 'Nota media: 7.21',
        },
        {
          degree: 'Máster bilingüe en Ciberseguridad',
          institution: 'Universidad Carlos III de Madrid',
          period: '2023 - Actualidad',
          grade: 'Nota media: 8.37 (A falta de entregar el TFM)',
        },
      ],
      projects: {
        0: {
          description: 'Aplicación basada en Realidad Aumentada para el desarrollo de competencias STEM, realizada para el trabajo de Fin de Grado de Ingeniería del Software',
        },
      },
      offensiveSecurity: 'Seguridad ofensiva',
      forensicAnalysis: 'Análisis forense de sistemas informáticos',
      malwareAnalysis: 'Análisis de malware',
      riskAnalysis: 'Análisis de riesgos',
      siem: 'Gestión de eventos e información de seguridad (SIEM)',
      idsIps: 'Detección y prevención de intrusiones',
      firewall: 'Cortafuegos y zonificación de redes',
      dataProtection: 'Protección de datos',
      communicationProtocols: 'Protocolos de comunicaciones',
      identificationAuthentication: 'Identificación y autenticación',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es', 
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
