import { AnnotationsType, Colors } from '../constants';

export enum CalendarType {
  LEGACY = 'legacy',
  BIG_CALENDAR = 'bigCalendar',
}

/**
 * Calendar Options
 */
export interface CalendarOptions {
  /**
   * Calendar Type
   */
  calendarType?: CalendarType;

  /**
   * Auto Scroll
   *
   * @type {boolean}
   */
  autoScroll: boolean;

  /**
   * Time
   *
   * @type {string}
   */
  timeField?: string;

  /**
   * Description
   *
   * @type {string}
   */
  descriptionField?: string;

  /**
   * End Time
   *
   * @type {string}
   */
  endTimeField?: string;

  /**
   * Text
   *
   * @type {string}
   */
  textField?: string;

  /**
   * Labels
   *
   * @type {string[]}
   */
  labelFields?: string[];

  /**
   * Quick Links
   *
   * @type {boolean}
   */
  quickLinks?: boolean;

  /**
   * Annotations
   *
   * @type {boolean}
   */
  annotations?: boolean;

  /**
   * Annotations Type
   *
   * @type {AnnotationsType}
   */
  annotationsType?: AnnotationsType;

  /**
   * Annotations Limit
   *
   * @type {number}
   */
  annotationsLimit?: number;

  /**
   * Colors
   *
   * @type {Colors}
   */
  colors?: Colors;

  /**
   * Color Field
   *
   * @type {string}
   */
  colorField?: string;

  /**
   * Display Time
   *
   * @type {boolean}
   */
  displayTime?: boolean;

  /**
   * Location Field
   *
   * @type {string}
   */
  locationField?: string;
}
