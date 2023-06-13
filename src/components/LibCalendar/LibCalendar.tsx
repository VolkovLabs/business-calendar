import React, { useMemo, useCallback } from 'react';
import en from 'dayjs/locale/en';
import { PanelProps, getLocaleData } from '@grafana/data';
import { Calendar, dayjsLocalizer, Event } from 'react-big-calendar';
import dayjs from 'dayjs';
import { CalendarOptions, CalendarEvent } from '../../types';
import { useEventFrames, useColors, useCalendarEvents } from '../../utils';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const useLibCalendarEvents = (events: CalendarEvent[]): Event[] => {
  return useMemo(() => {
    return events.map<Event>((event) => ({
      ...event,
      title: event.text,
      start: event.start.toDate(),
      end: event.end ? event.end.toDate() : event.end,
    }));
  }, [events]);
};

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

export const LibCalendar: React.FC<Props> = ({ height, data, options, timeZone, fieldConfig, timeRange }) => {
  /**
   * Frame events
   */
  const frames = useEventFrames(data.series, options, timeZone);

  /**
   * Colors
   */
  const colors = useColors(fieldConfig);

  /**
   * Default events
   */
  const defaultEvents = useCalendarEvents(frames, options, colors, timeRange);

  /**
   * Adopted Events for BigCalendar
   */
  const events = useLibCalendarEvents(defaultEvents);

  const eventPropGetter = useCallback(
    (event: any) => ({
      style: {
        backgroundColor: event.color,
      },
    }),
    []
  );

  return (
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
    />
  );
};
