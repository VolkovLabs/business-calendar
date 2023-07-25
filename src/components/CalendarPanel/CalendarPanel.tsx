import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { CalendarOptions, CalendarType } from '../../types';
import { useAnnotationEvents, useCalendarEvents, useColors, useEventFrames } from '../../utils';
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
   * DataFrame events
   */
  const dataFrameEvents = useCalendarEvents(frames, options, colors, timeRange);

  /**
   * Annotations Events
   */
  const annotationsEvents = useAnnotationEvents(timeRange);

  /**
   * All Events
   */
  const allEvents = useMemo(() => {
    return dataFrameEvents.concat(annotationsEvents);
  }, [dataFrameEvents, annotationsEvents]);

  /**
   * Big Calendar
   */
  if (options.calendarType === CalendarType.BIG_CALENDAR) {
    return (
      <BigCalendar events={allEvents} timeRange={timeRange} onChangeTimeRange={onChangeTimeRange} height={height} />
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
