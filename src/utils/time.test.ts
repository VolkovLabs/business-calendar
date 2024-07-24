import { FieldType, GrafanaTheme2 } from '@grafana/data';
import { getTheme } from '@grafana/ui';
import dayjs from 'dayjs';

import { View } from '../types';
import { isOutOfRange, toTimeField } from './time';
/**
 * To Time Field
 */
describe('To Time Field', () => {
  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Theme
   */
  const theme = getTheme() as any as GrafanaTheme2;

  it('Should return time field for number', () => {
    const result = toTimeField({
      field: {
        config: {},
        type: FieldType.number,
        name: 'number',
        values: [],
      },
      theme,
      timeZone: 'abc',
    });

    expect(result?.type).toEqual(FieldType.time);
  });

  it('Should return time field for string', () => {
    const result = toTimeField({
      field: {
        config: {},
        type: FieldType.string,
        name: 'string',
        values: [getSafeDate().toISOString()],
      },
      theme,
      timeZone: 'abc',
    });

    expect(result?.type).toEqual(FieldType.time);
  });

  it('Should return the same field', () => {
    const field = {
      config: {},
      type: FieldType.time,
      name: 'string',
      values: [],
    };
    const result = toTimeField({ field, theme, timeZone: 'abc' });

    expect(result).toEqual(field);
  });
});

/**
 * is Out of Range
 */
describe('isOutOfRange', () => {
  it('Should return false in DAY view if day in range', () => {
    const view = View.DAY;
    const from = dayjs('2023-01-01') as any;
    const to = dayjs('2023-01-07') as any;
    const newFrom = dayjs('2023-01-02');
    const newTo = dayjs('2023-01-02');

    const result = isOutOfRange({ view, from, to, newFrom, newTo });

    expect(result).toBe(false);
  });

  it('Should return true in DAY view if day out of range', () => {
    const view = View.DAY;
    const from = dayjs('2023-01-01') as any;
    const to = dayjs('2023-01-07') as any;
    const newFrom = dayjs('2023-01-08');
    const newTo = dayjs('2023-01-08');

    const result = isOutOfRange({ view, from, to, newFrom, newTo });

    expect(result).toBe(true);
  });

  it('Should return true in non-DAY view if out of range', () => {
    const view = View.WEEK;
    const from = dayjs('2023-01-01') as any;
    const to = dayjs('2023-01-31') as any;
    const newFrom = dayjs('2022-12-25');
    const newTo = dayjs('2023-01-02');

    const result = isOutOfRange({ view, from, to, newFrom, newTo });

    expect(result).toBe(true);
  });

  it('Should return false in non-DAY view if in range', () => {
    const view = View.WEEK;
    const from = dayjs('2023-01-01') as any;
    const to = dayjs('2023-01-31') as any;
    const newFrom = dayjs('2023-01-15');
    const newTo = dayjs('2023-01-22');

    const result = isOutOfRange({ view, from, to, newFrom, newTo });

    expect(result).toBe(false);
  });
});
