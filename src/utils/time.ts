import { ArrayVector, dateTimeParse, Field, FieldType, getDisplayProcessor, TimeZone } from '@grafana/data';

/**
 * Time Field
 */
export const toTimeField = (field?: Field, timeZone?: TimeZone, theme?: any): Field | undefined => {
  if (field?.type === FieldType.number) {
    const tmp = { ...field, type: FieldType.time };
    tmp.display = getDisplayProcessor({ field: tmp, timeZone, theme });
    return tmp;
  } else if (field?.type === FieldType.string) {
    const tmp = {
      ...field,
      type: FieldType.time,
      values: new ArrayVector(
        field.values.toArray().map((_: string) =>
          dateTimeParse(_, {
            timeZone,
            format: 'YYYY-MM-DDTHH:mm:ss.SSSSSSSZ',
          }).valueOf()
        )
      ),
    };
    tmp.display = getDisplayProcessor({ field: tmp, timeZone, theme });
    return tmp;
  }

  return field;
};
