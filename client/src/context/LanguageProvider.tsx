import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'pt' | 'ar' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // App Name
    'app.name': 'AjnabiCam: Love Connects',
    'app.tagline': 'Where Every Connection Sparks a Story ✨',
    
    // Onboarding
    'onboarding.welcome': 'Welcome to AjnabiCam',
    'onboarding.subtitle': 'Set up your profile to get started',
    'onboarding.username': 'Username',
    'onboarding.username.placeholder': 'Enter your username',
    'onboarding.gender': 'Gender',
    'onboarding.gender.male': 'Male',
    'onboarding.gender.female': 'Female',
    'onboarding.gender.other': 'Other',
    'onboarding.language': 'Language',
    'onboarding.continue': 'Continue',
    'onboarding.skip': 'Skip for now',
    
    // Languages
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.spanish': 'Español (Spanish)',
    'language.french': 'Français (French)',
    'language.german': 'Deutsch (German)',
    'language.portuguese': 'Português (Portuguese)',
    'language.arabic': 'العربية (Arabic)',
    'language.chinese': '中文 (Chinese)',
    
    // Home Screen
    'home.start': 'Find Your Match 💕',
    'home.features.hd': 'HD Video',
    'home.features.secure': 'Safe & Private',
    'home.features.instant': 'Instant Spark',
    
    // Navigation
    'nav.home': 'Home',
    'nav.chat': 'Chat',
    'nav.friends': 'Friends',
    'nav.voice': 'Voice',
    'nav.profile': 'Profile',
    
    // Profile Page
    'profile.title': 'Profile',
    'profile.premium.active': 'Premium Active',
    'profile.premium.enjoying': 'Enjoying all premium features! ✨',
    'profile.premium.upgrade': 'Upgrade to Premium',
    'profile.premium.unlock': 'Unlock exclusive features and enhanced experience!',
    'profile.premium.features.gender': '✓ Gender Filter',
    'profile.premium.features.voice': '✓ Voice Mode',
    'profile.premium.features.unlimited': '✓ Unlimited Time',
    'profile.username': 'Username',
    'profile.addPhoto': 'Add Photo',
    'profile.referral.title': 'Referral Rewards',
    'profile.referral.id': 'Your Referral ID',
    'profile.referral.copy': 'Copy',
    'profile.referral.reward': '🎁 Refer 1 friend successfully = 24h Premium FREE!',
    'profile.referral.share': 'Share your code and both you and your friend get premium benefits',
    'profile.settings': 'Settings',
    'profile.settings.privacy': 'Privacy Settings',
    'profile.settings.notifications': 'Notification Preferences',
    'profile.settings.account': 'Account Settings',
    'profile.settings.language': 'Language Settings',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.back': 'Back',
  },
  hi: {
    // App Name
    'app.name': 'अजनबीकैम',
    'app.tagline': 'अजनबियों से तुरंत जुड़ें',
    
    // Onboarding
    'onboarding.welcome': 'अजनबीकैम में आपका स्वागत है',
    'onboarding.subtitle': 'शुरू करने के लिए अपनी प्रोफ़ाइल सेट करें',
    'onboarding.username': 'उपयोगकर्ता नाम',
    'onboarding.username.placeholder': 'अपना उपयोगकर्ता नाम दर्ज करें',
    'onboarding.gender': 'लिंग',
    'onboarding.gender.male': 'पुरुष',
    'onboarding.gender.female': 'महिला',
    'onboarding.gender.other': 'अन्य',
    'onboarding.language': 'भाषा',
    'onboarding.continue': 'जारी रखें',
    'onboarding.skip': 'अभी छोड़ें',
    
    // Languages
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.spanish': 'Español (Spanish)',
    'language.french': 'Français (French)',
    'language.german': 'Deutsch (German)',
    'language.portuguese': 'Português (Portuguese)',
    'language.arabic': 'العربية (Arabic)',
    'language.chinese': '中文 (Chinese)',
    
    // Home Screen
    'home.start': 'चैट शुरू करें',
    'home.features.hd': 'HD वीडियो',
    'home.features.secure': 'सुरक्षित',
    'home.features.instant': 'तुरंत',
    
    // Navigation
    'nav.home': 'होम',
    'nav.chat': 'चैट',
    'nav.friends': 'दोस्त',
    'nav.voice': 'आवाज़',
    'nav.profile': 'प्रोफ़ाइल',
    
    // Profile Page
    'profile.title': 'प्रोफ़ाइल',
    'profile.premium.active': 'प्रीमियम सक्रिय',
    'profile.premium.enjoying': 'सभी प्रीमियम सुविधाओं का आनंद ले रहे हैं! ✨',
    'profile.premium.upgrade': 'प्रीमियम में अपग्रेड करें',
    'profile.premium.unlock': 'विशेष सुविधाओं और बेहतर अनुभव को अनलॉक करें!',
    'profile.premium.features.gender': '✓ जेंडर फिल्टर',
    'profile.premium.features.voice': '✓ वॉयस मोड',
    'profile.premium.features.unlimited': '✓ असीमित समय',
    'profile.username': 'उपयोगकर्ता नाम',
    'profile.addPhoto': 'फोटो जोड़ें',
    'profile.referral.title': 'रेफरल रिवार्ड्स',
    'profile.referral.id': 'आपका रेफरल आईडी',
    'profile.referral.copy': 'कॉपी करें',
    'profile.referral.reward': '🎁 1 दोस्त को सफलतापूर्वक रेफर करें = 24 घंटे प्रीमियम मुफ्त!',
    'profile.referral.share': 'अपना कोड शेयर करें और आप और आपके दोस्त दोनों को प्रीमियम लाभ मिलें',
    'profile.settings': 'सेटिंग्स',
    'profile.settings.privacy': 'प्राइवेसी सेटिंग्स',
    'profile.settings.notifications': 'नोटिफिकेशन प्राथमिकताएं',
    'profile.settings.account': 'खाता सेटिंग्स',
    'profile.settings.language': 'भाषा सेटिंग्स',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.back': 'वापस',
  },
  es: {
    // App Name
    'app.name': 'AjnabiCam',
    'app.tagline': 'Conecta con extraños al instante',
    
    // Onboarding
    'onboarding.welcome': 'Bienvenido a AjnabiCam',
    'onboarding.subtitle': 'Configura tu perfil para comenzar',
    'onboarding.username': 'Nombre de usuario',
    'onboarding.username.placeholder': 'Ingresa tu nombre de usuario',
    'onboarding.gender': 'Género',
    'onboarding.gender.male': 'Masculino',
    'onboarding.gender.female': 'Femenino',
    'onboarding.gender.other': 'Otro',
    'onboarding.language': 'Idioma',
    'onboarding.continue': 'Continuar',
    'onboarding.skip': 'Omitir por ahora',
    
    // Languages
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.spanish': 'Español (Spanish)',
    'language.french': 'Français (French)',
    'language.german': 'Deutsch (German)',
    'language.portuguese': 'Português (Portuguese)',
    'language.arabic': 'العربية (Arabic)',
    'language.chinese': '中文 (Chinese)',
    
    // Home Screen
    'home.start': 'Comenzar a chatear',
    'home.features.hd': 'Video HD',
    'home.features.secure': 'Seguro',
    'home.features.instant': 'Instantáneo',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.chat': 'Chat',
    'nav.friends': 'Amigos',
    'nav.voice': 'Voz',
    'nav.profile': 'Perfil',
    
    // Profile Page
    'profile.title': 'Perfil',
    'profile.premium.active': 'Premium Activo',
    'profile.premium.enjoying': '¡Disfrutando de todas las funciones premium! ✨',
    'profile.premium.upgrade': 'Actualizar a Premium',
    'profile.premium.unlock': '¡Desbloquea funciones exclusivas y una experiencia mejorada!',
    'profile.premium.features.gender': '✓ Filtro de Género',
    'profile.premium.features.voice': '✓ Modo de Voz',
    'profile.premium.features.unlimited': '✓ Tiempo Ilimitado',
    'profile.username': 'Nombre de usuario',
    'profile.addPhoto': 'Agregar Foto',
    'profile.referral.title': 'Recompensas de Referidos',
    'profile.referral.id': 'Tu ID de Referido',
    'profile.referral.copy': 'Copiar',
    'profile.referral.reward': '🎁 ¡Refiere 1 amigo exitosamente = 24h Premium GRATIS!',
    'profile.referral.share': 'Comparte tu código y tanto tú como tu amigo obtendrán beneficios premium',
    'profile.settings': 'Configuraciones',
    'profile.settings.privacy': 'Configuración de Privacidad',
    'profile.settings.notifications': 'Preferencias de Notificación',
    'profile.settings.account': 'Configuración de Cuenta',
    'profile.settings.language': 'Configuración de Idioma',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.back': 'Atrás',
  },
  fr: {
    // App Name
    'app.name': 'AjnabiCam',
    'app.tagline': 'Connectez-vous instantanément avec des inconnus',
    
    // Onboarding
    'onboarding.welcome': 'Bienvenue sur AjnabiCam',
    'onboarding.subtitle': 'Configurez votre profil pour commencer',
    'onboarding.username': "Nom d'utilisateur",
    'onboarding.username.placeholder': "Entrez votre nom d'utilisateur",
    'onboarding.gender': 'Genre',
    'onboarding.gender.male': 'Masculin',
    'onboarding.gender.female': 'Féminin',
    'onboarding.gender.other': 'Autre',
    'onboarding.language': 'Langue',
    'onboarding.continue': 'Continuer',
    'onboarding.skip': 'Passer pour maintenant',
    
    // Languages
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.spanish': 'Español (Spanish)',
    'language.french': 'Français (French)',
    'language.german': 'Deutsch (German)',
    'language.portuguese': 'Português (Portuguese)',
    'language.arabic': 'العربية (Arabic)',
    'language.chinese': '中文 (Chinese)',
    
    // Home Screen
    'home.start': 'Commencer à chatter',
    'home.features.hd': 'Vidéo HD',
    'home.features.secure': 'Sécurisé',
    'home.features.instant': 'Instantané',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.chat': 'Chat',
    'nav.friends': 'Amis',
    'nav.voice': 'Voix',
    'nav.profile': 'Profil',
    
    // Profile Page
    'profile.title': 'Profil',
    'profile.premium.active': 'Premium Actif',
    'profile.premium.enjoying': 'Profitez de toutes les fonctionnalités premium ! ✨',
    'profile.premium.upgrade': 'Passer à Premium',
    'profile.premium.unlock': 'Débloquez des fonctionnalités exclusives et une expérience améliorée !',
    'profile.premium.features.gender': '✓ Filtre de Genre',
    'profile.premium.features.voice': '✓ Mode Vocal',
    'profile.premium.features.unlimited': '✓ Temps Illimité',
    'profile.username': "Nom d'utilisateur",
    'profile.addPhoto': 'Ajouter une Photo',
    'profile.referral.title': 'Récompenses de Parrainage',
    'profile.referral.id': 'Votre ID de Parrainage',
    'profile.referral.copy': 'Copier',
    'profile.referral.reward': '🎁 Parrainez 1 ami avec succès = 24h Premium GRATUIT !',
    'profile.referral.share': 'Partagez votre code et vous et votre ami obtiendrez des avantages premium',
    'profile.settings': 'Paramètres',
    'profile.settings.privacy': 'Paramètres de Confidentialité',
    'profile.settings.notifications': 'Préférences de Notification',
    'profile.settings.account': 'Paramètres du Compte',
    'profile.settings.language': 'Paramètres de Langue',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
    'common.back': 'Retour',
  },
  de: {
    // App Name
    'app.name': 'AjnabiCam',
    'app.tagline': 'Verbinde dich sofort mit Fremden',
    
    // Onboarding
    'onboarding.welcome': 'Willkommen bei AjnabiCam',
    'onboarding.subtitle': 'Richte dein Profil ein, um zu beginnen',
    'onboarding.username': 'Benutzername',
    'onboarding.username.placeholder': 'Gib deinen Benutzernamen ein',
    'onboarding.gender': 'Geschlecht',
    'onboarding.gender.male': 'Männlich',
    'onboarding.gender.female': 'Weiblich',
    'onboarding.gender.other': 'Andere',
    'onboarding.language': 'Sprache',
    'onboarding.continue': 'Weiter',
    'onboarding.skip': 'Vorerst überspringen',
    
    // Languages
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.spanish': 'Español (Spanish)',
    'language.french': 'Français (French)',
    'language.german': 'Deutsch (German)',
    'language.portuguese': 'Português (Portuguese)',
    'language.arabic': 'العربية (Arabic)',
    'language.chinese': '中文 (Chinese)',
    
    // Home Screen
    'home.start': 'Chat starten',
    'home.features.hd': 'HD Video',
    'home.features.secure': 'Sicher',
    'home.features.instant': 'Sofort',
    
    // Navigation
    'nav.home': 'Startseite',
    'nav.chat': 'Chat',
    'nav.friends': 'Freunde',
    'nav.voice': 'Stimme',
    'nav.profile': 'Profil',
    
    // Profile Page
    'profile.title': 'Profil',
    'profile.premium.active': 'Premium Aktiv',
    'profile.premium.enjoying': 'Genieße alle Premium-Funktionen! ✨',
    'profile.premium.upgrade': 'Auf Premium upgraden',
    'profile.premium.unlock': 'Schalte exklusive Funktionen und verbesserte Erfahrung frei!',
    'profile.premium.features.gender': '✓ Geschlechtsfilter',
    'profile.premium.features.voice': '✓ Sprachmodus',
    'profile.premium.features.unlimited': '✓ Unbegrenzte Zeit',
    'profile.username': 'Benutzername',
    'profile.addPhoto': 'Foto hinzufügen',
    'profile.referral.title': 'Empfehlungsbelohnungen',
    'profile.referral.id': 'Deine Empfehlungs-ID',
    'profile.referral.copy': 'Kopieren',
    'profile.referral.reward': '🎁 Empfehle 1 Freund erfolgreich = 24h Premium KOSTENLOS!',
    'profile.referral.share': 'Teile deinen Code und sowohl du als auch dein Freund erhalten Premium-Vorteile',
    'profile.settings': 'Einstellungen',
    'profile.settings.privacy': 'Datenschutz-Einstellungen',
    'profile.settings.notifications': 'Benachrichtigungseinstellungen',
    'profile.settings.account': 'Kontoeinstellungen',
    'profile.settings.language': 'Spracheinstellungen',
    
    // Common
    'common.loading': 'Lädt...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.back': 'Zurück',
  },
  pt: {
    // App Name
    'app.name': 'AjnabiCam',
    'app.tagline': 'Conecte-se instantaneamente com estranhos',
    
    // Onboarding
    'onboarding.welcome': 'Bem-vindo ao AjnabiCam',
    'onboarding.subtitle': 'Configure seu perfil para começar',
    'onboarding.username': 'Nome de usuário',
    'onboarding.username.placeholder': 'Digite seu nome de usuário',
    'onboarding.gender': 'Gênero',
    'onboarding.gender.male': 'Masculino',
    'onboarding.gender.female': 'Feminino',
    'onboarding.gender.other': 'Outro',
    'onboarding.language': 'Idioma',
    'onboarding.continue': 'Continuar',
    'onboarding.skip': 'Pular por agora',
    
    // Languages
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.spanish': 'Español (Spanish)',
    'language.french': 'Français (French)',
    'language.german': 'Deutsch (German)',
    'language.portuguese': 'Português (Portuguese)',
    'language.arabic': 'العربية (Arabic)',
    'language.chinese': '中文 (Chinese)',
    
    // Home Screen
    'home.start': 'Começar a conversar',
    'home.features.hd': 'Vídeo HD',
    'home.features.secure': 'Seguro',
    'home.features.instant': 'Instantâneo',
    
    // Navigation
    'nav.home': 'Início',
    'nav.chat': 'Chat',
    'nav.friends': 'Amigos',
    'nav.voice': 'Voz',
    'nav.profile': 'Perfil',
    
    // Profile Page
    'profile.title': 'Perfil',
    'profile.premium.active': 'Premium Ativo',
    'profile.premium.enjoying': 'Aproveitando todos os recursos premium! ✨',
    'profile.premium.upgrade': 'Atualizar para Premium',
    'profile.premium.unlock': 'Desbloqueie recursos exclusivos e experiência aprimorada!',
    'profile.premium.features.gender': '✓ Filtro de Gênero',
    'profile.premium.features.voice': '✓ Modo de Voz',
    'profile.premium.features.unlimited': '✓ Tempo Ilimitado',
    'profile.username': 'Nome de usuário',
    'profile.addPhoto': 'Adicionar Foto',
    'profile.referral.title': 'Recompensas de Indicação',
    'profile.referral.id': 'Seu ID de Indicação',
    'profile.referral.copy': 'Copiar',
    'profile.referral.reward': '🎁 Indique 1 amigo com sucesso = 24h Premium GRÁTIS!',
    'profile.referral.share': 'Compartilhe seu código e tanto você quanto seu amigo receberão benefícios premium',
    'profile.settings': 'Configurações',
    'profile.settings.privacy': 'Configurações de Privacidade',
    'profile.settings.notifications': 'Preferências de Notificação',
    'profile.settings.account': 'Configurações da Conta',
    'profile.settings.language': 'Configurações de Idioma',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.back': 'Voltar',
  },
  ar: {
    // App Name
    'app.name': 'أجنبي كام',
    'app.tagline': 'تواصل مع الغرباء فوراً',
    
    // Onboarding
    'onboarding.welcome': 'مرحباً بك في أجنبي كام',
    'onboarding.subtitle': 'قم بإعداد ملفك الشخصي للبدء',
    'onboarding.username': 'اسم المستخدم',
    'onboarding.username.placeholder': 'أدخل اسم المستخدم',
    'onboarding.gender': 'الجنس',
    'onboarding.gender.male': 'ذكر',
    'onboarding.gender.female': 'أنثى',
    'onboarding.gender.other': 'آخر',
    'onboarding.language': 'اللغة',
    'onboarding.continue': 'متابعة',
    'onboarding.skip': 'تخطي الآن',
    
    // Languages
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.spanish': 'Español (Spanish)',
    'language.french': 'Français (French)',
    'language.german': 'Deutsch (German)',
    'language.portuguese': 'Português (Portuguese)',
    'language.arabic': 'العربية (Arabic)',
    'language.chinese': '中文 (Chinese)',
    
    // Home Screen
    'home.start': 'بدء المحادثة',
    'home.features.hd': 'فيديو عالي الدقة',
    'home.features.secure': 'آمن',
    'home.features.instant': 'فوري',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.chat': 'المحادثة',
    'nav.friends': 'الأصدقاء',
    'nav.voice': 'الصوت',
    'nav.profile': 'الملف الشخصي',
    
    // Profile Page
    'profile.title': 'الملف الشخصي',
    'profile.premium.active': 'البريميوم نشط',
    'profile.premium.enjoying': 'استمتع بجميع ميزات البريميوم! ✨',
    'profile.premium.upgrade': 'الترقية إلى البريميوم',
    'profile.premium.unlock': 'افتح الميزات الحصرية والتجربة المحسنة!',
    'profile.premium.features.gender': '✓ فلتر الجنس',
    'profile.premium.features.voice': '✓ وضع الصوت',
    'profile.premium.features.unlimited': '✓ وقت غير محدود',
    'profile.username': 'اسم المستخدم',
    'profile.addPhoto': 'إضافة صورة',
    'profile.referral.title': 'مكافآت الإحالة',
    'profile.referral.id': 'معرف الإحالة الخاص بك',
    'profile.referral.copy': 'نسخ',
    'profile.referral.reward': '🎁 أحل صديق واحد بنجاح = 24 ساعة بريميوم مجاناً!',
    'profile.referral.share': 'شارك رمزك وستحصل أنت وصديقك على مزايا البريميوم',
    'profile.settings': 'الإعدادات',
    'profile.settings.privacy': 'إعدادات الخصوصية',
    'profile.settings.notifications': 'تفضيلات الإشعارات',
    'profile.settings.account': 'إعدادات الحساب',
    'profile.settings.language': 'إعدادات اللغة',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.back': 'رجوع',
  },
  zh: {
    // App Name
    'app.name': '陌生人摄像头',
    'app.tagline': '立即与陌生人连接',
    
    // Onboarding
    'onboarding.welcome': '欢迎来到陌生人摄像头',
    'onboarding.subtitle': '设置您的个人资料以开始',
    'onboarding.username': '用户名',
    'onboarding.username.placeholder': '输入您的用户名',
    'onboarding.gender': '性别',
    'onboarding.gender.male': '男性',
    'onboarding.gender.female': '女性',
    'onboarding.gender.other': '其他',
    'onboarding.language': '语言',
    'onboarding.continue': '继续',
    'onboarding.skip': '暂时跳过',
    
    // Languages
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.spanish': 'Español (Spanish)',
    'language.french': 'Français (French)',
    'language.german': 'Deutsch (German)',
    'language.portuguese': 'Português (Portuguese)',
    'language.arabic': 'العربية (Arabic)',
    'language.chinese': '中文 (Chinese)',
    
    // Home Screen
    'home.start': '开始聊天',
    'home.features.hd': '高清视频',
    'home.features.secure': '安全',
    'home.features.instant': '即时',
    
    // Navigation
    'nav.home': '首页',
    'nav.chat': '聊天',
    'nav.friends': '朋友',
    'nav.voice': '语音',
    'nav.profile': '个人资料',
    
    // Profile Page
    'profile.title': '个人资料',
    'profile.premium.active': '高级版已激活',
    'profile.premium.enjoying': '享受所有高级功能！✨',
    'profile.premium.upgrade': '升级到高级版',
    'profile.premium.unlock': '解锁独家功能和增强体验！',
    'profile.premium.features.gender': '✓ 性别过滤器',
    'profile.premium.features.voice': '✓ 语音模式',
    'profile.premium.features.unlimited': '✓ 无限时间',
    'profile.username': '用户名',
    'profile.addPhoto': '添加照片',
    'profile.referral.title': '推荐奖励',
    'profile.referral.id': '您的推荐ID',
    'profile.referral.copy': '复制',
    'profile.referral.reward': '🎁 成功推荐1位朋友 = 24小时高级版免费！',
    'profile.referral.share': '分享您的代码，您和您的朋友都将获得高级版福利',
    'profile.settings': '设置',
    'profile.settings.privacy': '隐私设置',
    'profile.settings.notifications': '通知偏好',
    'profile.settings.account': '账户设置',
    'profile.settings.language': '语言设置',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.back': '返回',
  },
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('ajnabicam_language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ajnabicam_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const languages: Array<{ code: Language; name: string; flag: string }> = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];