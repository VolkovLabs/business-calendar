import { dateTime, FieldType, getTimeZone, LoadingState, PanelData, toDataFrame } from '@grafana/data';
import { renderHook } from '@testing-library/react';

import { CalendarOptions, DateFormat } from '../types';
import { useEventFrames } from './useEventFrames';

describe('useEventFrames', () => {
  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02 12:30');

  const defaultTimeRange = {
    from: dateTime(getSafeDate()),
    to: dateTime(getSafeDate()),
    raw: {
      from: dateTime(getSafeDate()),
      to: dateTime(getSafeDate()),
    },
  };

  /**
   * Get Data Frame
   * @param options
   * @param timeRange
   */
  const getDataFrame = (options: any, timeRange = defaultTimeRange): PanelData => {
    return {
      state: LoadingState.Done,
      timeRange,
      series: [
        toDataFrame({
          name: 'data',
          fields: [
            {
              type: FieldType.string,
              name: options.textField,
              values: ['event1', 'event2', 'event3'],
              getLinks: () => null,
            },
            {
              type: FieldType.time,
              name: options.timeField,
              values: [getSafeDate(), getSafeDate(), getSafeDate()],
            },
            {
              type: FieldType.time,
              name: options.endTimeField,
              values: [getSafeDate(), getSafeDate(), getSafeDate()],
            },
          ],
        }),
      ],
    };
  };

  it('Should use field names from options', () => {
    const options: CalendarOptions = {
      textField: 'Event Name',
      timeField: 'Event Start',
      endTimeField: 'Event End',
      labelFields: ['Event Name'],
      dateFormat: DateFormat.INHERIT,
    };
    const data = getDataFrame(options);

    const timeZone = getTimeZone();

    const { result } = renderHook(() => useEventFrames(data.series, options, timeZone));

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: expect.objectContaining({
            name: options.textField,
          }),
          start: expect.objectContaining({
            name: options.timeField,
          }),
          end: expect.objectContaining({
            name: options.endTimeField,
          }),
        }),
      ])
    );
  });

  it('Should use field names by type if no names specified', () => {
    const options: CalendarOptions = {
      dateFormat: DateFormat.INHERIT,
    };
    const data: PanelData = {
      state: LoadingState.Done,
      timeRange: defaultTimeRange,
      series: [
        toDataFrame({
          name: 'data',
          fields: [
            {
              type: FieldType.string,
              name: 'name',
              values: ['event1', 'event2', 'event3'],
              getLinks: () => null,
            },
            {
              type: FieldType.time,
              name: 'start',
              values: [getSafeDate(), getSafeDate(), getSafeDate()],
            },
            {
              type: FieldType.time,
              name: 'end',
              values: [getSafeDate(), getSafeDate(), getSafeDate()],
            },
          ],
        }),
      ],
    };
    const timeZone = getTimeZone();

    const { result } = renderHook(() => useEventFrames(data.series, options, timeZone));

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: expect.objectContaining({
            name: 'name',
          }),
          start: expect.objectContaining({
            name: 'start',
          }),
        }),
      ])
    );
  });
});
