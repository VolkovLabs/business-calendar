import dayjs from 'dayjs';
import { renderHook } from '@testing-library/react';
import { t } from 'i18next';
import { getUserLanguage } from '../utils';
import { useLocalizer } from './useLocalizer';

/**
 * Mock utils
 */
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  getUserLanguage: jest.fn(() => 'en'),
}));

describe('Use Localizer', () => {
  it('Should set dayjs locale', () => {
    jest.mocked(getUserLanguage).mockReturnValue('fr');
    renderHook(() => useLocalizer());

    expect(dayjs.locale()).toEqual('fr');
  });

  it('Should set dayjs locale', () => {
    jest.mocked(getUserLanguage).mockReturnValue('en');
    renderHook(() => useLocalizer());

    expect(dayjs.locale()).toEqual('en');
  });

  it('Should set default dayjs locale', () => {
    jest.mocked(getUserLanguage).mockReturnValue('123' as any);
    renderHook(() => useLocalizer());

    expect(dayjs.locale()).toEqual('en');
  });

  ['es', 'fr', 'de', 'zh'].forEach((lang) => {
    it(`Should set messages for ${lang}`, () => {
      jest.mocked(getUserLanguage).mockReturnValue(lang as any);
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.messages.noEventsInRange).toEqual(t('localizerMessages.noEventsInRange'));
      if (result.current.messages.showMore) {
        expect(result.current.messages.showMore(10)).toEqual(t('localizerMessages.showMore', { total: 10 }));
      }
    });
  });
});
