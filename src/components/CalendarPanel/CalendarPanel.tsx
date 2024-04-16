import { PanelProps } from '@grafana/data';
import React, { useMemo } from 'react';

import { useAnnotationEvents, useCalendarEvents, useColors, useEventFrames } from '../../hooks';
import { CalendarOptions, CalendarType } from '../../types';
import { BigCalendar } from '../BigCalendar';
import { LegacyCalendar } from '../LegacyCalendar';

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
  timeRange,
  onChangeTimeRange,
  width,
  height,
}) => {
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
  const annotationsEvents = useAnnotationEvents(timeRange, options);

  /**
   * All Events
   */
  const allEvents = useMemo(() => {
    return dataFrameEvents.concat(options.annotations ? annotationsEvents : []);
  }, [dataFrameEvents, annotationsEvents, options.annotations]);

  /**
   * Big Calendar
   */
  if (options.calendarType === CalendarType.BIG_CALENDAR) {
    return (
      <BigCalendar
        events={allEvents}
        timeRange={timeRange}
        onChangeTimeRange={onChangeTimeRange}
        height={height}
        options={options}
      />
    );
  }

  /**
   * Legacy
   */
  return (
    <LegacyCalendar
      height={height}
      width={width}
      timeRange={timeRange}
      onChangeTimeRange={onChangeTimeRange}
      options={options}
      events={allEvents}
    />
  );
};
