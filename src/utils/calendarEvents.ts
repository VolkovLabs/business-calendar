import {
  classicColors,
  DataFrame,
  FieldColorModeId,
  FieldConfigSource,
  FieldType,
  formattedValueToString,
  getFieldColorMode,
  getLocaleData,
  InternalTimeZones,
  TimeRange,
} from '@grafana/data';
import { TimeZone } from '@grafana/schema';
import { useTheme2 } from '@grafana/ui';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { Colors, DEFAULT_LANGUAGE } from '../constants';
import { CalendarEvent, CalendarOptions } from '../types';
import { toTimeField } from './time';

/**
 * Get Event Frames
 * @param dataFrames
 * @param options
 * @param timeZone
 */
export const useEventFrames = (dataFrames: DataFrame[], options: CalendarOptions, timeZone: TimeZone) => {
  const theme = useTheme2();

  return useMemo(
    () =>
      dataFrames.map((frame) => ({
        text: options.textField
          ? frame.fields.find((f) => f.name === options.textField)
          : frame.fields.find((f) => f.type === FieldType.string),
        description: frame.fields.find((f) => f.name === options.descriptionField),
        start: toTimeField({
          field: options.timeField
            ? frame.fields.find((f) => f.name === options.timeField)
            : frame.fields.find((f) => f.type === FieldType.time),
          timeZone,
          theme,
        }),
        end: toTimeField({
          field: frame.fields.find((f) => f.name === options.endTimeField),
          timeZone,
          theme,
        }),
        labels: frame.fields.filter((f) => options.labelFields?.includes(f.name)),
        color: frame.fields.find((f) => f.name === options.colorField),
        location: frame.fields.find((f) => f.name === options.locationField),
      })),
    [
      dataFrames,
      options.colorField,
      options.descriptionField,
      options.endTimeField,
      options.labelFields,
      options.textField,
      options.timeField,
      options.locationField,
      theme,
      timeZone,
    ]
  );
};

/**
 * Get Colors
 * @param fieldConfig
 */
export const useColors = (fieldConfig?: FieldConfigSource) => {
  const theme = useTheme2();

  return useMemo(() => {
    let colors = classicColors;
    if (fieldConfig?.defaults.color) {
      const mode = getFieldColorMode(fieldConfig.defaults.color.mode);
      if (mode && mode.getColors) {
        colors = mode.getColors(theme);
      } else if (fieldConfig.defaults.color.mode === FieldColorModeId.Fixed && fieldConfig.defaults.color.fixedColor) {
        colors = [fieldConfig.defaults.color.fixedColor];
      }
    }
    return colors;
  }, [fieldConfig?.defaults.color, theme]);
};

/**
 * Get Minutes Offset From Time Zone
 * @param timeZone
 */
export const getMinutesOffsetFromTimeZone = (timeZone: TimeZone) => {
  if (timeZone === InternalTimeZones.localBrowserTime) {
    /**
     * Offset is not needed, dates are in browser time zone
     */
    return 0;
  }

  /**
   * Calculate offset to show date in dashboard time zone for user
   */
  if (timeZone === InternalTimeZones.utc) {
    /**
     * UTC offset from browser date
     */
    return new Date().getTimezoneOffset();
  }

  const date = new Date();

  /**
   * Browser Date
   * Reset milliseconds to prevent losing 1 minute in difference
   */
  const browserDate = dayjs(date).set('milliseconds', 0);

  /**
   * Time Zone Date
   */
  const timeZoneDate = dayjs(date.toLocaleString(DEFAULT_LANGUAGE, { timeZone }));

  /**
   * Time Zone offset from browser date
   */
  return timeZoneDate.diff(browserDate, 'minute');
};

/**
 * Get Date With Minutes Offset
 * @param date
 * @param minutesOffset
 */
export const getDateWithMinutesOffset = (date: Date, minutesOffset: number): Date => {
  return dayjs(date).add(minutesOffset, 'minutes').toDate();
};

/**
 * Get Calendar Events
 * @param frames
 * @param options
 * @param colors
 * @param timeRange
 * @param timeZone
 */
export const useCalendarEvents = (
  frames: ReturnType<typeof useEventFrames>,
  options: CalendarOptions,
  colors: string[],
  timeRange: TimeRange,
  timeZone: TimeZone
): CalendarEvent[] => {
  /**
   * Week Start
   */
  const firstDay = getLocaleData().firstDayOfWeek() === 0 ? 'week' : 'isoWeek';

  /**
   * Minutes Offset from Browser Time Zone
   */
  const minutesOffset = getMinutesOffsetFromTimeZone(timeZone);

  return useMemo(() => {
    const to = dayjs(timeRange.to.valueOf()).add(minutesOffset, 'minutes');
    const endOfRangeWeek = to.endOf(firstDay);

    return frames.flatMap((frame, frameIdx) => {
      const colorFn = frame.color?.display;

      if (!frame.text || !frame.start) {
        return [];
      }

      return Array.from({ length: frame.text.values.length })
        .map((item, i) => ({
          text: frame.text?.display
            ? (formattedValueToString(frame.text.display(frame.text?.values.get(i))) as string)
            : frame.text?.values.get(i),
          description: frame.description?.values.get(i),
          start: frame.start?.values.get(i),
          end: frame.end?.values.get(i),
          labels: frame.labels?.map((field) => field.values.get(i)).filter((label) => label),
          links: frame.text?.getLinks!({ valueRowIndex: i }),
          color: frame.color?.values.get(i),
          location: frame.location?.values.get(i),
        }))
        .map<CalendarEvent>(({ text, description, labels, links, start, end, color, location }, i) => {
          const idx = options.colors === Colors.FRAME ? frameIdx : i;
          return {
            text,
            description,
            labels,
            start: dayjs(start).add(minutesOffset, 'minutes'),
            color: colorFn?.(color).color ?? colors[Math.floor(idx % colors.length)],
            links,
            end: frame.end ? (end ? dayjs(end).add(minutesOffset, 'minutes') : endOfRangeWeek) : undefined,
            location,
          };
        });
    });
  }, [colors, minutesOffset, firstDay, frames, options.colors, timeRange.to]);
};
