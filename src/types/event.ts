import dayjs from 'dayjs';
import { Field, LinkModel } from '@grafana/data';

/**
 * Range
 */
export type Range = [dayjs.Dayjs, dayjs.Dayjs];

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
   * @type {dayjs.Dayjs | null}
   */
  end?: dayjs.Dayjs | null;

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
  labels: string[];

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

  /**
   * Location
   *
   * @type {string}
   */
  location?: string;
}
