import { FieldType, ArrayVector } from '@grafana/data';
import { toTimeField } from './time';

/**
 * To Time Field
 */
describe('To Time Field', () => {
  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  it('Should return time field for number', () => {
    const result = toTimeField({
      config: {},
      type: FieldType.number,
      name: 'number',
      values: new ArrayVector([]),
    });

    expect(result?.type).toEqual(FieldType.time);
  });

  it('Should return time field for string', () => {
    const result = toTimeField({
      config: {},
      type: FieldType.string,
      name: 'string',
      values: new ArrayVector([getSafeDate().toISOString()]),
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
    const result = toTimeField(field);

    expect(result).toEqual(field);
  });
});
