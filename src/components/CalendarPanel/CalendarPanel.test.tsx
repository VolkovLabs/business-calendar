import dayjs from 'dayjs';
import React from 'react';
import { dateTime, FieldType, LoadingState, PanelData, toDataFrame } from '@grafana/data';
import { act, render } from '@testing-library/react';
import { CalendarType } from '../../types';
import { BigCalendar } from '../BigCalendar';
import { CustomCalendar } from '../CustomCalendar';
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
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  useAnnotations: jest.fn(() => [{ id: '123' }]),
}));

/**
 * Mock Big Calendar
 */
jest.mock('../BigCalendar', () => ({
  BigCalendar: jest.fn(() => null),
}));

/**
 * Mock Custom Calendar
 */
jest.mock('../CustomCalendar', () => ({
  CustomCalendar: jest.fn(() => null),
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
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = ({ options = { autoScroll: true }, ...restProps }: Partial<Props>) => {
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
      await render(component);

      /**
       * Remove act warnings
       * Wait timeout until promise resolves. Because there is not loading element for checking promise resolves
       */
      await new Promise((resolve) => setTimeout(resolve, 1));
    });
  };

  beforeEach(() => {
    jest.mocked(BigCalendar).mockClear();
    jest.mocked(CustomCalendar).mockClear();
  });

  it('Should render custom calendar', async () => {
    await renderWithoutWarning(getComponent({ options: { calendarType: CalendarType.LEGACY, autoScroll: true } }));

    expect(BigCalendar).not.toHaveBeenCalled();
    expect(CustomCalendar).toHaveBeenCalledWith(
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

  it('Should render lib calendar', async () => {
    await renderWithoutWarning(
      getComponent({ options: { calendarType: CalendarType.BIG_CALENDAR, autoScroll: true } })
    );

    expect(CustomCalendar).not.toHaveBeenCalled();
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
});
