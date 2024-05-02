import { InternalTimeZones } from '@grafana/data';
import { TimeZone } from '@grafana/schema';
import dayjs from 'dayjs';

import { DEFAULT_LANGUAGE } from '../constants';
import { CalendarEvent } from '../types';

/**
 * Get Minutes Offset From Time Zone
 * @param timeZone
 */
export const getMinutesOffsetFromTimeZone = (timeZone: TimeZone) => {
  if (timeZone === InternalTimeZones.localBrowserTime) {
    /**
     * Offset is not needed, dates are in browser time zone
     */
    return 0;
  }

  /**
   * Calculate offset to show date in dashboard time zone for user
   */
  if (timeZone === InternalTimeZones.utc) {
    /**
     * UTC offset from browser date
     */
    return new Date().getTimezoneOffset();
  }

  const date = new Date();

  /**
   * Browser Date
   * Reset milliseconds to prevent losing 1 minute in difference
   */
  const browserDate = dayjs(date).set('milliseconds', 0);

  /**
   * Time Zone Date
   */
  const timeZoneDate = dayjs(date.toLocaleString(DEFAULT_LANGUAGE, { timeZone }));

  /**
   * Time Zone offset from browser date
   */
  return timeZoneDate.diff(browserDate, 'minute');
};

/**
 * Get Date With Minutes Offset
 * @param date
 * @param minutesOffset
 */
export const getDateWithMinutesOffset = (date: Date, minutesOffset: number): Date => {
  return dayjs(date).add(minutesOffset, 'minutes').toDate();
};

export const isFieldDisplay = (field: string, fields?: string[]) => {
  return fields ? fields.includes(field) : false;
};

export const getTime = (event: CalendarEvent) => {
  return event.end
    ? `${event.start.format('LLL')} - ${
        event.start.startOf('day').isSame(event.end?.startOf('day')) ? event.end.format('LT') : event.end.format('LLL')
      }`
    : `${event.start.format('LLL')}`;
};
