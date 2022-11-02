import dayjs from 'dayjs';
import { Field, LinkModel } from '@grafana/data';

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
}

/**
 * Calendar Event
 */
export interface CalendarEvent {
  /**
   * Text
   *
   * @type {string}
   */
  text: string;

  /**
   * Start
   *
   * @type {dayjs.Dayjs}
   */
  start: dayjs.Dayjs;

  /**
   * End
   *
   * @type {dayjs.Dayjs}
   */
  end?: dayjs.Dayjs;

  /**
   * Description
   *
   * @type {string}
   */
  description?: string;

  /**
   * Labels
   *
   * @type {string[]}
   */
  labels?: string[];

  /**
   * Color
   *
   * @type {string}
   */
  color: string;

  /**
   * Links
   *
   * @type {Array<LinkModel<Field>>}
   */
  links?: Array<LinkModel<Field>>;
}
