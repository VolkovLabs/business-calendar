import { DateLocalizer as BigDateLocalizer, Messages } from 'react-big-calendar';

/**
 * View
 */
export enum View {
  AGENDA = 'agenda',
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

/**
 * Date Localizer
 */
export interface DateLocalizer extends Omit<BigDateLocalizer, 'formats'> {
  formats: BigDateLocalizer['formats'] & {
    yearHeaderFormat: string;
    yearMonthFormat: string;
    yearWeekFormat: string;
    yearDateFormat: string;
  };
}

/**
 * Event field
 */
export enum EventField {
  DESCRIPTION = 'description',
  LABELS = 'labels',
  LINKS = 'links',
  LOCATION = 'location',
  TEXT = 'text',
  TIME = 'time',
}
