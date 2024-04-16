import { config } from '@grafana/runtime';

import { DEFAULT_LANGUAGE } from '../constants';
import { Language, SupportedLanguage } from '../types';

/**
 * Get User Language
 * @param fallback
 */
export const getUserLanguage = (fallback = DEFAULT_LANGUAGE): SupportedLanguage => {
  const locale = config?.bootData?.user?.language;
  const lang = locale?.split('-')?.[0];

  /**
   * Validate supported Language
   */
  switch (lang) {
    case Language.EN:
    case Language.ES:
    case Language.FR:
    case Language.DE:
    case Language.ZH: {
      return lang;
    }

    default: {
      return fallback;
    }
  }
};
