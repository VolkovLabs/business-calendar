import { defaultNamespace, resources } from '../i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    defaultNS: typeof defaultNamespace;
    resources: typeof resources.en;
  }
}
