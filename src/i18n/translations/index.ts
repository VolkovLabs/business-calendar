import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import zh from './zh.json';

/**
 * Translation Resources
 */
export const resources = {
  /**
   * English
   */
  en: {
    translation: en,
  },

  /**
   * Spanish
   */
  es: {
    translation: es,
  },

  /**
   * French
   */
  fr: {
    translation: fr,
  },

  /**
   * German
   */
  de: {
    translation: de,
  },

  /**
   * Chinese
   */
  zh: {
    translation: zh,
  },
} as const;
