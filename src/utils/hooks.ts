import dayjs from 'dayjs';
import { useCallback, useEffect, useState, useMemo } from 'react';
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
import { Range, CalendarOptions, CalendarEvent } from '../types';
import { Colors } from '../constants';
import { toTimeField } from './time';

/**
 * Key Press
 */
export const useKeyPress = (key: string, onKeyPressed: (pressed: boolean) => void) => {
  /**
   * Key down
   */
  const keydownListener = useCallback(
    (e: any) => {
      if (e.key === 'Shift') {
        onKeyPressed(true);
      }
    },
    [onKeyPressed]
  );

  /**
   * Key up
   */
  const keyupListener = useCallback(
    (e: any) => {
      if (e.key === 'Shift') {
        onKeyPressed(false);
      }
    },
    [onKeyPressed]
  );

  /**
   * Event for Key down
   */
  useEffect(() => {
    window.addEventListener('keydown', keydownListener, true);
    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener]);

  /**
   * Event for Key up
   */
  useEffect(() => {
    window.addEventListener('keyup', keyupListener, true);
    return () => window.removeEventListener('keyup', keyupListener, true);
  }, [keyupListener]);
};

/**
 * Interval Selection
 */
export const useIntervalSelection = (): [Range | undefined, () => void, (time: dayjs.Dayjs) => void] => {
  const [selectedInterval, setSelectedInterval] = useState<Range>();
  const [intervalSelection, setIntervalSelection] = useState(false);

  useKeyPress('Shift', (pressed) => {
    setIntervalSelection(pressed);
  });

  const onTimeSelection = useCallback(
    (time: dayjs.Dayjs) => {
      if (!selectedInterval && !intervalSelection) {
        setSelectedInterval([time.startOf('day'), time.endOf('day')]);
        return;
      }

      if (selectedInterval && intervalSelection) {
        const [start, end] = selectedInterval;

        if (time.isSame(start)) {
          setSelectedInterval(undefined);
        }
        if (time.isBefore(end)) {
          setSelectedInterval([time, end]);
        }
        if (start.isBefore(time)) {
          setSelectedInterval([start, time.endOf('day')]);
        }

        return;
      }

      if (selectedInterval) {
        const clone1 = time.startOf('day');
        const clone2 = time.endOf('day');

        if (clone1.isSame(selectedInterval[0])) {
          setSelectedInterval(undefined);
          return;
        }

        setSelectedInterval([clone1, clone2]);
      }
    },
    [selectedInterval, intervalSelection]
  );

  const clear = () => {
    setSelectedInterval(undefined);
  };

  return [selectedInterval, clear, onTimeSelection];
};

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
