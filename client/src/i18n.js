import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "dashboard": "Dashboard",
      "addExpense": "Add Expense",
      "totalExpenses": "Total Expenses",
      "recentTransactions": "Recent Transactions",
      "login": "Login",
      "register": "Register",
      "email": "Email Address",
      "password": "Password",
      "name": "Full Name",
      "amount": "Amount",
      "category": "Category",
      "description": "Description",
      "save": "Save Expense",
      "aiPrompt": "Tell me what you spent... (e.g., Uber for $15)",
      "language": "Language",
      "currency": "Currency",
      "settings": "Settings",
      "logout": "Logout",
      "noExpenses": "No recent expenses found.",
      "welcome": "Welcome back",
      "askAi": "Ask AI...",
      "aiInsights": "AI Assistant"
    }
  },
  es: {
    translation: {
      "dashboard": "Panel",
      "addExpense": "Añadir Gasto",
      "totalExpenses": "Gastos Totales",
      "recentTransactions": "Transacciones Recientes",
      "login": "Iniciar Sesión",
      "register": "Registrarse",
      "email": "Correo Electrónico",
      "password": "Contraseña",
      "name": "Nombre Completo",
      "amount": "Cantidad",
      "category": "Categoría",
      "description": "Descripción",
      "save": "Guardar Gasto",
      "aiPrompt": "Dime qué gastaste... (ej., Uber por 15€)",
      "language": "Idioma",
      "currency": "Moneda",
      "settings": "Configuración",
      "logout": "Cerrar Sesión",
      "noExpenses": "No se encontraron gastos recientes.",
      "welcome": "Bienvenido de nuevo",
      "askAi": "Preguntar a la IA...",
      "aiInsights": "Asistente IA"
    }
  },
  fr: {
    translation: {
      "dashboard": "Tableau de bord",
      "addExpense": "Ajouter une dépense",
      "totalExpenses": "Dépenses totales",
      "recentTransactions": "Transactions récentes",
      "login": "Connexion",
      "register": "S'inscrire",
      "email": "Adresse e-mail",
      "password": "Mot de passe",
      "name": "Nom complet",
      "amount": "Montant",
      "category": "Catégorie",
      "description": "Description",
      "save": "Enregistrer la dépense",
      "aiPrompt": "Dites-moi ce que vous avez dépensé...",
      "language": "Langue",
      "currency": "Devise",
      "settings": "Paramètres",
      "logout": "Déconnexion",
      "noExpenses": "Aucune dépense récente trouvée.",
      "welcome": "Bon retour",
      "askAi": "Demander à l'IA...",
      "aiInsights": "Assistant IA"
    }
  },
  de: {
    translation: {
      "dashboard": "Dashboard",
      "addExpense": "Ausgabe hinzufügen",
      "totalExpenses": "Gesamtausgaben",
      "recentTransactions": "Aktuelle Transaktionen",
      "login": "Anmelden",
      "register": "Registrieren",
      "email": "E-Mail-Adresse",
      "password": "Passwort",
      "name": "Vollständiger Name",
      "amount": "Betrag",
      "category": "Kategorie",
      "description": "Beschreibung",
      "save": "Ausgabe speichern",
      "aiPrompt": "Sag mir, was du ausgegeben hast...",
      "language": "Sprache",
      "currency": "Währung",
      "settings": "Einstellungen",
      "logout": "Abmelden",
      "noExpenses": "Keine aktuellen Ausgaben gefunden.",
      "welcome": "Willkommen zurück",
      "askAi": "KI fragen...",
      "aiInsights": "KI-Assistent"
    }
  },
  it: {
    translation: {
      "dashboard": "Pannello",
      "addExpense": "Aggiungi Spesa",
      "totalExpenses": "Spese Totali",
      "recentTransactions": "Transazioni Recenti",
      "login": "Accedi",
      "register": "Registrati",
      "email": "Indirizzo Email",
      "password": "Password",
      "name": "Nome Completo",
      "amount": "Importo",
      "category": "Categoria",
      "description": "Descrizione",
      "save": "Salva Spesa",
      "aiPrompt": "Dimmi cosa hai speso...",
      "language": "Lingua",
      "currency": "Valuta",
      "settings": "Impostazioni",
      "logout": "Esci",
      "noExpenses": "Nessuna spesa recente trovata.",
      "welcome": "Bentornato",
      "askAi": "Chiedi all'IA...",
      "aiInsights": "Assistente IA"
    }
  },
  pt: {
    translation: {
      "dashboard": "Painel",
      "addExpense": "Adicionar Despesa",
      "totalExpenses": "Despesas Totais",
      "recentTransactions": "Transações Recentes",
      "login": "Entrar",
      "register": "Registrar",
      "email": "Endereço de Email",
      "password": "Senha",
      "name": "Nome Completo",
      "amount": "Valor",
      "category": "Categoria",
      "description": "Descrição",
      "save": "Salvar Despesa",
      "aiPrompt": "Diga-me o que você gastou...",
      "language": "Idioma",
      "currency": "Moeda",
      "settings": "Configurações",
      "logout": "Sair",
      "noExpenses": "Nenhuma despesa recente encontrada.",
      "welcome": "Bem-vindo de volta",
      "askAi": "Pergunte à IA...",
      "aiInsights": "Assistente de IA"
    }
  },
  hi: {
    translation: {
      "dashboard": "डैशबोर्ड",
      "addExpense": "खर्च जोड़ें",
      "totalExpenses": "कुल खर्च",
      "recentTransactions": "हाल के लेनदेन",
      "login": "लॉग इन",
      "register": "रजिस्टर",
      "email": "ईमेल पता",
      "password": "पासवर्ड",
      "name": "पूरा नाम",
      "amount": "रकम",
      "category": "श्रेणी",
      "description": "विवरण",
      "save": "खर्च सहेजें",
      "aiPrompt": "मुझे बताएं कि आपने क्या खर्च किया...",
      "language": "भाषा",
      "currency": "मुद्रा",
      "settings": "सेटिंग्स",
      "logout": "लॉग आउट",
      "noExpenses": "कोई हालिया खर्च नहीं मिला।",
      "welcome": "वापसी पर स्वागत है",
      "askAi": "AI से पूछें...",
      "aiInsights": "AI सहायक"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
