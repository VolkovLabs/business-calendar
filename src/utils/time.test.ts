import { ArrayVector, FieldType, GrafanaTheme2 } from '@grafana/data';
import { getTheme } from '@grafana/ui';

import { toTimeField } from './time';

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
        values: new ArrayVector([]),
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
        values: new ArrayVector([getSafeDate().toISOString()]),
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
      values: new ArrayVector([]),
    };
    const result = toTimeField({ field, theme, timeZone: 'abc' });

    expect(result).toEqual(field);
  });
});
