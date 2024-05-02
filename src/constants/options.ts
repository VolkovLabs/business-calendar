import { TFunction } from 'i18next';

import { AnnotationsType, ColorMode, DateFormat, EventField, View } from '../types';

/**
 * Links Options
 */
export const LINK_OPTIONS = (t: TFunction) => [
  { value: true, label: t('panelOptions.events.quickLinks.options.enabled') },
  { value: false, label: t('panelOptions.events.quickLinks.options.disabled') },
];

/**
 * Color Options
 */
export const COLOR_OPTIONS = (t: TFunction) => [
  { value: ColorMode.FRAME, label: t('panelOptions.layout.colors.options.frame') },
  { value: ColorMode.EVENT, label: t('panelOptions.layout.colors.options.event') },
];

/**
 * Annotations Options
 */
export const ANNOTATIONS_OPTIONS = (t: TFunction) => [
  { value: true, label: t('panelOptions.annotations.annotations.options.enabled') },
  { value: false, label: t('panelOptions.annotations.annotations.options.disabled') },
];

/**
 * Annotations Type Options
 */
export const ANNOTATIONS_TYPE_OPTIONS = (t: TFunction) => [
  { value: AnnotationsType.ALL, label: t('panelOptions.annotations.annotationsType.options.all') },
  { value: AnnotationsType.ALERT, label: t('panelOptions.annotations.annotationsType.options.alert'), icon: 'bell' },
  { value: AnnotationsType.ANNOTATION, label: t('panelOptions.annotations.annotationsType.options.annotation') },
];

/**
 * Calendar View Options
 */
export const CALENDAR_VIEW_OPTIONS = (t: TFunction) => [
  { value: View.DAY, label: t('panelOptions.layout.views.options.day') },
  { value: View.WEEK, label: t('panelOptions.layout.views.options.week') },
  { value: View.WORK_WEEK, label: t('panelOptions.layout.views.options.workWeek') },
  { value: View.MONTH, label: t('panelOptions.layout.views.options.month') },
  { value: View.YEAR, label: t('panelOptions.layout.views.options.year') },
];

/**
 * Date Format Options
 */
export const DATE_FORMAT_OPTIONS = (t: TFunction) =>
  Object.values(DateFormat).map((format) => ({
    value: format,
    label: t(`panelOptions.layout.dateFormat.options.${format}`),
  }));

/**
 * Display Fields Options
 */
export const DISPLAY_FIELD_OPTIONS = (t: TFunction) => [
  { value: EventField.DESCRIPTION, label: t('panelOptions.eventField.options.description') },
  { value: EventField.LABELS, label: t('panelOptions.eventField.options.labels') },
  { value: EventField.LINKS, label: t('panelOptions.eventField.options.links') },
  { value: EventField.LOCATION, label: t('panelOptions.eventField.options.location') },
  { value: EventField.TEXT, label: t('panelOptions.eventField.options.text') },
  { value: EventField.TIME, label: t('panelOptions.eventField.options.time') },
];
