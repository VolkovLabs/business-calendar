import { config } from '@grafana/runtime';

import { DefaultLanguage, Languages } from '../constants';
import { getUserLanguage } from './locale';

/**
 * Mock User Languages
 */
jest.mock('@grafana/runtime', () => ({
  config: {
    bootData: {
      user: {
        language: 'en-US',
      },
    },
  },
}));

describe('Locale Utils', () => {
  describe('getUserLanguage', () => {
    it.each([
      {
        locale: 'en-Any',
        expectedLanguage: Languages.EN,
      },
      {
        locale: 'es-Any',
        expectedLanguage: Languages.ES,
      },
      {
        locale: 'fr-Any',
        expectedLanguage: Languages.FR,
      },
      {
        locale: 'de-Any',
        expectedLanguage: Languages.DE,
      },
      {
        locale: 'zh-Any',
        expectedLanguage: Languages.ZH,
      },
    ])('Should return user lang $expectedLanguage for $locale', ({ locale, expectedLanguage }) => {
      config.bootData.user.language = locale;
      expect(getUserLanguage()).toEqual(expectedLanguage);
    });

    it('Should return fallback lang', () => {
      config.bootData.user.language = '';
      expect(getUserLanguage()).toEqual(DefaultLanguage);
    });
  });
});
