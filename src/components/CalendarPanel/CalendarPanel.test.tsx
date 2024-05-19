import { dateTime, FieldType, LoadingState, PanelData, toDataFrame } from '@grafana/data';
import { act, render } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';

import { DEFAULT_VIEWS } from '../../constants';
import { useAnnotationEvents } from '../../hooks';
import { CalendarOptions, DateFormat } from '../../types';
import { BigCalendar } from '../BigCalendar';
import { CalendarPanel } from './CalendarPanel';

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve()),
  })),
}));

/**
 * Mock utils
 */
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAnnotationEvents: jest.fn(() => [{ id: '123' }]),
}));

/**
 * Mock Big Calendar
 */
jest.mock('../BigCalendar', () => ({
  BigCalendar: jest.fn(() => null),
}));

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof CalendarPanel>;

/**
 * Panel
 */
describe('Panel', () => {
  /**
   * Default Options
   */
  const defaultOptions: CalendarOptions = {
    dateFormat: DateFormat.INHERIT,
    displayFields: [],
    locationLabel: '',
    views: DEFAULT_VIEWS,
    scrollToTime: {
      hours: 0,
      minutes: 0,
    },
  };

  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = ({ options = defaultOptions, ...restProps }: Partial<Props>) => {
    const allOptions = {
      textField: 'Event Name',
      timeField: 'Event Start',
      endTimeField: 'Event End',
      labelFields: ['Event Name'],
      ...options,
    };
    const timeRange = {
      from: dateTime(getSafeDate()),
      to: dateTime(getSafeDate()),
      raw: {
        from: dateTime(getSafeDate()),
        to: dateTime(getSafeDate()),
      },
    };
    const data: PanelData = {
      state: LoadingState.Done,
      timeRange,
      series: [
        toDataFrame({
          name: 'data',
          fields: [
            {
              type: FieldType.string,
              name: allOptions.textField,
              values: ['event1', 'event2', 'event3'],
              getLinks: () => null,
            },
            {
              type: FieldType.time,
              name: allOptions.timeField,
              values: [getSafeDate(), getSafeDate(), getSafeDate()],
            },
            {
              type: FieldType.time,
              name: allOptions.endTimeField,
              values: [getSafeDate(), getSafeDate(), getSafeDate()],
            },
          ],
        }),
      ],
    };

    return <CalendarPanel data={data} options={allOptions} timeRange={timeRange} {...(restProps as any)} />;
  };

  /**
   * Render Without Warning
   * @param component
   */
  const renderWithoutWarning = async (component: React.ReactElement) => {
    await act(async () => {
      render(component);

      /**
       * Remove act warnings
       * Wait timeout until promise resolves. Because there is not loading element for checking promise resolves
       */
      await new Promise((resolve) => setTimeout(resolve, 1));
    });
  };

  beforeEach(() => {
    jest.mocked(BigCalendar).mockClear();
  });

  it('Should render lib calendar', async () => {
    await renderWithoutWarning(
      getComponent({
        options: { ...defaultOptions, dateFormat: DateFormat.INHERIT },
      })
    );

    expect(BigCalendar).toHaveBeenCalledWith(
      expect.objectContaining({
        events: expect.arrayContaining([
          expect.objectContaining({
            color: '#7EB26D',
            description: undefined,
            end: dayjs(getSafeDate()),
            labels: ['event1'],
            links: null,
            start: dayjs(getSafeDate()),
            text: 'event1',
          }),
        ]),
      }),
      expect.anything()
    );
  });

  it('Should add annotation events', async () => {
    jest.mocked(useAnnotationEvents).mockImplementationOnce(
      () =>
        [
          {
            text: 'annotation',
          },
        ] as any
    );
    await renderWithoutWarning(
      getComponent({
        options: {
          ...defaultOptions,
          annotations: true,
          dateFormat: DateFormat.INHERIT,
        },
      })
    );

    expect(BigCalendar).toHaveBeenCalledWith(
      expect.objectContaining({
        events: expect.arrayContaining([
          expect.objectContaining({
            text: 'annotation',
          }),
        ]),
      }),
      expect.anything()
    );
  });
});
