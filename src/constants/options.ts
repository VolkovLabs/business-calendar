import { TFunction } from 'i18next';
import { CalendarType, View } from '../types';

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
export const LinksOptions = (t: TFunction) => [
  { value: true, label: t('panelOptions.quickLinks.options.enabled') },
  { value: false, label: t('panelOptions.quickLinks.options.disabled') },
];

/**
 * Scroll Options
 */
export const ScrollOptions = (t: TFunction) => [
  { value: true, label: t('panelOptions.autoScroll.options.enabled') },
  { value: false, label: t('panelOptions.autoScroll.options.disabled') },
];

/**
 * Display Time Options
 */
export const DisplayTimeOptions = (t: TFunction) => [
  { value: true, label: t('panelOptions.displayTime.options.enabled') },
  { value: false, label: t('panelOptions.displayTime.options.disabled') },
];

/**
 * Color Options
 */
export const ColorsOptions = (t: TFunction) => [
  { value: Colors.FRAME, label: t('panelOptions.colors.options.frame') },
  { value: Colors.EVENT, label: t('panelOptions.colors.options.event') },
];

/**
 * Calendar Type Options
 */
export const CalendarTypeOptions = (t: TFunction) => [
  { value: CalendarType.LEGACY, label: t('panelOptions.calendarType.options.legacy') },
  { value: CalendarType.BIG_CALENDAR, label: t('panelOptions.calendarType.options.bigCalendar') },
];

/**
 * Annotations Options
 */
export const AnnotationsOptions = (t: TFunction) => [
  { value: true, label: t('panelOptions.annotations.annotations.options.enabled') },
  { value: false, label: t('panelOptions.annotations.annotations.options.disabled') },
];

/**
 * Annotations Type Options
 */
export const AnnotationsTypeOptions = (t: TFunction) => [
  { value: AnnotationsType.ALL, label: t('panelOptions.annotations.annotationsType.options.all') },
  { value: AnnotationsType.ALERT, label: t('panelOptions.annotations.annotationsType.options.alert') },
  { value: AnnotationsType.ANNOTATION, label: t('panelOptions.annotations.annotationsType.options.annotation') },
];

/**
 * Calendar View Options
 */
export const CalendarViewOptions = (t: TFunction) => [
  { value: View.DAY, label: t('panelOptions.views.options.day') },
  { value: View.WEEK, label: t('panelOptions.views.options.week') },
  { value: View.WORK_WEEK, label: t('panelOptions.views.options.workWeek') },
  { value: View.MONTH, label: t('panelOptions.views.options.month') },
  { value: View.YEAR, label: t('panelOptions.views.options.year') },
];
