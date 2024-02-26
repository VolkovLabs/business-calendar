import dayjs, { OpUnitType } from 'dayjs';

import { CalendarEvent } from '../types';

/**
 * Expands the calendar events and creates an entry for every day
 * for the duration of the event.
 */
export const alignEvents = (
  events: CalendarEvent[],
  firstDay: OpUnitType | 'isoWeek'
): Record<string, CalendarEvent[]> => {
  const alignedEvents: Record<string, CalendarEvent[]> = {};

  /**
   * Sorting by Event start
   */
  events.sort((a, b) => {
    if (a.start.isSame(b.start)) {
      return a.text.localeCompare(b.text);
    }
    return a.start.isBefore(b.start) ? -1 : 1;
  });

  events.forEach((event) => {
    /**
     * Single day event
     */
    if (!event.end) {
      const interval = [{ day: event.start.format('YYYY-MM-DD'), event }];
      return addEvents(event.start, alignedEvents, interval);
    }

    /**
     * Multi-Day
     */
    let start = event.start;
    let duration = event.end.endOf('day').diff(start.startOf('day'), 'days') + 1;
    while (event.end.endOf('day').diff(start.endOf('day'), 'day') > 7) {
      duration = start.endOf(firstDay).diff(start.startOf('day'), 'days') + 1;

      const interval = Array.from({ length: duration })
        .map((_, i) => start.add(i, 'days'))
        .map((d) => ({ day: d.format('YYYY-MM-DD'), event }));

      addEvents(start, alignedEvents, interval);
      start = start.endOf(firstDay).add(1, 'days');
      duration = event.end.endOf('day').diff(start.startOf('day'), 'days') + 1;
    }

    const interval = Array.from({ length: duration })
      .map((_, i) => start.add(i, 'days'))
      .map((d) => ({ day: d.format('YYYY-MM-DD'), event }));

    addEvents(start, alignedEvents, interval);
  });

  return alignedEvents;
};

/**
 * Add Events starting from the Start day
 */
const addEvents = (start: dayjs.Dayjs, alignedEvents: Record<string, CalendarEvent[]>, interval: any) => {
  /**
   * Offset determines the vertical position of the event. It's used to make
   * sure the entries are vertically aligned.
   */
  const eventsOnStart = alignedEvents[start.format('YYYY-MM-DD')];
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
  interval.forEach((entry: any) => {
    if (!alignedEvents[entry.day]) {
      alignedEvents[entry.day] = [];
    }

    while (alignedEvents[entry.day].length < offset) {
      alignedEvents[entry.day].push(undefined as any);
    }
    alignedEvents[entry.day].splice(offset, 1, entry.event);
  });
};
