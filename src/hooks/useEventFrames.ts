import { DataFrame, FieldType } from '@grafana/data';
import { TimeZone } from '@grafana/schema';
import { useTheme2 } from '@grafana/ui';
import { useMemo } from 'react';

import { CalendarOptions } from '../types';
import { toTimeField } from '../utils';

/**
 * Get Event Frames
 * @param dataFrames
 * @param options
 * @param timeZone
 */
export const useEventFrames = (dataFrames: DataFrame[], options: CalendarOptions, timeZone: TimeZone) => {
  const theme = useTheme2();

  return useMemo(
    () =>
      dataFrames.map((frame) => ({
        text: options.textField
          ? frame.fields.find((f) => f.name === options.textField)
          : frame.fields.find((f) => f.type === FieldType.string),
        description: frame.fields.filter((f) => options.descriptionField?.includes(f.name)),
        start: toTimeField({
          field: options.timeField
            ? frame.fields.find((f) => f.name === options.timeField)
            : frame.fields.find((f) => f.type === FieldType.time),
          timeZone,
          theme,
        }),
        end: toTimeField({
          field: frame.fields.find((f) => f.name === options.endTimeField),
          timeZone,
          theme,
        }),
        labels: frame.fields.filter((f) => options.labelFields?.includes(f.name)),
        color: frame.fields.find((f) => f.name === options.colorField),
        location: frame.fields.find((f) => f.name === options.locationField),
      })),
    [
      dataFrames,
      options.colorField,
      options.descriptionField,
      options.endTimeField,
      options.labelFields,
      options.textField,
      options.timeField,
      options.locationField,
      theme,
      timeZone,
    ]
  );
};
