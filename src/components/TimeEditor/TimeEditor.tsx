import React from 'react';
import { dateTime, InternalTimeZones, StandardEditorProps } from '@grafana/data';
import { TimeOfDayPicker } from '@grafana/ui';
import { TestIds } from '../../constants';
import { CalendarOptions } from '../../types';
import { getDateWithMinutesOffset, getMinutesOffsetFromTimeZone } from '../../utils';

/**
 * Properties
 */
interface Props extends StandardEditorProps<string, null, CalendarOptions> {}

/**
 * Time Editor
 */
export const TimeEditor: React.FC<Props> = ({ value, onChange }) => {
  const minutesOffset = getMinutesOffsetFromTimeZone(InternalTimeZones.utc);
  const utcDate = getDateWithMinutesOffset(new Date(value), minutesOffset);

  return (
    <TimeOfDayPicker
      value={dateTime(utcDate)}
      onChange={(date) => {
        onChange(getDateWithMinutesOffset(date.toDate(), -minutesOffset).toISOString());
      }}
      data-testid={TestIds.timeEditor.field}
    />
  );
};
