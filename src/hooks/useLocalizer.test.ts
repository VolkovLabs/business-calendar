import dayjs from 'dayjs';
import { config } from '@grafana/runtime';
import { renderHook } from '@testing-library/react';
import { LanguageMessages } from '../constants';
import { useLocalizer } from './useLocalizer';

/**
 * Mock @grafana/runtime
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

describe('Use Localizer', () => {
  it('Should set dayjs locale', () => {
    config.bootData = {
      user: {
        language: 'fr-EN',
      },
    } as any;
    renderHook(() => useLocalizer());

    expect(dayjs.locale()).toEqual('fr');
  });

  it('Should set dayjs locale', () => {
    config.bootData = {
      user: {},
    } as any;
    renderHook(() => useLocalizer());

    expect(dayjs.locale()).toEqual('en');
  });

  it('Should set default dayjs locale', () => {
    config.bootData = {
      user: {
        language: '123',
      },
    } as any;
    renderHook(() => useLocalizer());

    expect(dayjs.locale()).toEqual('en');
  });

  ['es-SP', 'fr-EN', 'de-GE', 'zh-CH'].forEach((locale) => {
    it(`Should set messages for ${locale}`, () => {
      config.bootData = {
        user: {
          language: locale,
        },
      } as any;
      const { result } = renderHook(() => useLocalizer());

      const lang = locale.split('-')[0]
      const expectedMessages = LanguageMessages[lang];
      expect(result.current.messages).toEqual(expectedMessages)
      if (result.current.messages.showMore && expectedMessages.showMore) {
        expect(result.current.messages.showMore(10)).toEqual(expectedMessages.showMore(10))
      }
    });
  })

});
