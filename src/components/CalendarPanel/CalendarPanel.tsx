import { PanelProps } from '@grafana/data';
import i18next from 'i18next';
import React, { useEffect, useMemo } from 'react';

import { useAnnotationEvents, useCalendarEvents, useColors, useEventFrames, useTimeRange } from '../../hooks';
import { CalendarOptions, DateFormat } from '../../types';
import { BigCalendar } from '../BigCalendar';

/**
 * Properties
 */
interface Props extends PanelProps<CalendarOptions> {}

/**
 * Calendar Panel
 */
export const CalendarPanel: React.FC<Props> = ({
  data,
  options,
  timeZone,
  fieldConfig,
  timeRange: defaultTimeRange,
  onChangeTimeRange: defaultOnChangeTimeRange,
  height,
  eventBus,
}) => {
  /**
   * Time Range Hook
   */
  const { timeRange, onChangeTimeRange } = useTimeRange({
    defaultTimeRange,
    defaultOnChangeTimeRange: defaultOnChangeTimeRange,
    options,
    eventBus,
  });

  /**
   * Frame events
   */
  const frames = useEventFrames(data.series, options, timeZone);

  /**
   * Colors
   */
  const colors = useColors(fieldConfig);

  /**
   * Data Frame events
   */
  const dataFrameEvents = useCalendarEvents(frames, options, colors, timeRange, timeZone);

  /**
   * Annotations Events
   */
  const annotationsEvents = useAnnotationEvents(timeRange, options, data);

  /**
   * All Events
   */
  const allEvents = useMemo(() => {
    return dataFrameEvents.concat(options.annotations ? annotationsEvents : []);
  }, [dataFrameEvents, annotationsEvents, options.annotations]);

  /**
   * Compare i18next language from config and dateFormat
   */
  useEffect(() => {
    if (options.dateFormat !== i18next.language) {
      const format = options.dateFormat === DateFormat.EN_24H ? DateFormat.EN : options.dateFormat;
      i18next.changeLanguage(format);
    }
  }, [options.dateFormat]);

  /**
   * Big Calendar
   */
  return (
    <BigCalendar
      events={allEvents}
      timeRange={timeRange}
      onChangeTimeRange={onChangeTimeRange}
      height={height}
      options={options}
    />
  );
};
