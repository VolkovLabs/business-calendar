import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DateFormat } from '../types';
import { getLanguage, getUserLanguage } from '../utils';
import { resources } from './translations';

/**
 * Default Namespace
 */
export const defaultNamespace = 'translation';

/**
 * Create new instance
 */
export const i18nextInstance = (lang: DateFormat) => {
  const currentLang = getLanguage(lang);

  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    lng: currentLang,
    debug: false,
    resources,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    defaultNS: defaultNamespace,
  });

  return instance;
};

/**
 * Init i18next
 */
i18next.use(initReactI18next).init({
  lng: getUserLanguage(),
  debug: false,
  resources,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  defaultNS: defaultNamespace,
});

/**
 * I18Next instance
 */
export { i18next };
