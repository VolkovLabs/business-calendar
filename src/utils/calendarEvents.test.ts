import dayjs from 'dayjs';
import {
  ArrayVector,
  dateTime,
  FieldColorModeId,
  FieldType,
  getLocaleData,
  getTimeZone,
  LoadingState,
  PanelData,
  toDataFrame,
} from '@grafana/data';
import { renderHook } from '@testing-library/react';
import { useCalendarEvents, useColors, useEventFrames } from './calendarEvents';

/**
 * Mock @grafana/data
 */
jest.mock('@grafana/data', () => ({
  ...jest.requireActual('@grafana/data'),
  getLocaleData: jest.fn(() => ({
    firstDayOfWeek: jest.fn(() => 0),
  })),
}));

/**
 * Calendar Events Utils
 */
describe('Calendar Events Utils', () => {
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
  describe('Use Event Frames', () => {
    it('Should use field names from options', () => {
      const options = {
        autoScroll: false,
        textField: 'Event Name',
        timeField: 'Event Start',
        endTimeField: 'Event End',
        labelFields: ['Event Name'],
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
      const options = {
        autoScroll: false,
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

  describe('Use Colors', () => {
    it('Should use get colors', () => {
      const { result } = renderHook(() =>
        useColors({
          defaults: {
            color: {
              mode: FieldColorModeId.ContinuousBlPu,
            },
          },
          overrides: [],
        })
      );

      expect(result.current).toEqual(['#5794F2', '#B877D9']);
    });

    it('Should use fixed color', () => {
      const { result } = renderHook(() =>
        useColors({
          defaults: {
            color: {
              mode: FieldColorModeId.Fixed,
              fixedColor: '#999999',
            },
          },
          overrides: [],
        })
      );

      expect(result.current).toEqual(['#999999']);
    });
  });

  describe('Use Calendar Events', () => {
    it('Should return events', () => {
      const frames = [
        {
          labels: [{ values: new ArrayVector(['label 1']) }],
          text: {
            type: FieldType.string,
            name: 'text',
            values: new ArrayVector(['111']),
            getLinks: () => null,
          },
          start: {
            type: FieldType.string,
            name: 'start',
            values: new ArrayVector([getSafeDate()]),
          },
        },
      ];
      const { result } = renderHook(() =>
        useCalendarEvents(frames as any, { colors: 'frame' } as any, [], defaultTimeRange, 'browser')
      );

      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: '111',
            labels: ['label 1'],
          }),
        ])
      );
    });

    it('Should return events with end', () => {
      const frames = [
        {
          text: {
            type: FieldType.string,
            name: 'text',
            values: new ArrayVector(['111']),
            getLinks: () => null,
          },
          start: {
            type: FieldType.string,
            name: 'start',
            values: new ArrayVector([getSafeDate()]),
          },
          end: {
            type: FieldType.string,
            name: 'end',
            values: new ArrayVector([getSafeDate()]),
          },
        },
      ];
      const { result } = renderHook(() =>
        useCalendarEvents(frames as any, { colors: 'frame' } as any, [], defaultTimeRange, 'browser')
      );

      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            end: dayjs(getSafeDate()),
          }),
        ])
      );
    });

    it('Should return events with local offset', () => {
      const frames = [
        {
          text: {
            type: FieldType.string,
            name: 'text',
            values: new ArrayVector(['111']),
            getLinks: () => null,
          },
          start: {
            type: FieldType.string,
            name: 'start',
            values: new ArrayVector([getSafeDate()]),
          },
          end: {
            type: FieldType.string,
            name: 'end',
            values: new ArrayVector([getSafeDate()]),
          },
        },
      ];

      /**
       * Negative Time Zone Offset
       * UTC-4:00
       */
      const { result: result1 } = renderHook(() =>
        useCalendarEvents(frames as any, { colors: 'frame' } as any, [], defaultTimeRange, 'America/Toronto')
      );

      expect(result1.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            start: dayjs(getSafeDate()).add(-240, 'minutes'),
            end: dayjs(getSafeDate()).add(-240, 'minutes'),
          }),
        ])
      );

      /**
       * Positive Time Zone Offset
       * UTC+10:00
       */
      const { result: result2 } = renderHook(() =>
        useCalendarEvents(frames as any, { colors: 'frame' } as any, [], defaultTimeRange, 'Australia/Brisbane')
      );

      expect(result2.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            start: dayjs(getSafeDate()).add(600, 'minutes'),
            end: dayjs(getSafeDate()).add(600, 'minutes'),
          }),
        ])
      );

      /**
       * Zero Time Zone Offset
       * UTC
       */
      const { result: result3 } = renderHook(() =>
        useCalendarEvents(frames as any, { colors: 'frame' } as any, [], defaultTimeRange, 'utc')
      );

      expect(result3.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            start: dayjs(getSafeDate()),
            end: dayjs(getSafeDate()),
          }),
        ])
      );
    });

    it('Should return event with displayed text', () => {
      const frames = [
        {
          text: {
            type: FieldType.string,
            name: 'text',
            values: new ArrayVector(['111']),
            getLinks: () => null,
            display: () => ({ text: 'displayed' }),
          },
          start: {
            type: FieldType.string,
            name: 'start',
            values: new ArrayVector([getSafeDate()]),
          },
          end: {
            type: FieldType.string,
            name: 'end',
            values: new ArrayVector([getSafeDate()]),
          },
        },
      ];
      const { result } = renderHook(() =>
        useCalendarEvents(frames as any, { colors: 'frame' } as any, [], defaultTimeRange, 'browser')
      );

      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: 'displayed',
          }),
        ])
      );
    });

    it('Should not return event without start', () => {
      const frames = [
        {
          labels: [{ values: new ArrayVector(['label 1']) }],
          text: {
            type: FieldType.string,
            name: 'text',
            values: new ArrayVector(['111']),
            getLinks: () => null,
          },
        },
      ];
      const { result } = renderHook(() =>
        useCalendarEvents(frames as any, { colors: 'frame' } as any, [], defaultTimeRange, 'browser')
      );

      expect(result.current).toHaveLength(0);
    });

    it('Should return event with isoWeek date', () => {
      jest.mocked(getLocaleData).mockImplementationOnce(() => ({
        firstDayOfWeek: jest.fn(() => 1),
      }));
      const frames = [
        {
          text: {
            type: FieldType.string,
            name: 'text',
            values: new ArrayVector(['111']),
            getLinks: () => null,
          },
          start: {
            type: FieldType.string,
            name: 'start',
            values: new ArrayVector([getSafeDate()]),
          },
          end: {
            type: FieldType.string,
            name: 'end',
            values: new ArrayVector([]),
          },
        },
      ];
      const { result } = renderHook(() =>
        useCalendarEvents(frames as any, { colors: 'frame' } as any, [], defaultTimeRange, 'browser')
      );

      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            end: dayjs(getSafeDate()),
          }),
        ])
      );
    });
  });
});
