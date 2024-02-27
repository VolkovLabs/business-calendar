import { config } from '@grafana/runtime';

import { DEFAULT_LANGUAGE } from '../constants';
import { Language } from '../types';
import { getUserLanguage } from './locale';

/**
 * Mock User Language
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
        expectedLanguage: Language.EN,
      },
      {
        locale: 'es-Any',
        expectedLanguage: Language.ES,
      },
      {
        locale: 'fr-Any',
        expectedLanguage: Language.FR,
      },
      {
        locale: 'de-Any',
        expectedLanguage: Language.DE,
      },
      {
        locale: 'zh-Any',
        expectedLanguage: Language.ZH,
      },
    ])('Should return user lang $expectedLanguage for $locale', ({ locale, expectedLanguage }) => {
      config.bootData.user.language = locale;
      expect(getUserLanguage()).toEqual(expectedLanguage);
    });

    it('Should return fallback lang', () => {
      config.bootData.user.language = '';
      expect(getUserLanguage()).toEqual(DEFAULT_LANGUAGE);
    });
  });
});
