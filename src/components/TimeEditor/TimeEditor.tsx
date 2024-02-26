import { dateTime, InternalTimeZones, StandardEditorProps } from '@grafana/data';
import { TimeOfDayPicker } from '@grafana/ui';
import React from 'react';

import { TestIds } from '../../constants';
import { CalendarOptions, TimeOptions } from '../../types';
import { getDateWithMinutesOffset, getMinutesOffsetFromTimeZone } from '../../utils';

/**
 * Properties
 */
interface Props extends StandardEditorProps<TimeOptions, null, CalendarOptions> {}

/**
 * Time Editor
 */
export const TimeEditor: React.FC<Props> = ({ value, onChange }) => {
  const minutesOffset = getMinutesOffsetFromTimeZone(InternalTimeZones.utc);

  /**
   * Set only minutes and hours to prevent Daylight Saving Time shifting issue
   */
  const todayDate = new Date();
  todayDate.setUTCHours(value.hours);
  todayDate.setUTCMinutes(value.minutes);

  const utcDate = getDateWithMinutesOffset(todayDate, minutesOffset);

  return (
    <TimeOfDayPicker
      value={dateTime(utcDate)}
      onChange={(dateTime) => {
        const utcDate = getDateWithMinutesOffset(dateTime.toDate(), -minutesOffset);
        const hours = utcDate.getUTCHours();
        const minutes = utcDate.getUTCMinutes();

        onChange({
          hours,
          minutes,
        });
      }}
      data-testid={TestIds.timeEditor.field}
    />
  );
};
