import { InternalTimeZones } from '@grafana/data';
import { TimeZone } from '@grafana/schema';
import dayjs from 'dayjs';
import { Event, stringOrDate } from 'react-big-calendar';

import { DEFAULT_LANGUAGE } from '../constants';
import { CalendarEvent, EventField } from '../types';

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

/**
 * Is Field Visible
 * @param field
 * @param fields
 */
export const isFieldVisible = (field: EventField, fields: EventField[]): boolean => {
  return fields.includes(field);
};

/**
 * Display time
 * @param event
 */
export const displayTime = (event: CalendarEvent) => {
  return event.end
    ? `${event.start.format('LLL')} - ${
        event.start.startOf('day').isSame(event.end?.startOf('day')) ? event.end.format('LT') : event.end.format('LLL')
      }`
    : `${event.start.format('LLL')}`;
};

/**
 * Return CalendarEvent type
 * @param event
 */
export const returnCalendarEvent = (event: Event) => ({
  text: event.title as string,
  start: dayjs(event.start),
  end: event.end && !event.resource?.noEndTime ? dayjs(event.end) : undefined,
  labels: [],
  ...(event.resource || {}),
});

/**
 * Filter Events By Year
 * @param events
 * @param date
 */
export const filterEventsByYear = (events: Event[] | undefined, date?: stringOrDate): Event[] => {
  if (!date || !events) {
    return [];
  }

  const targetYear = dayjs(date).year();

  return events.filter((event) => {
    const startYear = event.start ? dayjs(event.start).year() : null;
    const endYear = event.end ? dayjs(event.end).year() : null;

    return startYear === targetYear || endYear === targetYear;
  });
};
