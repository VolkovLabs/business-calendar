import { config } from '@grafana/runtime';

import { DEFAULT_LANGUAGE } from '../constants';
import { DateFormat, SupportedLanguage } from '../types';

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
    case DateFormat.EN:
    case DateFormat.ES:
    case DateFormat.FR:
    case DateFormat.DE:
    case DateFormat.ZH: {
      return lang;
    }

    default: {
      return fallback;
    }
  }
};

/**
 * Get Language
 */
export const getLanguage = (dateFormat?: DateFormat): SupportedLanguage => {
  /**
   * Language is not specified in dateFormat so use language from user preferences
   */
  if (!dateFormat || dateFormat === DateFormat.INHERIT || dateFormat === DateFormat.ISO) {
    return getUserLanguage();
  }

  /**
   * Language specified in dateFormat
   */
  switch (dateFormat) {
    case DateFormat.EN_24H: {
      return DateFormat.EN;
    }
    default: {
      return dateFormat;
    }
  }
};
