import dayjs from 'dayjs';
import { useMemo } from 'react';
import {
  DataFrame,
  FieldType,
  formattedValueToString,
  FieldConfigSource,
  getFieldColorMode,
  classicColors,
  FieldColorModeId,
  TimeRange,
  getLocaleData,
} from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { TimeZone } from '@grafana/schema';
import { CalendarOptions, CalendarEvent } from '../types';
import { Colors } from '../constants';
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
        start: toTimeField(
          options.timeField
            ? frame.fields.find((f) => f.name === options.timeField)
            : frame.fields.find((f) => f.type === FieldType.time),
          timeZone,
          theme
        ),
        end: toTimeField(
          frame.fields.find((f) => f.name === options.endTimeField),
          timeZone,
          theme
        ),
        labels: frame.fields.filter((f) => options.labelFields?.includes(f.name)),
        color: frame.fields.find((f) => f.name === options.colorField),
      })),
    [
      dataFrames,
      options.colorField,
      options.descriptionField,
      options.endTimeField,
      options.labelFields,
      options.textField,
      options.timeField,
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
 * Get Calendar Events
 * @param frames
 * @param options
 * @param colors
 * @param timeRange
 */
export const useCalendarEvents = (
  frames: ReturnType<typeof useEventFrames>,
  options: CalendarOptions,
  colors: string[],
  timeRange: TimeRange
): CalendarEvent[] => {
  /**
   * Week Start
   */
  const firstDay = getLocaleData().firstDayOfWeek() === 0 ? 'week' : 'isoWeek';

  return useMemo(() => {
    const to = dayjs(timeRange.to.valueOf());
    const endOfRangeWeek = to.endOf(firstDay);

    return frames.flatMap((frame, frameIdx) => {
      const colorFn = frame.color?.display;

      if (!frame.text || !frame.start) {
        return [];
      }

      return Array.from({ length: frame.text.values.length })
        .map((_, i) => ({
          text: frame.text?.display
            ? (formattedValueToString(frame.text.display(frame.text?.values.get(i))) as any)
            : frame.text?.values.get(i),
          description: frame.description?.values.get(i),
          start: frame.start?.values.get(i),
          end: frame.end?.values.get(i),
          labels: frame.labels?.map((field) => field.values.get(i)).filter((label) => label),
          links: frame.text?.getLinks!({ valueRowIndex: i }),
          color: frame.color?.values.get(i),
        }))
        .map<CalendarEvent>(({ text, description, labels, links, start, end, color }, i) => {
          const idx = options.colors === Colors.FRAME ? frameIdx : i;
          return {
            text,
            description,
            labels,
            start: dayjs(start),
            color: colorFn?.(color).color ?? colors[Math.floor(idx % colors.length)],
            links,
            end: frame.end ? (end ? dayjs(end) : endOfRangeWeek) : undefined,
          };
        });
    });
  }, [colors, firstDay, frames, options.colors, timeRange.to]);
};
