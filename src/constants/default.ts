import { CalendarOptions, CalendarType, View } from '../types';
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

/**
 * Default Views
 */
export const DefaultViews = [View.DAY, View.WEEK, View.MONTH];
