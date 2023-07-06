import { useMemo } from 'react';
import { Event } from 'react-big-calendar';
import { CalendarEvent } from '../../../types';

export const useCalendarEvents = (events: CalendarEvent[]): Event[] => {
  return useMemo(() => {
    return events.map<Event>(({ text, start, end, ...restEvent }) => ({
      title: text,
      start: start.toDate(),
      end: end ? end.toDate() : end === null ? start.add(100, 'years').toDate() : start.toDate(),
      resource: {
        isEndless: !end,
        ...restEvent,
      },
    }));
  }, [events]);
};
