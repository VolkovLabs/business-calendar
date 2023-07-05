import dayjs from 'dayjs';
import { renderHook } from '@testing-library/react';
import { CalendarEvent } from '../../../types';
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
  it('Should transform events to calendar events', () => {
    const events: CalendarEvent[] = [event1, event2];
    const { result } = renderHook(() => useCalendarEvents(events));

    const calendarEvents = result.current;

    expect(calendarEvents).toHaveLength(2);

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
    expect(calendarEvent1?.end?.toISOString()).toEqual(event1.start.add(100, 'years').toISOString());

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
  });

  it('Should cache results', () => {
    const events: CalendarEvent[] = [event1, event2];
    const { result, rerender } = renderHook(() => useCalendarEvents(events));

    const firstResult = result.current;

    rerender(events);

    expect(firstResult).toStrictEqual(result.current);
  });
});
