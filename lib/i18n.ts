// Internationalization (i18n) Module
// Supports multiple languages for the MediScan application

export type Language = 'en' | 'es' | 'fr' | 'pt' | 'hi';

type Translations = {
  [key: string]: string | Translations;
};

const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: 'MediScan AI',
      subtitle: 'Rural Clinic Triage Assistant',
      privacy: 'Privacy-First | All processing local',
    },
    tabs: {
      assess: 'New Assessment',
      results: 'Results',
      history: 'History',
      analytics: 'Analytics',
      medications: 'Medications',
    },
    form: {
      symptoms: 'Describe symptoms',
      symptomsPlaceholder: 'E.g., "fever, cough for 2 days, fatigue"',
      imageLabel: 'Upload medical image (optional)',
      audioLabel: 'Record or upload audio (optional)',
      recordButton: 'Start Recording',
      stopButton: 'Stop Recording',
      uploadImage: 'Upload Image',
      submitButton: 'Submit Assessment',
      clearButton: 'Clear',
    },
    results: {
      urgency: 'Urgency Level',
      diagnosis: 'Preliminary Diagnosis',
      confidence: 'Confidence Score',
      reasoning: 'Clinical Reasoning',
      actions: 'Recommended Actions',
      newAssessment: 'New Assessment',
      saveAndPrint: 'Save & Print',
      disclaimer: 'Clinical Disclaimer',
    },
    medications: {
      title: 'Medication Interaction Checker',
      addMedication: 'Add Medication',
      addCondition: 'Add Condition',
      checkInteractions: 'Check Interactions',
      noInteractions: 'No interactions found',
      drugInteractions: 'Drug-Drug Interactions',
      conditionInteractions: 'Drug-Condition Interactions',
    },
    analytics: {
      title: 'Analytics Dashboard',
      totalAssessments: 'Total Assessments',
      avgConfidence: 'Average Confidence',
      urgencyDistribution: 'Urgency Distribution',
      commonDiagnoses: 'Most Common Diagnoses',
      assessmentsToday: 'Assessments Today',
      highUrgencyRate: 'High Urgency Rate',
    },
    severity: {
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe',
    },
    urgency: {
      LOW: 'Low Priority',
      MEDIUM: 'Medium Priority',
      HIGH: 'High Priority - Urgent',
    },
    messages: {
      loading: 'Processing assessment...',
      error: 'An error occurred. Please try again.',
      success: 'Assessment completed successfully',
      saved: 'Assessment saved',
      offline: 'Operating in offline mode',
    },
  },
  es: {
    header: {
      title: 'MediScan IA',
      subtitle: 'Asistente de Triaje para Clínicas Rurales',
      privacy: 'Privacidad Primero | Todo procesado localmente',
    },
    tabs: {
      assess: 'Nueva Evaluación',
      results: 'Resultados',
      history: 'Historial',
      analytics: 'Análisis',
      medications: 'Medicamentos',
    },
    form: {
      symptoms: 'Describir síntomas',
      symptomsPlaceholder: 'Ej: "fiebre, tos por 2 días, fatiga"',
      imageLabel: 'Subir imagen médica (opcional)',
      audioLabel: 'Grabar o subir audio (opcional)',
      recordButton: 'Iniciar grabación',
      stopButton: 'Detener grabación',
      uploadImage: 'Subir imagen',
      submitButton: 'Enviar evaluación',
      clearButton: 'Limpiar',
    },
    results: {
      urgency: 'Nivel de Urgencia',
      diagnosis: 'Diagnóstico Preliminar',
      confidence: 'Puntuación de Confianza',
      reasoning: 'Razonamiento Clínico',
      actions: 'Acciones Recomendadas',
      newAssessment: 'Nueva Evaluación',
      saveAndPrint: 'Guardar e Imprimir',
      disclaimer: 'Aviso Legal Clínico',
    },
    medications: {
      title: 'Verificador de Interacciones de Medicamentos',
      addMedication: 'Agregar Medicamento',
      addCondition: 'Agregar Condición',
      checkInteractions: 'Verificar Interacciones',
      noInteractions: 'No se encontraron interacciones',
      drugInteractions: 'Interacciones Fármaco-Fármaco',
      conditionInteractions: 'Interacciones Fármaco-Condición',
    },
    analytics: {
      title: 'Panel de Análisis',
      totalAssessments: 'Evaluaciones Totales',
      avgConfidence: 'Confianza Promedio',
      urgencyDistribution: 'Distribución de Urgencia',
      commonDiagnoses: 'Diagnósticos Más Comunes',
      assessmentsToday: 'Evaluaciones Hoy',
      highUrgencyRate: 'Tasa de Alta Urgencia',
    },
    severity: {
      mild: 'Leve',
      moderate: 'Moderado',
      severe: 'Severo',
    },
    urgency: {
      LOW: 'Prioridad Baja',
      MEDIUM: 'Prioridad Media',
      HIGH: 'Prioridad Alta - Urgente',
    },
    messages: {
      loading: 'Procesando evaluación...',
      error: 'Ocurrió un error. Por favor intente de nuevo.',
      success: 'Evaluación completada exitosamente',
      saved: 'Evaluación guardada',
      offline: 'Operando en modo sin conexión',
    },
  },
  fr: {
    header: {
      title: 'MediScan IA',
      subtitle: 'Assistant de Triage pour Cliniques Rurales',
      privacy: 'Confidentialité Prioritaire | Tout traitement local',
    },
    tabs: {
      assess: 'Nouvelle Évaluation',
      results: 'Résultats',
      history: 'Historique',
      analytics: 'Analytique',
      medications: 'Médicaments',
    },
    form: {
      symptoms: 'Décrire les symptômes',
      symptomsPlaceholder: 'Ex: "fièvre, toux depuis 2 jours, fatigue"',
      imageLabel: 'Télécharger une image médicale (optionnel)',
      audioLabel: 'Enregistrer ou télécharger un audio (optionnel)',
      recordButton: 'Commencer l\'enregistrement',
      stopButton: 'Arrêter l\'enregistrement',
      uploadImage: 'Télécharger une image',
      submitButton: 'Soumettre l\'évaluation',
      clearButton: 'Effacer',
    },
    results: {
      urgency: 'Niveau d\'urgence',
      diagnosis: 'Diagnostic Préliminaire',
      confidence: 'Score de Confiance',
      reasoning: 'Raisonnement Clinique',
      actions: 'Actions Recommandées',
      newAssessment: 'Nouvelle Évaluation',
      saveAndPrint: 'Enregistrer et Imprimer',
      disclaimer: 'Avertissement Clinique',
    },
    medications: {
      title: 'Vérificateur d\'Interactions Médicamenteuses',
      addMedication: 'Ajouter un Médicament',
      addCondition: 'Ajouter une Condition',
      checkInteractions: 'Vérifier les Interactions',
      noInteractions: 'Aucune interaction trouvée',
      drugInteractions: 'Interactions Médicament-Médicament',
      conditionInteractions: 'Interactions Médicament-Condition',
    },
    analytics: {
      title: 'Tableau de Bord Analytique',
      totalAssessments: 'Évaluations Totales',
      avgConfidence: 'Confiance Moyenne',
      urgencyDistribution: 'Distribution d\'urgence',
      commonDiagnoses: 'Diagnostics les Plus Courants',
      assessmentsToday: 'Évaluations Aujourd\'hui',
      highUrgencyRate: 'Taux d\'Urgence Élevée',
    },
    severity: {
      mild: 'Légère',
      moderate: 'Modérée',
      severe: 'Grave',
    },
    urgency: {
      LOW: 'Priorité Basse',
      MEDIUM: 'Priorité Moyenne',
      HIGH: 'Priorité Haute - Urgent',
    },
    messages: {
      loading: 'Traitement de l\'évaluation...',
      error: 'Une erreur s\'est produite. Veuillez réessayer.',
      success: 'Évaluation complétée avec succès',
      saved: 'Évaluation enregistrée',
      offline: 'Fonctionnement en mode hors ligne',
    },
  },
  pt: {
    header: {
      title: 'MediScan IA',
      subtitle: 'Assistente de Triagem para Clínicas Rurais',
      privacy: 'Privacidade em Primeiro | Todo processamento local',
    },
    tabs: {
      assess: 'Nova Avaliação',
      results: 'Resultados',
      history: 'Histórico',
      analytics: 'Análise',
      medications: 'Medicamentos',
    },
    form: {
      symptoms: 'Descrever sintomas',
      symptomsPlaceholder: 'Ex: "febre, tosse por 2 dias, fadiga"',
      imageLabel: 'Carregar imagem médica (opcional)',
      audioLabel: 'Gravar ou carregar áudio (opcional)',
      recordButton: 'Iniciar gravação',
      stopButton: 'Parar gravação',
      uploadImage: 'Carregar imagem',
      submitButton: 'Enviar avaliação',
      clearButton: 'Limpar',
    },
    results: {
      urgency: 'Nível de Urgência',
      diagnosis: 'Diagnóstico Preliminar',
      confidence: 'Pontuação de Confiança',
      reasoning: 'Raciocínio Clínico',
      actions: 'Ações Recomendadas',
      newAssessment: 'Nova Avaliação',
      saveAndPrint: 'Salvar e Imprimir',
      disclaimer: 'Aviso Clínico',
    },
    medications: {
      title: 'Verificador de Interações Medicamentosas',
      addMedication: 'Adicionar Medicamento',
      addCondition: 'Adicionar Condição',
      checkInteractions: 'Verificar Interações',
      noInteractions: 'Nenhuma interação encontrada',
      drugInteractions: 'Interações Medicamento-Medicamento',
      conditionInteractions: 'Interações Medicamento-Condição',
    },
    analytics: {
      title: 'Painel de Análise',
      totalAssessments: 'Avaliações Totais',
      avgConfidence: 'Confiança Média',
      urgencyDistribution: 'Distribuição de Urgência',
      commonDiagnoses: 'Diagnósticos Mais Comuns',
      assessmentsToday: 'Avaliações Hoje',
      highUrgencyRate: 'Taxa de Alta Urgência',
    },
    severity: {
      mild: 'Leve',
      moderate: 'Moderado',
      severe: 'Grave',
    },
    urgency: {
      LOW: 'Prioridade Baixa',
      MEDIUM: 'Prioridade Média',
      HIGH: 'Prioridade Alta - Urgente',
    },
    messages: {
      loading: 'Processando avaliação...',
      error: 'Ocorreu um erro. Tente novamente.',
      success: 'Avaliação concluída com sucesso',
      saved: 'Avaliação salva',
      offline: 'Operando em modo offline',
    },
  },
  hi: {
    header: {
      title: 'मेडीस्कैन एआई',
      subtitle: 'ग्रामीण क्लिनिक ट्रिएज सहायक',
      privacy: 'गोपनीयता प्रथम | सभी प्रसंस्करण स्थानीय',
    },
    tabs: {
      assess: 'नया मूल्यांकन',
      results: 'परिणाम',
      history: 'इतिहास',
      analytics: 'विश्लेषण',
      medications: 'दवाएं',
    },
    form: {
      symptoms: 'लक्षणों का वर्णन करें',
      symptomsPlaceholder: 'उदाहरण: "बुखार, 2 दिन की खांसी, थकान"',
      imageLabel: 'चिकित्सा छवि अपलोड करें (वैकल्पिक)',
      audioLabel: 'ऑडियो रिकॉर्ड या अपलोड करें (वैकल्पिक)',
      recordButton: 'रिकॉर्डिंग शुरू करें',
      stopButton: 'रिकॉर्डिंग बंद करें',
      uploadImage: 'छवि अपलोड करें',
      submitButton: 'मूल्यांकन सबमिट करें',
      clearButton: 'साफ करें',
    },
    results: {
      urgency: 'आपातकालीनता स्तर',
      diagnosis: 'प्रारंभिक निदान',
      confidence: 'विश्वास स्कोर',
      reasoning: 'नैदानिक तर्क',
      actions: 'अनुशंसित कार्य',
      newAssessment: 'नया मूल्यांकन',
      saveAndPrint: 'सहेजें और प्रिंट करें',
      disclaimer: 'नैदानिक अस्वीकरण',
    },
    medications: {
      title: 'दवा अंतःक्रिया जांचकर्ता',
      addMedication: 'दवा जोड़ें',
      addCondition: 'स्थिति जोड़ें',
      checkInteractions: 'अंतःक्रिया जांचें',
      noInteractions: 'कोई अंतःक्रिया नहीं मिली',
      drugInteractions: 'दवा-दवा अंतःक्रिया',
      conditionInteractions: 'दवा-स्थिति अंतःक्रिया',
    },
    analytics: {
      title: 'विश्लेषण डैशबोर्ड',
      totalAssessments: 'कुल मूल्यांकन',
      avgConfidence: 'औसत विश्वास',
      urgencyDistribution: 'आपातकालीनता वितरण',
      commonDiagnoses: 'सबसे सामान्य निदान',
      assessmentsToday: 'आज के मूल्यांकन',
      highUrgencyRate: 'उच्च आपातकालीनता दर',
    },
    severity: {
      mild: 'हल्का',
      moderate: 'मध्यम',
      severe: 'गंभीर',
    },
    urgency: {
      LOW: 'कम प्राथमिकता',
      MEDIUM: 'मध्यम प्राथमिकता',
      HIGH: 'उच्च प्राथमिकता - आपातकालीन',
    },
    messages: {
      loading: 'मूल्यांकन प्रसंस्करण...',
      error: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
      success: 'मूल्यांकन सफलतापूर्वक पूर्ण',
      saved: 'मूल्यांकन सहेजा गया',
      offline: 'ऑफ़लाइन मोड में संचालन',
    },
  },
};

let currentLanguage: Language = 'en';

export const setLanguage = (lang: Language) => {
  if (translations[lang]) {
    currentLanguage = lang;
  }
};

export const getLanguage = (): Language => currentLanguage;

export const getAvailableLanguages = (): Language[] => {
  return Object.keys(translations) as Language[];
};

export const t = (path: string): string => {
  const keys = path.split('.');
  let value: any = translations[currentLanguage];

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return the path if translation not found
    }
  }

  return typeof value === 'string' ? value : path;
};
