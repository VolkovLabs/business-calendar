import React, { useMemo, useCallback } from 'react';
import { Global } from '@emotion/react';
import en from 'dayjs/locale/en';
import { PanelProps, getLocaleData } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { Calendar, dayjsLocalizer, Event } from 'react-big-calendar';
import dayjs from 'dayjs';
import { CalendarOptions } from '../../types';
import { useEventFrames, useColors, useCalendarEvents, useAnnotationEvents } from '../../utils';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Styles } from './styles';
import { Toolbar } from './components';
import { useCalendarRange, useCalendarEvents as useLibCalendarEvents } from './hooks';

/**
 * Update dayjs locale to support different first day of week
 * https://github.com/iamkun/dayjs/issues/215
 */
dayjs.locale({
  ...en,
  weekStart: getLocaleData().firstDayOfWeek(),
});
const localizer = dayjsLocalizer(dayjs);

/**
 * Properties
 */
interface Props extends PanelProps<CalendarOptions> {}

export const LibCalendar: React.FC<Props> = ({
  height,
  data,
  options,
  timeZone,
  fieldConfig,
  timeRange,
  onChangeTimeRange,
}) => {
  /**
   * Theme
   */
  const styles = useStyles2(Styles);

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
   * Adopted Events for BigCalendar
   */
  const events = useLibCalendarEvents(allEvents);

  /**
   * Get props for event div element
   */
  const eventPropGetter = useCallback(
    (event: Event) => ({
      style: {
        backgroundColor: event.resource.color,
      },
    }),
    []
  );

  /**
   * Custom Calendar Components
   */
  const components = useMemo(
    () => ({
      toolbar: Toolbar,
    }),
    []
  );

  /**
   * Manage calendar time range and view
   */
  const { date, view, onChangeView, onNavigate } = useCalendarRange(timeRange, onChangeTimeRange);

  return (
    <div>
      <Global styles={styles.global} />
      <Calendar
        localizer={localizer}
        events={events}
        eventPropGetter={eventPropGetter}
        startAccessor="start"
        endAccessor="end"
        style={{ height }}
        views={{
          month: true,
          week: true,
          day: true,
        }}
        components={components}
        onNavigate={onNavigate}
        onView={onChangeView}
        date={date}
        view={view}
      />
    </div>
  );
};
