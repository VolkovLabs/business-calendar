import { config } from '@grafana/runtime';
import { DefaultLanguage } from '../constants';
import { SupportedLanguage } from '../types';

/**
 * Get User Language
 * @param fallback
 */
export const getUserLanguage = (fallback = DefaultLanguage): SupportedLanguage => {
  const locale = config.bootData.user.language;
  const lang = locale?.split('-')?.[0];

  /**
   * Validate supported languages
   */
  switch (lang) {
    case 'en':
    case 'es':
    case 'fr':
    case 'de':
    case 'zh': {
      return lang;
    }

    default: {
      return fallback;
    }
  }
};
