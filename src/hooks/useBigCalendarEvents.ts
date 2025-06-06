import { useMemo } from 'react';
import { Event } from 'react-big-calendar';

import { CalendarEvent } from '../types';
import { splitOvernightEvents } from '../utils';

/**
 * Calendar Events for Big Calendar
 */
export const useBigCalendarEvents = (events: CalendarEvent[]): Event[] => {
  return useMemo(() => {
    const normalizedEvents = splitOvernightEvents(events);

    return normalizedEvents.map<Event>(({ text, start, end, ...restEvent }) => ({
      title: text,
      start: start.toDate(),
      end: end ? end.toDate() : end === null ? start.add(100, 'years').toDate() : start.add(1, 'hours').toDate(),
      resource: {
        noEndTime: !end,
        allDay: end ? !end.isSame(start, 'day') : end === null,
        ...restEvent,
      },
    }));
  }, [events]);
};
