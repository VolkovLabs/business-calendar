import { getBackendSrv } from '@grafana/runtime';
import { renderHook, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';

import { AnnotationsType, DEFAULT_OPTIONS } from '../constants';
import { useAnnotationEvents } from './annotations';

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve([])),
  })),
}));

/**
 * Annotations
 */
describe('Annotations', () => {
  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  it('Should return annotation events', async () => {
    const promise = Promise.resolve([
      {
        text: 'event1',
        time: getSafeDate(),
      },
      {
        time: getSafeDate(),
        timeEnd: getSafeDate(),
      },
    ]);
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: jest.fn(() => promise),
        }) as any
    );
    const timeRange = { from: getSafeDate(), to: getSafeDate() };
    const { result } = renderHook(() => useAnnotationEvents(timeRange as any, DEFAULT_OPTIONS as any));

    await waitFor(() =>
      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: 'event1',
            start: dayjs(getSafeDate()),
            end: undefined,
          }),
          expect.objectContaining({
            text: '',
            start: dayjs(getSafeDate()),
            end: dayjs(getSafeDate()),
          }),
        ])
      )
    );
  });

  it('Should request alerts', async () => {
    const getMock = jest.fn(() => Promise.resolve([]));
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: getMock,
        }) as any
    );
    const timeRange = { from: getSafeDate(), to: getSafeDate() };
    renderHook(() =>
      useAnnotationEvents(timeRange as any, { ...DEFAULT_OPTIONS, annotationsType: AnnotationsType.ALERT } as any)
    );

    await waitFor(() =>
      expect(getMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          type: AnnotationsType.ALERT,
        })
      )
    );
  });

  it('Should request annotation', async () => {
    const getMock = jest.fn(() => Promise.resolve([]));
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: getMock,
        }) as any
    );
    const timeRange = { from: getSafeDate(), to: getSafeDate() };
    renderHook(() =>
      useAnnotationEvents(timeRange as any, { ...DEFAULT_OPTIONS, annotationsType: AnnotationsType.ANNOTATION } as any)
    );

    await waitFor(() =>
      expect(getMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          type: AnnotationsType.ANNOTATION,
        })
      )
    );
  });

  it('Should return empty array', async () => {
    const promise = Promise.resolve(null);
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: jest.fn(() => promise),
        }) as any
    );
    const timeRange = { from: getSafeDate(), to: getSafeDate() };
    const { result } = renderHook(() => useAnnotationEvents(timeRange as any, DEFAULT_OPTIONS as any));

    await waitFor(() => expect(result.current).toEqual([]));
  });
});
