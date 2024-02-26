import { AnnotationsType, Colors, Languages } from '../constants';
import { CalendarType, DateFormat, View } from './calendar';

/**
 * Supported Language
 */
export type SupportedLanguage = Languages.EN | Languages.ES | Languages.FR | Languages.DE | Languages.ZH;

/**
 * Time Options
 */
export interface TimeOptions {
  /**
   * Hours
   *
   * @type {number}
   */
  hours: number;

  /**
   * Minutes
   *
   * @type {number}
   */
  minutes: number;
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

  /**
   * Views
   *
   * @type {View[]}
   */
  views?: View[];

  /**
   * Default View
   *
   * @type {View}
   */
  defaultView?: View;

  /**
   * Scroll To Time
   *
   * @type {TimeOptions}
   */
  scrollToTime?: TimeOptions;

  /**
   * Hours Format
   *
   * @type {DateFormat}
   */
  dateFormat: DateFormat;
}
