/**
 * Calendar Options
 */
export interface CalendarOptions {
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
   * Color
   *
   * @type {string}
   */
  colorField?: string;
}
