import dayjs from 'dayjs';
import { config } from '@grafana/runtime';
import { renderHook } from '@testing-library/react';
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

  it('Should set default dayjs locale', () => {
    config.bootData = {
      user: {
        language: '123',
      },
    } as any;
    renderHook(() => useLocalizer());

    expect(dayjs.locale()).toEqual('en');
  });
});
