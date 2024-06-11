import { renderHook } from '@testing-library/react';
import dayjs from 'dayjs';
import { t } from 'i18next';

import { DateFormat } from '../types';
import { getUserLanguage } from '../utils';
import { useLocalizer } from './useLocalizer';

/**
 * Mock utils
 */
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  getUserLanguage: jest.fn(() => DateFormat.EN),
}));

describe('Use Localizer', () => {
  const options: any = {
    dateFormat: DateFormat.INHERIT,
  };

  it('Should set dayjs locale', () => {
    jest.mocked(getUserLanguage).mockReturnValue(DateFormat.FR);
    renderHook(() => useLocalizer(options));

    expect(dayjs.locale()).toEqual(DateFormat.FR);
  });

  it('Should set dayjs locale', () => {
    jest.mocked(getUserLanguage).mockReturnValue(DateFormat.EN);
    renderHook(() => useLocalizer(options));

    expect(dayjs.locale()).toEqual(DateFormat.EN);
  });

  it('Should set default dayjs locale', () => {
    jest.mocked(getUserLanguage).mockReturnValue('123' as any);
    renderHook(() => useLocalizer(options));

    expect(dayjs.locale()).toEqual(DateFormat.EN);
  });

  [DateFormat.ES, DateFormat.FR, DateFormat.DE, DateFormat.ZH].forEach((lang) => {
    it(`Should set messages for ${lang}`, () => {
      jest.mocked(getUserLanguage).mockReturnValue(lang as any);
      const { result } = renderHook(() => useLocalizer(options));

      expect(result.current.messages.noEventsInRange).toEqual(t('localizerMessages.noEventsInRange'));
      if (result.current.messages.showMore) {
        expect(result.current.messages.showMore(10)).toEqual(t('localizerMessages.showMore', { total: 10 }));
      }
    });
  });

  it('Should use 12h format', () => {
    jest.mocked(getUserLanguage).mockReturnValue(DateFormat.EN);
    const { result } = renderHook(() =>
      useLocalizer({
        ...options,
        dateFormat: DateFormat.INHERIT,
      })
    );

    expect(result.current.localizer.format(new Date('2022-02-02 14:30'), 'LT')).toEqual('2:30 PM');
    expect(result.current.localizer.format(new Date('2022-02-02 14:30'), 'LTS')).toEqual('2:30:00 PM');
  });

  it('Should use 24h format', () => {
    jest.mocked(getUserLanguage).mockReturnValue(DateFormat.EN);
    const { result } = renderHook(() =>
      useLocalizer({
        ...options,
        dateFormat: DateFormat.EN_24H,
      })
    );

    expect(result.current.localizer.format(new Date('2022-02-02 14:30'), 'LT')).toEqual('14:30');
    expect(result.current.localizer.format(new Date('2022-02-02 14:30'), 'LTS')).toEqual('14:30:00');
  });
});
