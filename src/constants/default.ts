import { CalendarOptions } from '../types';

/**
 * Default Options
 */
export const DefaultOptions: CalendarOptions = {
  quickLinks: false,
  autoScroll: false,
  annotations: false,
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
