import { CalendarType } from '../types';

/**
 * Colors
 */
export const enum Colors {
  FRAME = 'frame',
  EVENT = 'event',
}

/**
 * Annotation Types
 */
export enum AnnotationsType {
  ALL = '',
  ANNOTATION = 'annotation',
  ALERT = 'alert',
}

/**
 * Links Options
 */
export const LinksOptions = [
  { value: true, label: 'Open Link' },
  { value: false, label: 'Show Details' },
];

/**
 * Scroll Options
 */
export const ScrollOptions = [
  { value: true, label: 'Auto' },
  { value: false, label: 'Disabled' },
];

/**
 * Display Time Options
 */
export const DisplayTimeOptions = [
  { value: true, label: 'Enabled' },
  { value: false, label: 'Disabled' },
];

/**
 * Color Options
 */
export const ColorsOptions = [
  { value: Colors.FRAME, label: 'Frame' },
  { value: Colors.EVENT, label: 'Event' },
];

/**
 * Calendar Type Options
 */
export const CalendarTypeOptions = [
  { value: CalendarType.LEGACY, label: 'Legacy' },
  { value: CalendarType.BIG_CALENDAR, label: 'Big Calendar' },
];

/**
 * Annotations Options
 */
export const AnnotationsOptions = [
  { value: true, label: 'Enabled' },
  { value: false, label: 'Disabled' },
];

/**
 * Annotations Type Options
 */
export const AnnotationsTypeOptions = [
  { value: AnnotationsType.ALL, label: 'Any' },
  { value: AnnotationsType.ALERT, label: 'Alerts' },
  { value: AnnotationsType.ANNOTATION, label: 'Annotations' },
];
