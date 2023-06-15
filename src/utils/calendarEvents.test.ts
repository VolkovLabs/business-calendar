import {
  dateTime,
  FieldType,
  LoadingState,
  PanelData,
  toDataFrame,
  getTimeZone,
  FieldColorModeId,
} from '@grafana/data';
import { renderHook } from '@testing-library/react';
import { useEventFrames, useColors } from './calendarEvents';

/**
 * Mock @grafana/ui
 */
// jest.mock('@grafana/ui', () => ({
//   useTheme2: jest.fn(() => ''),
// }));

/**
 * Calendar Events Utils
 */
describe('Calendar Events Utils', () => {
  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

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
});
