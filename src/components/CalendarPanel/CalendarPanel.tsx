import { PanelProps } from '@grafana/data';
import React, { useMemo } from 'react';

import { useAnnotationEvents, useCalendarEvents, useColors, useEventFrames, useTimeRange } from '../../hooks';
import { CalendarOptions } from '../../types';
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
  onChangeTimeRange: defultOnChangeTimeRange,
  height,
  eventBus,
}) => {
  /**
   * Time Range Hook
   */
  const { timeRange, onChangeTimeRange } = useTimeRange({
    defaultTimeRange,
    defultOnChangeTimeRange,
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
