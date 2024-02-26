import { renderHook } from '@testing-library/react';
import dayjs from 'dayjs';

import { CalendarEvent } from '../types';
import { useCalendarEvents } from './useCalendarEvents';

/**
 * Use Calendar Events
 */
describe('Use Calendar Events', () => {
  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Test events
   */
  const event1: CalendarEvent = {
    text: 'text',
    start: dayjs(getSafeDate()),
    labels: [],
    color: '#999',
  };
  const event2 = {
    text: 'text 2',
    start: dayjs(getSafeDate()),
    end: dayjs(getSafeDate()),
    labels: [],
    color: '#666',
    description: 'description',
  };
  const event3: CalendarEvent = {
    text: 'text',
    start: dayjs(getSafeDate()),
    end: null,
    labels: [],
    color: '#999',
  };

  it('Should transform events to calendar events', () => {
    const events: CalendarEvent[] = [event1, event2, event3];
    const { result } = renderHook(() => useCalendarEvents(events));

    const calendarEvents = result.current;

    expect(calendarEvents).toHaveLength(3);

    const calendarEvent1 = calendarEvents[0];
    expect(calendarEvent1).toEqual(
      expect.objectContaining({
        title: event1.text,
        resource: {
          color: event1.color,
          labels: event1.labels,
          isEndless: true,
        },
      })
    );

    /**
     * Check start date
     */
    expect(calendarEvent1?.start).toBeInstanceOf(Date);
    expect(calendarEvent1?.start?.toISOString()).toEqual(event1.start.toISOString());

    /**
     * Check if end date of endless event is far enough
     */
    expect(calendarEvent1?.end).toBeInstanceOf(Date);
    expect(calendarEvent1?.end?.toISOString()).toEqual(event1.start.add(1, 'hours').toISOString());

    const calendarEvent2 = calendarEvents[1];
    expect(calendarEvent2).toEqual(
      expect.objectContaining({
        title: event2.text,
        resource: {
          color: event2.color,
          labels: event2.labels,
          description: event2.description,
          isEndless: false,
        },
      })
    );
    expect(calendarEvent2?.start).toBeInstanceOf(Date);
    expect(calendarEvent2?.start?.toISOString()).toEqual(event2.start.toISOString());
    expect(calendarEvent2?.end).toBeInstanceOf(Date);
    expect(calendarEvent2?.end?.toISOString()).toEqual(event2.end.toISOString());

    const calendarEvent3 = calendarEvents[2];
    expect(calendarEvent3).toEqual(
      expect.objectContaining({
        title: event3.text,
        resource: {
          color: event3.color,
          labels: event3.labels,
          description: event3.description,
          isEndless: true,
        },
      })
    );
    expect(calendarEvent3?.start).toBeInstanceOf(Date);
    expect(calendarEvent3?.start?.toISOString()).toEqual(event2.start.toISOString());
    expect(calendarEvent3?.end).toBeDefined();
  });

  it('Should cache results', () => {
    const events: CalendarEvent[] = [event1, event2];
    const { result, rerender } = renderHook(() => useCalendarEvents(events));

    const firstResult = result.current;

    rerender(events);

    expect(firstResult).toStrictEqual(result.current);
  });
});
