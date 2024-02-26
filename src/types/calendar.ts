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
 * Date Format
 */
export enum DateFormat {
  INHERIT = 'inherit',
  EN = 'en',
  EN_24H = 'en24',
  DE = 'de',
  ES = 'es',
  FR = 'fr',
  ZH = 'zh',
  ISO = 'iso',
}
