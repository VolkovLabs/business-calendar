import { ArrayVector, dateTimeParse, Field, FieldType, getDisplayProcessor, TimeZone } from '@grafana/data';
import { CalendarEvent } from '../types';

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

/**
 * Format Event Interval
 */
export const formatEventInterval = (event: CalendarEvent): string => {
  if (event.end) {
    if (event.start.startOf('day').isSame(event.end?.startOf('day'))) {
      return `${event.start.format('LLL')}–${event.end.format('LT')}`;
    }
    return `${event.start.format('LLL')}–${event.end.format('LLL')}`;
  }
  return `${event.start.format('LLL')}`;
};
