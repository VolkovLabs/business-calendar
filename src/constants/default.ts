import {
  AnnotationsType,
  CalendarOptions,
  ColorMode,
  DateFormat,
  Language,
  SupportedLanguage,
  TimeOptions,
  View,
} from '../types';

/**
 * Default Language
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = Language.EN;

/**
 * Default Options
 */
export const DEFAULT_OPTIONS: CalendarOptions = {
  annotations: false,
  annotationsLimit: 100,
  annotationsType: AnnotationsType.ALL,
  colors: ColorMode.FRAME,
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
