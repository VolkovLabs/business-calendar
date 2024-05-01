import { DateFormat, View } from './calendar';

/**
 * Language
 */
export const enum Language {
  DE = 'de',
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  ZH = 'zh',
}

/**
 * Supported Language
 */
export type SupportedLanguage = Language.EN | Language.ES | Language.FR | Language.DE | Language.ZH;

/**
 * Color Mode
 */
export const enum ColorMode {
  FRAME = 'frame',
  EVENT = 'event',
}

/**
 * Annotation Type
 */
export enum AnnotationsType {
  ALL = '',
  ANNOTATION = 'annotation',
  ALERT = 'alert',
}

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
   * @type {ColorMode}
   */
  colors?: ColorMode;

  /**
   * Color Field
   *
   * @type {string}
   */
  colorField?: string;

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
