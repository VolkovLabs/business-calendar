import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DateFormat } from '../../types';
import { resources } from '../translations';

/**
 * Default Namespace
 */
export const defaultNamespace = 'translation';

/**
 * Init i18next
 */
i18next.use(initReactI18next).init({
  lng: DateFormat.EN,
  debug: false,
  resources,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  defaultNS: defaultNamespace,
});

/**
 * I18Next instance
 */
export { i18next };
