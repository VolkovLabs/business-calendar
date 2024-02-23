import { Messages } from 'react-big-calendar';

/**
 * Calendar Type
 */
export enum CalendarType {
  LEGACY = 'legacy',
  BIG_CALENDAR = 'bigCalendar',
}

/**
 * View
 */
export enum View {
  DAY = 'day',
  WEEK = 'week',
  WORK_WEEK = 'work_week',
  MONTH = 'month',
  YEAR = 'year',
}

/**
 * Big Messages
 */
export interface BigMessages extends Messages {
  /**
   * Year
   *
   * @type {string}
   */
  year: string;
}

/**
 * Hours Format
 */
export enum HoursFormat {
  HALF = 'half',
  FULL_2 = 'full2',
}
