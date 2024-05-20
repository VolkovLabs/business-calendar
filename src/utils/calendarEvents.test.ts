import dayjs from 'dayjs';

import { EventField } from '../types';
import { displayTime, isFieldVisible } from './calendarEvents';

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
});
