import { config } from '@grafana/runtime';

import { DEFAULT_LANGUAGE } from '../constants';
import { DateFormat } from '../types';
import { getLanguage, getUserLanguage } from './locale';

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
        expectedLanguage: DateFormat.EN,
      },
      {
        locale: 'es-Any',
        expectedLanguage: DateFormat.ES,
      },
      {
        locale: 'fr-Any',
        expectedLanguage: DateFormat.FR,
      },
      {
        locale: 'de-Any',
        expectedLanguage: DateFormat.DE,
      },
      {
        locale: 'zh-Any',
        expectedLanguage: DateFormat.ZH,
      },
      {
        locale: 'pt-Any',
        expectedLanguage: DateFormat.PT,
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

  describe('getLanguage', () => {
    it('Should take language from dateFormat', () => {
      expect(getLanguage(DateFormat.EN_24H)).toEqual(DateFormat.EN);
      expect(getLanguage(DateFormat.FR)).toEqual(DateFormat.FR);
    });

    it('Should take language from user preferences', () => {
      config.bootData.user.language = 'de-Any';

      expect(getLanguage()).toEqual(DateFormat.DE);
      expect(getLanguage(DateFormat.INHERIT)).toEqual(DateFormat.DE);
      expect(getLanguage(DateFormat.ISO)).toEqual(DateFormat.DE);
    });
  });
});
