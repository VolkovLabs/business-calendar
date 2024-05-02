import dayjs from 'dayjs';

import { getTime, isFieldDisplay } from './calendarEvents';

/**
 * Calendar Events
 */
describe('Calendar Events', () => {
  /**
   * isFieldDisplay
   */
  describe('isFieldDisplay', () => {
    it('returns true when the field is included in the fields array', () => {
      const result = isFieldDisplay('field1', ['field1', 'field2', 'field3']);
      expect(result).toBe(true);
    });

    it('returns false when the field is not included in the fields array', () => {
      const result = isFieldDisplay('field4', ['field1', 'field2', 'field3']);
      expect(result).toBe(false);
    });

    it('returns false when the fields array is empty', () => {
      const result = isFieldDisplay('field1', []);
      expect(result).toBe(false);
    });

    it('returns false when the fields array is undefined', () => {
      const result = isFieldDisplay('field1');
      expect(result).toBe(false);
    });

    it('returns true when the field is included multiple times in the fields array', () => {
      const result = isFieldDisplay('field1', ['field1', 'field1', 'field2']);
      expect(result).toBe(true);
    });

    it('returns true when the field is included in the fields array along with other fields', () => {
      const result = isFieldDisplay('field2', ['field1', 'field2', 'field3']);
      expect(result).toBe(true);
    });
  });

  /**
   * getTime
   */
  describe('getTime', () => {
    const getSafeDate = () => new Date('2023-02-02');

    it('should return formatted start time if event has no end time', () => {
      const event = {
        start: dayjs(getSafeDate()),
        end: undefined,
      } as any;

      const result = getTime(event);

      expect(result).toBe('LLL');
    });

    it('should return formatted start and end time if event has end time', () => {
      const event = {
        start: dayjs(getSafeDate()),
        end: dayjs(getSafeDate()),
      } as any;

      const result = getTime(event);

      expect(result).toBe('LLL - LT');
    });

    it('should return formatted start and end time with different date if event spans multiple days', () => {
      const event = {
        start: dayjs(getSafeDate()),
        end: dayjs(getSafeDate()),
      } as any;

      const result = getTime(event);

      expect(result).toBe('LLL - LT');
    });
  });
});
