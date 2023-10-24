import { config } from '@grafana/runtime';
import { DefaultLanguage, Languages } from '../constants';
import { SupportedLanguage } from '../types';

/**
 * Get User Language
 * @param fallback
 */
export const getUserLanguage = (fallback = DefaultLanguage): SupportedLanguage => {
  const locale = config?.bootData?.user?.language;
  const lang = locale?.split('-')?.[0];

  /**
   * Validate supported languages
   */
  switch (lang) {
    case Languages.EN:
    case Languages.ES:
    case Languages.FR:
    case Languages.DE:
    case Languages.ZH: {
      return lang;
    }

    default: {
      return fallback;
    }
  }
};
