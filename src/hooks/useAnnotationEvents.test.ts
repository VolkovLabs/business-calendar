import { getBackendSrv } from '@grafana/runtime';
import { renderHook, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';

import { DEFAULT_OPTIONS } from '../constants';
import { AnnotationsType } from '../types';
import { useAnnotationEvents } from './useAnnotationEvents';

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
describe('useAnnotationEvents', () => {
  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Default dashboard Data
   */
  const defaultData = {
    annotations: [],
  };

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

    const { result } = renderHook(() =>
      useAnnotationEvents(timeRange as any, DEFAULT_OPTIONS as any, defaultData as any)
    );

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
      useAnnotationEvents(
        timeRange as any,
        { ...DEFAULT_OPTIONS, annotationsType: AnnotationsType.ALERT } as any,
        defaultData as any
      )
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
      useAnnotationEvents(
        timeRange as any,
        { ...DEFAULT_OPTIONS, annotationsType: AnnotationsType.ANNOTATION } as any,
        defaultData as any
      )
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
    const { result } = renderHook(() =>
      useAnnotationEvents(timeRange as any, DEFAULT_OPTIONS as any, defaultData as any)
    );

    await waitFor(() => expect(result.current).toEqual([]));
  });

  it('Should return dashboard annotations', async () => {
    const promise = Promise.resolve(null);
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: jest.fn(() => promise),
        }) as any
    );

    /**
     * Time Range
     */
    const getStartDate = () => new Date('2024-05-01');
    const getEndDate = () => new Date('2024-06-01');

    const timeRange = { from: getStartDate(), to: getEndDate() };

    /**
     * Dashboard Annotations
     */
    const firstAnnotation = {
      color: '#FF780A',
      title: 'dashboard annotation title 1',
      tags: [''],
      id: 'ds-ann-1',
      time: 1716014857000,
      timeEnd: 1716032857000,
    };

    const secondAnnotation = {
      color: '#FF780A',
      title: 'dashboard annotation title 2',
      tags: ['tags 1', 'tags 2'],
      id: 'ds-ann-2',
      time: 1717057979941,
      timeEnd: 1717057979941,
    };

    /**
     * Dashboard data
     */
    const data = {
      annotations: [
        {
          length: 2,
          fields: [
            {
              name: 'color',
              values: [firstAnnotation.color, secondAnnotation.color],
            },
            {
              name: 'title',
              values: [firstAnnotation.title, secondAnnotation.title],
            },
            {
              name: 'tags',
              values: [firstAnnotation.tags, secondAnnotation.tags],
            },
            {
              name: 'id',
              values: [firstAnnotation.id, secondAnnotation.id],
            },
            {
              name: 'time',
              values: [firstAnnotation.time, secondAnnotation.time],
            },
            {
              name: 'timeEnd',
              values: [firstAnnotation.timeEnd, secondAnnotation.timeEnd],
            },
          ],
        },
      ],
    };
    const { result } = renderHook(() => useAnnotationEvents(timeRange as any, DEFAULT_OPTIONS as any, data as any));

    await waitFor(() =>
      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: firstAnnotation.title,
            labels: firstAnnotation.tags,
            color: firstAnnotation.color,
            start: dayjs(firstAnnotation.time),
            end: dayjs(firstAnnotation.timeEnd),
            description: '',
            open: false,
          }),
          expect.objectContaining({
            text: secondAnnotation.title,
            labels: secondAnnotation.tags,
            color: secondAnnotation.color,
            start: dayjs(secondAnnotation.time),
            end: dayjs(secondAnnotation.timeEnd),
            description: '',
            open: false,
          }),
        ])
      )
    );
  });

  it('Should return dashboard annotations with description', async () => {
    const promise = Promise.resolve(null);
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: jest.fn(() => promise),
        }) as any
    );

    /**
     * Time Range
     */
    const getStartDate = () => new Date('2024-05-01');
    const getEndDate = () => new Date('2024-06-01');

    const timeRange = { from: getStartDate(), to: getEndDate() };

    /**
     * Dashboard Annotations
     */
    const firstAnnotation = {
      color: '#FF780A',
      title: 'title 1',
      text: 'text 1',
      tags: [''],
      id: 'ds-ann-1',
      time: 1716014857000,
      timeEnd: 1716032857000,
    };

    const secondAnnotation = {
      color: '#FF780A',
      title: 'title 2',
      text: 'text 2',
      tags: ['tags 1', 'tags 2'],
      id: 'ds-ann-2',
      time: 1717057979941,
      timeEnd: 1717057979941,
    };

    /**
     * Dashboard data
     */
    const data = {
      annotations: [
        {
          length: 2,
          fields: [
            {
              name: 'color',
              values: [firstAnnotation.color, secondAnnotation.color],
            },
            {
              name: 'title',
              values: [firstAnnotation.title, secondAnnotation.title],
            },
            {
              name: 'text',
              values: [firstAnnotation.text, secondAnnotation.text],
            },
            {
              name: 'tags',
              values: [firstAnnotation.tags, secondAnnotation.tags],
            },
            {
              name: 'id',
              values: [firstAnnotation.id, secondAnnotation.id],
            },
            {
              name: 'time',
              values: [firstAnnotation.time, secondAnnotation.time],
            },
            {
              name: 'timeEnd',
              values: [firstAnnotation.timeEnd, secondAnnotation.timeEnd],
            },
          ],
        },
      ],
    };
    const { result } = renderHook(() => useAnnotationEvents(timeRange as any, DEFAULT_OPTIONS as any, data as any));

    await waitFor(() =>
      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: firstAnnotation.title,
            labels: firstAnnotation.tags,
            color: firstAnnotation.color,
            description: firstAnnotation.text,
            start: dayjs(firstAnnotation.time),
            end: dayjs(firstAnnotation.timeEnd),
            open: false,
          }),
          expect.objectContaining({
            text: secondAnnotation.title,
            labels: secondAnnotation.tags,
            description: secondAnnotation.text,
            color: secondAnnotation.color,
            start: dayjs(secondAnnotation.time),
            end: dayjs(secondAnnotation.timeEnd),
            open: false,
          }),
        ])
      )
    );
  });

  it('Should not return dashboard annotations out of range', async () => {
    const promise = Promise.resolve(null);
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: jest.fn(() => promise),
        }) as any
    );

    /**
     * Time Range
     */
    const getStartDate = () => new Date('2024-05-01');
    const getEndDate = () => new Date('2024-05-04');

    const timeRange = { from: getStartDate(), to: getEndDate() };

    /**
     * Dashboard Annotations
     */
    const firstAnnotation = {
      color: '#FF780A',
      title: 'dashboard annotation title 1',
      tags: [''],
      id: 'ds-ann-1',
      time: 1716014857000,
      timeEnd: 1716032857000,
    };

    const secondAnnotation = {
      color: '#FF780A',
      title: 'dashboard annotation title 2',
      tags: ['tags 1', 'tags 2'],
      id: 'ds-ann-2',
      time: 1717057979941,
      timeEnd: 1717057979941,
    };

    /**
     * Dashboard data
     */
    const data = {
      annotations: [
        {
          length: 2,
          fields: [
            {
              name: 'color',
              values: [firstAnnotation.color, secondAnnotation.color],
            },
            {
              name: 'title',
              values: [firstAnnotation.title, secondAnnotation.title],
            },
            {
              name: 'tags',
              values: [firstAnnotation.tags, secondAnnotation.tags],
            },
            {
              name: 'id',
              values: [firstAnnotation.id, secondAnnotation.id],
            },
            {
              name: 'time',
              values: [firstAnnotation.time, secondAnnotation.time],
            },
            {
              name: 'timeEnd',
              values: [firstAnnotation.timeEnd, secondAnnotation.timeEnd],
            },
          ],
        },
      ],
    };
    const { result } = renderHook(() => useAnnotationEvents(timeRange as any, DEFAULT_OPTIONS as any, data as any));

    await waitFor(() => expect(result.current).toEqual([]));
  });

  it('Should return dashboard annotations if only time field specified', async () => {
    const promise = Promise.resolve(null);
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: jest.fn(() => promise),
        }) as any
    );

    /**
     * Time Range
     */
    const getStartDate = () => new Date('2024-05-01');
    const getEndDate = () => new Date('2024-06-01');

    const timeRange = { from: getStartDate(), to: getEndDate() };

    /**
     * Dashboard Annotations
     */
    const firstAnnotation = {
      time: 1716014857000,
    };

    const secondAnnotation = {
      time: 1717057979941,
    };

    /**
     * Dashboard data
     */
    const data = {
      annotations: [
        {
          length: 2,
          fields: [
            {
              name: 'time',
              values: [firstAnnotation.time, secondAnnotation.time],
            },
          ],
        },
      ],
    };
    const { result } = renderHook(() => useAnnotationEvents(timeRange as any, DEFAULT_OPTIONS as any, data as any));

    await waitFor(() =>
      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: '',
            labels: [],
            color: '',
            start: dayjs(firstAnnotation.time),
            end: undefined,
            open: false,
          }),
          expect.objectContaining({
            text: '',
            labels: [],
            color: '',
            start: dayjs(secondAnnotation.time),
            end: undefined,
            open: false,
          }),
        ])
      )
    );
  });

  it('Should not return dashboard annotations if time field unset', async () => {
    const promise = Promise.resolve(null);
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: jest.fn(() => promise),
        }) as any
    );

    /**
     * Time Range
     */
    const getStartDate = () => new Date('2024-05-01');
    const getEndDate = () => new Date('2024-06-01');

    const timeRange = { from: getStartDate(), to: getEndDate() };

    /**
     * Dashboard data
     */
    const data = {
      annotations: [
        {
          length: 2,
          fields: [
            {
              name: 'time',
              values: ['', ''],
            },
          ],
        },
      ],
    };
    const { result } = renderHook(() => useAnnotationEvents(timeRange as any, DEFAULT_OPTIONS as any, data as any));

    await waitFor(() => expect(result.current).toEqual([]));
  });
});
