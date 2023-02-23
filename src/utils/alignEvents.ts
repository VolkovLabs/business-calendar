import { CalendarEvent } from '../types';

/**
 * Expands the calendar events and creates an entry for every day
 * for the duration of the event.
 */
export const alignEvents = (events: CalendarEvent[]): Record<string, CalendarEvent[]> => {
  const alignedEvents: Record<string, CalendarEvent[]> = {};

  /**
   * Sort
   */
  events.sort((a, b) => {
    if (a.start.isSame(b.start)) {
      return a.text.localeCompare(b.text);
    }
    return a.start.isBefore(b.start) ? -1 : 1;
  });

  events.forEach((event) => {
    const eventsOnStart = alignedEvents[event.start.format('YYYY-MM-DD')];

    /**
     * Offset determines the vertical position of the event. It's used to make
     * sure the entries are vertically aligned.
     */
    let offset = 0;
    if (eventsOnStart) {
      /**
       * Find the first available vertical slot, or add it to the end.
       */
      const firstAvailableIndex = eventsOnStart.findIndex((event) => !event);
      offset = firstAvailableIndex < 0 ? eventsOnStart.length : firstAvailableIndex;
    }

    /**
     * We expand each event to an entry for each day it spans.
     */
    expandInterval(event).forEach((entry) => {
      if (!alignedEvents[entry.day]) {
        alignedEvents[entry.day] = [];
      }

      const numEvents = Math.max(alignedEvents[entry.day].length, offset + 1);

      /**
       * Create a temporary array to ensure we can insert the event at the right
       * index. Feels like this can be cleaned up.
       */
      const tmp = Array.from<CalendarEvent>({ length: numEvents });
      alignedEvents[entry.day].forEach((e, i) => (tmp[i] = e));
      tmp[offset] = entry.event;
      alignedEvents[entry.day] = tmp;
    });
  });

  return alignedEvents;
};

/**
 * Expands the event interval to an array for each day, containing a reference to the event.
 */
const expandInterval = (event: CalendarEvent): Array<{ day: string; event: CalendarEvent }> => {
  /**
   * If no end time has been defined, we consider it a single day event.
   */
  if (!event.end) {
    return [{ day: event.start.format('YYYY-MM-DD'), event }];
  }

  /**
   * Duration
   */
  const eventDurationInDays = event.end.endOf('day').diff(event.start.startOf('day'), 'days') + 1;

  /**
   * Create an entry per day within the duration of the event.
   */
  return Array.from({ length: eventDurationInDays })
    .map((_, i) => event.start.add(i, 'days'))
    .map((d) => ({ day: d.format('YYYY-MM-DD'), event }));
};
