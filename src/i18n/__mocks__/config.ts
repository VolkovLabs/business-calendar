import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from '../translations';
import { Languages } from '../../constants';

/**
 * Default Namespace
 */
export const defaultNS = 'translation';

/**
 * Init i18next
 */
i18next.use(initReactI18next).init({
  lng: Languages.EN,
  debug: false,
  resources,
  defaultNS,
});

/**
 * I18Next instance
 */
export { i18next };
