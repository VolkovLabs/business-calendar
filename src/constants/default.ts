import { CalendarOptions, CalendarType, DateFormat, SupportedLanguage, TimeOptions, View } from '../types';
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
export const DEFAULT_LANGUAGE: SupportedLanguage = Languages.EN;

/**
 * Default Options
 */
export const DEFAULT_OPTIONS: CalendarOptions = {
  annotations: false,
  annotationsLimit: 100,
  annotationsType: AnnotationsType.ALL,
  autoScroll: false,
  calendarType: CalendarType.LEGACY,
  colors: Colors.FRAME,
  displayTime: false,
  quickLinks: false,
  dateFormat: DateFormat.INHERIT,
};

/**
 * Default Views
 */
export const DEFAULT_VIEWS = [View.DAY, View.WEEK, View.MONTH];

/**
 * Default View
 */
export const DEFAULT_VIEW = View.MONTH;

/**
 * Default Scroll To Time
 */
export const DEFAULT_SCROLL_TO_TIME: TimeOptions = {
  hours: 0,
  minutes: 0,
};
