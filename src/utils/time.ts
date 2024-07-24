import { DateTime, dateTimeParse, Field, FieldType, getDisplayProcessor, GrafanaTheme2 } from '@grafana/data';
import { TimeZone } from '@grafana/schema';
import dayjs from 'dayjs';

import { View } from '../types';

/**
 * Time Field
 */
export const toTimeField = ({
  field,
  timeZone,
  theme,
}: {
  field?: Field;
  timeZone: TimeZone;
  theme: GrafanaTheme2;
}): Field | undefined => {
  /**
   * Number
   */
  if (field?.type === FieldType.number) {
    const tmp = { ...field, type: FieldType.time };
    tmp.display = getDisplayProcessor({ field: tmp, timeZone, theme });
    return tmp;
  }

  /**
   * String
   */
  if (field?.type === FieldType.string) {
    const tmp = {
      ...field,
      type: FieldType.time,
      values: field.values.map((value: string) =>
        dateTimeParse(value, {
          timeZone,
          format: 'YYYY-MM-DDTHH:mm:ss.SSSSSSSZ',
        }).valueOf()
      ),
    };
    tmp.display = getDisplayProcessor({ field: tmp, timeZone, theme });
    return tmp;
  }

  return field;
};

export const isOutOfRange = ({
  view,
  newFrom,
  from,
  newTo,
  to,
}: {
  view: View;
  from: DateTime;
  to: DateTime;
  newFrom: dayjs.Dayjs;
  newTo: dayjs.Dayjs;
}) =>
  view === View.DAY
    ? newFrom.valueOf() < from.valueOf() || newFrom.valueOf() > to.valueOf()
    : newFrom.valueOf() < from.valueOf() || newTo.valueOf() > to.valueOf();
