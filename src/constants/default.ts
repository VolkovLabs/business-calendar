import { CalendarOptions, CalendarType, SupportedLanguage, View } from '../types';
import { AnnotationsType, Colors } from './options';

/**
 * Default Language
 */
export const DefaultLanguage: SupportedLanguage = 'en';

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

/**
 * Default View
 */
export const DefaultView = View.MONTH;
