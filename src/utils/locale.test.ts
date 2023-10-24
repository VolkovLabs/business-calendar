import { config } from '@grafana/runtime';
import { DefaultLanguage } from '../constants';
import { getUserLanguage } from './locale';

/**
 * Mock User Lang
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
        expectedLanguage: 'en',
      },
      {
        locale: 'es-Any',
        expectedLanguage: 'es',
      },
      {
        locale: 'fr-Any',
        expectedLanguage: 'fr',
      },
      {
        locale: 'de-Any',
        expectedLanguage: 'de',
      },
      {
        locale: 'zh-Any',
        expectedLanguage: 'zh',
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
