import { PanelProps } from '@grafana/data';
import React, { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';

import { useAnnotationEvents, useCalendarEvents, useColors, useEventFrames, useTimeRange } from '../../hooks';
import { i18nextInstance } from '../../i18n';
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
  onChangeTimeRange: defaultOnChangeTimeRange,
  height,
  eventBus,
}) => {
  /**
   * Instance for translations
   */
  const langInstance = useMemo(() => {
    return i18nextInstance(options?.dateFormat);
  }, [options?.dateFormat]);

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
   * Big Calendar
   */
  return (
    <I18nextProvider i18n={langInstance}>
      <BigCalendar
        events={allEvents}
        timeRange={timeRange}
        onChangeTimeRange={onChangeTimeRange}
        height={height}
        options={options}
        timeZone={timeZone}
      />
    </I18nextProvider>
  );
};
