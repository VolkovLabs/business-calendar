import { CalendarOptions, CalendarType, SupportedLanguage, View } from '../types';
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
};

/**
 * Default Views
 */
export const DefaultViews = [View.DAY, View.WEEK, View.MONTH];

/**
 * Default View
 */
export const DefaultView = View.MONTH;
