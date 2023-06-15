import { CalendarOptions, CalendarType } from '../types';

/**
 * Colors
 */
export const enum Colors {
  FRAME = 'frame',
  EVENT = 'event',
}

/**
 * Default Options
 */
export const DefaultOptions: CalendarOptions = {
  calendarType: CalendarType.CUSTOM,
  quickLinks: false,
  autoScroll: false,
  annotations: false,
  displayTime: false,
  colors: Colors.FRAME,
};

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
 * Annotations Options
 */
export const AnnotationsOptions = [
  { value: true, label: 'Enabled' },
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
  { value: CalendarType.CUSTOM, label: 'Custom' },
  { value: CalendarType.BIG_CALENDAR, label: 'Big Calendar' },
];
