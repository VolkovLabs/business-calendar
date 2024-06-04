import { DateFormat, EventField, View } from './calendar';

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
 * Time rannge Type
 */
export const enum TimeRangeType {
  DEFAULT = 'default',
  MANUAL = 'manual',
  VARIABLE = 'variable',
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

  /**
   * Time Range type
   *
   * @type {string}
   */
  timeRangeType: string;

  /**
   * Start time range
   *
   * @type {string}
   */
  startTimeRange?: string;

  /**
   * End time range
   *
   * @type {string}
   */
  endTimeRange?: string;

  /**
   * Start time variable
   *
   * @type {string}
   */
  startTimeVariable?: string;

  /**
   * End time variable
   *
   * @type {string}
   */
  endTimeVariable?: string;

  /**
   * Display Fields
   *
   * @type {EventField[]}
   */
  displayFields: EventField[];

  /**
   * Location label
   *
   * @type {string}
   */
  locationLabel: string;

  /**
   * Preformatted Description
   *
   * @type {boolean}
   */
  preformattedDescription?: boolean;
}

/**
 * Dashboard Annotation
 */
export interface DashboardAnnotation {
  [key: string]: string[] | number[] | string[][];

  /**
   * Title
   *
   * @type {string[]}
   */
  title: string[];

  /**
   * Tags
   *
   * @type {string[][]}
   */
  tags: string[][];

  /**
   * Color
   *
   * @type {string[]}
   */
  color: string[];

  /**
   * Time
   *
   * @type {number[]}
   */
  time: number[];

  /**
   * Time End
   *
   * @type {number[]}
   */
  timeEnd: number[];

  /**
   * Id
   *
   * @type {string[]}
   */
  id: string[];
}
