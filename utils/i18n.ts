import { Lang } from '../types/global.d'; // Tipos de idioma

// --- Traducciones para cada idioma ---
const translations = {
  es: {
    // Traducciones de login
    login: { /* ... */ },
    // Traducciones del sidebar
    sidebar: { /* ... */ },
    // Traducciones de vistas
    views: { /* ... */ },
    // Traducciones de ayuda
    help: { /* ... */ },
    // Traducciones de perfil
    profile: { /* ... */ },
    // Traducciones del dashboard
    dashboard: { /* ... */ },
    // Traducciones de cámaras
    cameras: { /* ... */ },
    // Traducciones de analítica
    analytics: { /* ... */ },
    // Traducciones de reportes
    reports: { /* ... */ },
    // Traducciones del registro de eventos
    logs: { /* ... */ },
    // Traducciones de ajustes
    settings: { /* ... */ },
    // Traducciones de modales de edición
    editModal: { /* ... */ },
    editUserModal: { /* ... */ },
    // Traducciones del tour
    tour: { /* ... */ },
    // Traducciones de alertas y eventos
    alert: { /* ... */ },
    // Traducciones de gráficos
    charts: { /* ... */ },
  },
  en: {
    // Traducciones de login en inglés
    login: { /* ... */ },
    // Traducciones del sidebar en inglés
    sidebar: { /* ... */ },
    // Traducciones de vistas en inglés
    views: { /* ... */ },
    // Traducciones de ayuda en inglés
    help: { /* ... */ },
    // Traducciones de perfil en inglés
    profile: { /* ... */ },
    // Traducciones del dashboard en inglés
    dashboard: { /* ... */ },
    // Traducciones de cámaras en inglés
    cameras: { /* ... */ },
    // Traducciones de analítica en inglés
    analytics: { /* ... */ },
    // Traducciones de reportes en inglés
    reports: { /* ... */ },
    // Traducciones del registro de eventos en inglés
    logs: { /* ... */ },
    // Traducciones de ajustes en inglés
    settings: { /* ... */ },
    // Traducciones de modales de edición en inglés
    editModal: { /* ... */ },
    editUserModal: { /* ... */ },
    // Traducciones del tour en inglés
    tour: { /* ... */ },
    // Traducciones de alertas y eventos en inglés
    alert: { /* ... */ },
    // Traducciones de gráficos en inglés
    charts: { /* ... */ },
  },
};

// --- Función para reemplazar placeholders en cadenas ---
export const interpolate = (str: string, args?: Record<string, string>) => {
  if (!args) return str;
  // Reemplaza {clave} por el valor correspondiente en args
  return str.replace(/{(\w+)}/g, (_, key) => args[key] || key);
};

/**
 * Función principal que devuelve la función de traducción.
 * Si no encuentra la clave en el idioma actual, hace fallback a inglés.
 */
export const getT = (lang: Lang) => {
  return (key: string, args?: Record<string, string>) => {
    const keys = key.split('.'); // Separar claves por niveles
    let val = translations[lang] as any; // Obtenemos la sección correspondiente
    try {
      // Navegar por los niveles de la clave
      for (const k of keys) {
        val = val[k];
      }
      // Si no es string, lanzar error para fallback
      if (typeof val !== 'string') throw new Error();
      return interpolate(val, args); // Reemplazar placeholders
    } catch (e) {
      // Fallback al inglés si no se encuentra la clave
      try {
        val = translations['en'] as any;
        for (const k of keys) {
          val = val[k];
        }
        if (typeof val !== 'string') return key; // Retorna la clave si no existe en inglés
        return interpolate(val, args);
      } catch (e2) {
        return key; // Retorna la clave si no existe en ningún idioma
      }
    }
  };
};

// --- Exportaciones ---
export const i18n = {
  translations, // Todas las traducciones
  getT,         // Función para obtener traducciones
  interpolate,  // Función de reemplazo de placeholders
};
