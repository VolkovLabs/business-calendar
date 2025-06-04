import dayjs from 'dayjs';

import { CalendarEvent, EventField } from '../types';
import { displayTime, filterEventsByYear, isFieldVisible, splitOvernightEvents } from './calendarEvents';

/**
 * Calendar Events
 */
describe('Calendar Events', () => {
  /**
   * isFieldDisplay
   */
  describe('isFieldDisplay', () => {
    it('returns true when the field is included in the fields array', () => {
      const result = isFieldVisible(EventField.LABELS, [EventField.DESCRIPTION, EventField.LABELS, EventField.TEXT]);
      expect(result).toBe(true);
    });

    it('returns false when the field is not included in the fields array', () => {
      const result = isFieldVisible(EventField.DESCRIPTION, [EventField.TEXT, EventField.LINKS, EventField.LOCATION]);
      expect(result).toBe(false);
    });

    it('returns false when the fields array is empty', () => {
      const result = isFieldVisible(EventField.LINKS, []);
      expect(result).toBe(false);
    });

    it('returns true when the field is included multiple times in the fields array', () => {
      const result = isFieldVisible(EventField.LOCATION, [EventField.LOCATION, EventField.LOCATION, EventField.LABELS]);
      expect(result).toBe(true);
    });
  });

  /**
   * displayTime
   */
  describe('displayTime', () => {
    const getSafeDate = () => new Date('2023-02-02');

    it('should return formatted start time if event has no end time', () => {
      const event = {
        start: dayjs(getSafeDate()),
        end: undefined,
      } as any;

      const result = displayTime(event);

      expect(result).toBe('LLL');
    });

    it('should return formatted start and end time if event has end time', () => {
      const event = {
        start: dayjs(getSafeDate()),
        end: dayjs(getSafeDate()),
      } as any;

      const result = displayTime(event);

      expect(result).toBe('LLL - LT');
    });

    it('should return formatted start and end time with different date if event spans multiple days', () => {
      const event = {
        start: dayjs(getSafeDate()),
        end: dayjs(getSafeDate()),
      } as any;

      const result = displayTime(event);

      expect(result).toBe('LLL - LT');
    });
  });

  /**
   * splitOvernightEvents
   */
  describe('splitOvernightEvents', () => {
    const baseEvent = {
      text: 'Test Event',
      description: [],
      labels: [],
      color: '#000000',
      links: [],
    };

    it('Should return regular single-day event as is', () => {
      const events: CalendarEvent[] = [
        {
          ...baseEvent,
          start: dayjs('2025-06-10T10:00:00Z'),
          end: dayjs('2025-06-10T11:00:00Z'),
        },
      ];

      const result = splitOvernightEvents(events);
      expect(result).toHaveLength(1);
      expect(result[0].start.isSame(events[0].start)).toBeTruthy();
      expect(result[0].end?.isSame(events[0].end)).toBeTruthy();
    });

    it('Should split short event crossing midnight', () => {
      const events: CalendarEvent[] = [
        {
          ...baseEvent,
          start: dayjs('2025-05-10T22:00:00Z'),
          end: dayjs('2025-05-11T00:01:00Z'),
        },
      ];

      const result = splitOvernightEvents(events);
      expect(result).toHaveLength(2);

      /**
       * First part: 22:00 → 23:59:59.999
       */
      expect(result[0].start.format()).toEqual('2025-05-10T22:00:00+00:00');
      expect(result[0].end?.format()).toEqual(dayjs('2025-05-10T23:59:59.999Z').format());

      /**
       *  Second part: 00:00 → 00:01
       */
      expect(result[1].start.format()).toEqual(dayjs('2025-05-11T00:00:00Z').format());
      expect(result[1].end?.format()).toEqual('2025-05-11T00:01:00+00:00');
    });

    it('Should not split long multi-day event (> 24h)', () => {
      const events: CalendarEvent[] = [
        {
          ...baseEvent,
          start: dayjs('2025-06-10T08:00:00Z'),
          end: dayjs('2025-06-12T09:00:00Z'),
        },
      ];

      const result = splitOvernightEvents(events);
      expect(result).toHaveLength(1);
      expect(result[0].start.isSame(events[0].start)).toBeTruthy();
      expect(result[0].end?.isSame(events[0].end)).toBeTruthy();
    });

    it('Should handle events with no end time', () => {
      const events: CalendarEvent[] = [
        {
          ...baseEvent,
          start: dayjs('2025-06-11T08:00:00Z'),
          end: null,
        },
      ];

      const result = splitOvernightEvents(events);
      expect(result).toHaveLength(1);
      expect(result[0].start.format()).toEqual('2025-06-11T08:00:00+00:00');
      expect(result[0].end).toBeNull();
    });
  });

  /**
   * filterEventsByYear
   */
  describe('filterEventsByYear', () => {
    const sampleEvents = [
      {
        title: 'Event 1',
        start: dayjs('2025-03-15').toDate(),
        end: dayjs('2025-03-16').toDate(),
      },
      {
        title: 'Event 2',
        start: dayjs('2024-12-31').toDate(),
        end: dayjs('2025-01-01').toDate(),
      },
      {
        title: 'Event 3',
        start: dayjs('2023-05-20').toDate(),
        end: dayjs('2023-05-21').toDate(),
      },
      {
        title: 'Event 4',
        start: dayjs('2026-06-10').toDate(),
        end: dayjs('2026-06-11').toDate(),
      },
      {
        title: 'Event 5',
        start: dayjs('2025-07-01').toDate(),
        end: undefined,
      },
      {
        title: 'Event 6',
        start: undefined,
        end: dayjs('2025-07-01').toDate(),
      },
    ] as any;

    it('Should filters events by the specified year', () => {
      const result = filterEventsByYear(sampleEvents, '2025-01-01');
      expect(result).toHaveLength(4);
      expect(result).toEqual([sampleEvents[0], sampleEvents[1], sampleEvents[4], sampleEvents[5]]);
    });

    it('Should returns an empty array if events is undefined', () => {
      expect(filterEventsByYear(undefined, '2025-01-01')).toEqual([]);
    });

    it('Should returns an empty array if date is not provided', () => {
      expect(filterEventsByYear(sampleEvents, undefined)).toEqual([]);
    });

    it('Should Filters events for the year 2024', () => {
      const result = filterEventsByYear(sampleEvents, '2024-06-01');
      expect(result).toHaveLength(1);
      expect(result).toEqual([sampleEvents[1]]);
    });

    it('Should filters events for the year 2023', () => {
      const result = filterEventsByYear(sampleEvents, '2023-01-01');
      expect(result).toHaveLength(1);
      expect(result).toEqual([sampleEvents[2]]);
    });

    it('Should filters events for the year 2026', () => {
      const result = filterEventsByYear(sampleEvents, '2026-01-01');
      expect(result).toHaveLength(1);
      expect(result).toEqual([sampleEvents[3]]);
    });

    it(' Should returns an empty array if no events match the specified year', () => {
      const result = filterEventsByYear(sampleEvents, '2027-01-01');
      expect(result).toHaveLength(0);
    });
  });
});
