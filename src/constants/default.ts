import { CalendarOptions, CalendarType, HoursFormat, SupportedLanguage, TimeOptions, View } from '../types';
import { AnnotationsType, Colors } from './options';

/**
 * Languages
 */
export const enum Languages {
  DE = 'de',
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  ZH = 'zh',
}

/**
 * Default Language
 */
export const DefaultLanguage: SupportedLanguage = Languages.EN;

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
  hoursFormat: HoursFormat.HALF,
};

/**
 * Default Views
 */
export const DefaultViews = [View.DAY, View.WEEK, View.MONTH];

/**
 * Default View
 */
export const DefaultView = View.MONTH;

/**
 * Default Scroll To Time
 */
export const DefaultScrollToTime: TimeOptions = {
  hours: 0,
  minutes: 0,
};
