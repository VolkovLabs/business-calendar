import { TFunction } from 'i18next';

import { AnnotationsType, ColorMode, DateFormat, EventField, TimeRangeType, View } from '../types';

/**
 * Links Options
 */
export const LINK_OPTIONS = (t: TFunction) => [
  { value: true, label: t('panelOptions.events.quickLinks.options.enabled'), icon: 'link' },
  { value: false, label: t('panelOptions.events.quickLinks.options.disabled'), icon: 'document-info' },
];

/**
 * Color Options
 */
export const COLOR_OPTIONS = (t: TFunction) => [
  { value: ColorMode.FRAME, label: t('panelOptions.layout.colors.options.frame') },
  { value: ColorMode.EVENT, label: t('panelOptions.layout.colors.options.event'), icon: 'calendar-alt' },
];

/**
 * Annotations Options
 */
export const ANNOTATIONS_OPTIONS = (t: TFunction) => [
  { value: true, label: t('panelOptions.annotations.annotations.options.enabled'), icon: 'comments-alt' },
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
  { value: View.AGENDA, label: t('panelOptions.layout.views.options.agenda') },
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
 * TIME RANGE OPTIONS
 */
export const TIME_RANGE_TYPE_OPTIONS = (t: TFunction) => [
  { value: TimeRangeType.DEFAULT, label: t('panelOptions.timeRangeType.options.default'), icon: 'dashboard' },
  { value: TimeRangeType.MANUAL, label: t('panelOptions.timeRangeType.options.manual'), icon: 'pen' },
  { value: TimeRangeType.VARIABLE, label: t('panelOptions.timeRangeType.options.variable'), icon: 'sliders-v-alt' },
];

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

/**
 * Preformatted Options
 */
export const PREFORMATTED_OPTIONS = (t: TFunction) => [
  { value: false, label: t('panelOptions.events.preformattedOptions.options.default'), icon: 'text-fields' },
  { value: true, label: t('panelOptions.events.preformattedOptions.options.preformatted'), icon: 'bars' },
];
