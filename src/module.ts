import './i18n';
import { t } from 'i18next';
import { Field, FieldConfigProperty, FieldType, PanelPlugin } from '@grafana/data';
import { CalendarPanel, DefaultViewEditor, MultiFieldEditor, TimeEditor } from './components';
import {
  AnnotationsOptions,
  AnnotationsTypeOptions,
  CalendarTypeOptions,
  CalendarViewOptions,
  ColorsOptions,
  DateFormatOptions,
  DefaultOptions,
  DefaultScrollToTime,
  DefaultView,
  DefaultViews,
  DisplayTimeOptions,
  LinksOptions,
  ScrollOptions,
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
          options: CalendarTypeOptions(t),
        },
        defaultValue: CalendarType.LEGACY,
      })
      .addMultiSelect({
        path: 'views',
        name: t('panelOptions.views.label'),
        settings: {
          options: CalendarViewOptions(t),
        },
        defaultValue: DefaultViews as any,
        showIf: showForBigCalendar,
      })
      .addCustomEditor({
        id: 'defaultViewEditor',
        path: 'defaultView',
        name: t('panelOptions.defaultView.label'),
        editor: DefaultViewEditor,
        defaultValue: DefaultView,
        showIf: showForBigCalendar,
      })
      .addCustomEditor({
        id: 'scrollToTime',
        path: 'scrollToTime',
        name: t('panelOptions.scrollToTime.label'),
        description: t('panelOptions.scrollToTime.description'),
        editor: TimeEditor,
        defaultValue: DefaultScrollToTime,
        showIf: showForBigCalendar,
      })
      .addSelect({
        path: 'dateFormat',
        name: t('panelOptions.dateFormat.label'),
        settings: {
          options: DateFormatOptions(t),
        },
        defaultValue: DefaultOptions.dateFormat,
        showIf: showForBigCalendar,
      })
      .addRadio({
        path: 'autoScroll',
        name: t('panelOptions.autoScroll.label'),
        description: t('panelOptions.autoScroll.description'),
        settings: {
          options: ScrollOptions(t),
        },
        defaultValue: DefaultOptions.autoScroll,
        showIf: showForLegacy,
      })
      .addRadio({
        path: 'displayTime',
        name: t('panelOptions.displayTime.label'),
        description: t('panelOptions.displayTime.description'),
        settings: {
          options: DisplayTimeOptions(t),
        },
        defaultValue: DefaultOptions.annotations,
        showIf: showForLegacy,
      })
      .addRadio({
        path: 'quickLinks',
        name: t('panelOptions.quickLinks.label'),
        description: t('panelOptions.quickLinks.description'),
        settings: {
          options: LinksOptions(t),
        },
        defaultValue: DefaultOptions.quickLinks,
      })
      .addRadio({
        path: 'colors',
        name: t('panelOptions.colors.label'),
        description: t('panelOptions.quickLinks.description'),
        settings: {
          options: ColorsOptions(t),
        },
        defaultValue: DefaultOptions.colors,
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
          options: AnnotationsOptions(t),
        },
        category: [t('panelOptions.annotations.label')],
        defaultValue: DefaultOptions.annotations,
      })
      .addRadio({
        path: 'annotationsType',
        name: t('panelOptions.annotations.annotationsType.label'),
        settings: {
          options: AnnotationsTypeOptions(t),
        },
        category: [t('panelOptions.annotations.label')],
        defaultValue: DefaultOptions.annotationsType,
      })
      .addSliderInput({
        path: 'annotationsLimit',
        name: t('panelOptions.annotations.annotationsLimit.label'),
        defaultValue: DefaultOptions.annotationsLimit,
        settings: {
          min: 100,
          max: 2000,
        },
        category: [t('panelOptions.annotations.label')],
      });
  });
