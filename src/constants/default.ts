import { CalendarOptions, CalendarType } from '../types';
import { AnnotationsType, Colors } from './options';

/**
 * Language
 */
export const DefaultLanguage = 'en-US';

/**
 * Default Options
 */
export const DefaultOptions: CalendarOptions = {
  annotations: false,
  annotationsLimit: 100,
  annotationsType: AnnotationsType.ALL,
  autoScroll: false,
  calendarType: CalendarType.LEGACY,
  colors: Colors.FRAME,
  displayTime: false,
  quickLinks: false,
};
