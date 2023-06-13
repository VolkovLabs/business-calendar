import { Colors } from '../constants';

/**
 * Calendar Options
 */
export interface CalendarOptions {
  /**
   * Calendar Type
   */
  calendarType?: 'custom' | 'library';

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
}
