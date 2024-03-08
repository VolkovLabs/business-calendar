import './i18n';

import { Field, FieldConfigProperty, FieldType, PanelPlugin } from '@grafana/data';
import { t } from 'i18next';

import { CalendarPanel, DefaultViewEditor, MultiFieldEditor, TimeEditor } from './components';
import {
  ANNOTATIONS_OPTIONS,
  ANNOTATIONS_TYPE_OPTIONS,
  CALENDAR_TYPE_OPTIONS,
  CALENDAR_VIEW_OPTIONS,
  COLOR_OPTIONS,
  DATE_FORMAT_OPTIONS,
  DEFAULT_OPTIONS,
  DEFAULT_SCROLL_TO_TIME,
  DEFAULT_VIEW,
  DEFAULT_VIEWS,
  DISPLAY_TIME_OPTIONS,
  LINK_OPTIONS,
  SCROLL_OPTIONS,
} from './constants';
import { CalendarOptions, CalendarType } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<CalendarOptions>(CalendarPanel)
  .setNoPadding()
  .useFieldConfig({
    disableStandardOptions: [
      FieldConfigProperty.Min,
      FieldConfigProperty.Max,
      FieldConfigProperty.Decimals,
      FieldConfigProperty.DisplayName,
      FieldConfigProperty.NoValue,
      'unitScale' as never,
      'fieldMinMax' as never,
    ],
  })
  .setPanelOptions((builder) => {
    /**
     * Visibility
     */
    const showForLegacy = (config: CalendarOptions) => config.calendarType === CalendarType.LEGACY;
    const showForBigCalendar = (config: CalendarOptions) => config.calendarType === CalendarType.BIG_CALENDAR;

    builder
      .addRadio({
        path: 'calendarType',
        name: t('panelOptions.calendarType.label'),
        settings: {
          options: CALENDAR_TYPE_OPTIONS(t),
        },
        defaultValue: CalendarType.LEGACY,
      })
      .addMultiSelect({
        path: 'views',
        name: t('panelOptions.views.label'),
        settings: {
          options: CALENDAR_VIEW_OPTIONS(t),
        },
        defaultValue: DEFAULT_VIEWS as unknown,
        showIf: showForBigCalendar,
      })
      .addCustomEditor({
        id: 'defaultViewEditor',
        path: 'defaultView',
        name: t('panelOptions.defaultView.label'),
        editor: DefaultViewEditor,
        defaultValue: DEFAULT_VIEW,
        showIf: showForBigCalendar,
      })
      .addCustomEditor({
        id: 'scrollToTime',
        path: 'scrollToTime',
        name: t('panelOptions.scrollToTime.label'),
        description: t('panelOptions.scrollToTime.description'),
        editor: TimeEditor,
        defaultValue: DEFAULT_SCROLL_TO_TIME,
        showIf: showForBigCalendar,
      })
      .addSelect({
        path: 'dateFormat',
        name: t('panelOptions.dateFormat.label'),
        settings: {
          options: DATE_FORMAT_OPTIONS(t),
        },
        defaultValue: DEFAULT_OPTIONS.dateFormat,
        showIf: showForBigCalendar,
      })
      .addRadio({
        path: 'autoScroll',
        name: t('panelOptions.autoScroll.label'),
        description: t('panelOptions.autoScroll.description'),
        settings: {
          options: SCROLL_OPTIONS(t),
        },
        defaultValue: DEFAULT_OPTIONS.autoScroll,
        showIf: showForLegacy,
      })
      .addRadio({
        path: 'displayTime',
        name: t('panelOptions.displayTime.label'),
        description: t('panelOptions.displayTime.description'),
        settings: {
          options: DISPLAY_TIME_OPTIONS(t),
        },
        defaultValue: DEFAULT_OPTIONS.annotations,
        showIf: showForLegacy,
      })
      .addRadio({
        path: 'quickLinks',
        name: t('panelOptions.quickLinks.label'),
        description: t('panelOptions.quickLinks.description'),
        settings: {
          options: LINK_OPTIONS(t),
        },
        defaultValue: DEFAULT_OPTIONS.quickLinks,
      })
      .addRadio({
        path: 'colors',
        name: t('panelOptions.colors.label'),
        description: t('panelOptions.quickLinks.description'),
        settings: {
          options: COLOR_OPTIONS(t),
        },
        defaultValue: DEFAULT_OPTIONS.colors,
      });

    /**
     * Events
     */
    builder
      .addFieldNamePicker({
        path: 'textField',
        name: t('panelOptions.events.textField.label'),
        description: t('panelOptions.events.textField.description'),
        category: [t('panelOptions.events.label')],
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: t('panelOptions.events.textField.noFieldsMessage'),
        },
      })
      .addFieldNamePicker({
        path: 'descriptionField',
        name: t('panelOptions.events.descriptionField.label'),
        description: t('panelOptions.events.descriptionField.description'),
        category: [t('panelOptions.events.label')],
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: t('panelOptions.events.descriptionField.noFieldsMessage'),
        },
      })
      .addFieldNamePicker({
        path: 'locationField',
        name: t('panelOptions.events.locationField.label'),
        description: t('panelOptions.events.locationField.description'),
        category: [t('panelOptions.events.label')],
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: t('panelOptions.events.locationField.noFieldsMessage'),
        },
      })
      .addFieldNamePicker({
        path: 'timeField',
        name: t('panelOptions.events.timeField.label'),
        description: t('panelOptions.events.timeField.description'),
        category: [t('panelOptions.events.label')],
        settings: {
          filter: (f: Field) => [FieldType.time, FieldType.string, FieldType.number].includes(f.type),
        },
      })
      .addFieldNamePicker({
        path: 'endTimeField',
        name: t('panelOptions.events.endTimeField.label'),
        description: t('panelOptions.events.endTimeField.description'),
        category: [t('panelOptions.events.label')],
        settings: {
          filter: (f: Field) => [FieldType.time, FieldType.string, FieldType.number].includes(f.type),
        },
      })
      .addCustomEditor({
        id: 'labelFields',
        path: 'labelFields',
        name: t('panelOptions.events.labelFields.label'),
        description: t('panelOptions.events.labelFields.description'),
        editor: MultiFieldEditor,
        category: [t('panelOptions.events.label')],
        settings: {
          filterByType: [FieldType.string],
        },
      })
      .addFieldNamePicker({
        path: 'colorField',
        name: t('panelOptions.events.colorField.label'),
        description: t('panelOptions.events.colorField.description'),
        category: [t('panelOptions.events.label')],
        settings: {
          filter: (f: Field) => [FieldType.string, FieldType.number].includes(f.type),
        },
      });

    /**
     * Annotations
     */
    builder
      .addRadio({
        path: 'annotations',
        name: t('panelOptions.annotations.annotations.label'),
        description: t('panelOptions.annotations.annotations.description'),
        settings: {
          options: ANNOTATIONS_OPTIONS(t),
        },
        category: [t('panelOptions.annotations.label')],
        defaultValue: DEFAULT_OPTIONS.annotations,
      })
      .addRadio({
        path: 'annotationsType',
        name: t('panelOptions.annotations.annotationsType.label'),
        settings: {
          options: ANNOTATIONS_TYPE_OPTIONS(t),
        },
        category: [t('panelOptions.annotations.label')],
        defaultValue: DEFAULT_OPTIONS.annotationsType,
      })
      .addSliderInput({
        path: 'annotationsLimit',
        name: t('panelOptions.annotations.annotationsLimit.label'),
        defaultValue: DEFAULT_OPTIONS.annotationsLimit,
        settings: {
          min: 100,
          max: 2000,
        },
        category: [t('panelOptions.annotations.label')],
      });
  });
