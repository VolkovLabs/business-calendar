import { useMemo } from 'react';
import { Event } from 'react-big-calendar';
import { CalendarEvent } from '../../../types';

export const useCalendarEvents = (events: CalendarEvent[]): Event[] => {
  return useMemo(() => {
    return events.map<Event>(({ text, start, end, ...restEvent }) => ({
      title: text,
      start: start.toDate(),
      /**
       * Big Calendar doesn't support endless events so just set end date far enough
       */
      end: end ? end.toDate() : start.add(100, 'years').toDate(),
      resource: {
        isEndless: !end,
        ...restEvent,
      },
    }));
  }, [events]);
};
