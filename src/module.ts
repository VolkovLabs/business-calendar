import './i18n';

import { Field, FieldConfigProperty, FieldType, PanelPlugin } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { changeLanguage, t } from 'i18next';

import { CalendarPanel, DateEditor, DefaultViewEditor, MultiFieldEditor, TimeEditor } from './components';
import {
  ANNOTATIONS_OPTIONS,
  ANNOTATIONS_TYPE_OPTIONS,
  CALENDAR_VIEW_OPTIONS,
  COLOR_OPTIONS,
  DATE_FORMAT_OPTIONS,
  DEFAULT_OPTIONS,
  DEFAULT_SCROLL_TO_TIME,
  DEFAULT_VIEW,
  DEFAULT_VIEWS,
  DISPLAY_FIELD_OPTIONS,
  LINK_OPTIONS,
  PREFORMATTED_OPTIONS,
  TIME_RANGE_TYPE_OPTIONS,
} from './constants';
import { getMigratedOptions } from './migration';
import { CalendarOptions, TimeRangeType } from './types';
import { getLanguage } from './utils';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<CalendarOptions>(CalendarPanel)
  .setNoPadding()
  .setMigrationHandler(getMigratedOptions)
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
  .setPanelOptions((builder, context) => {
    /**
     * Set i18n language
     */
    changeLanguage(getLanguage(context.options?.dateFormat));

    /**
     * Variables
     */
    const variables = getTemplateSrv().getVariables();
    const variableOptions = variables.map((vr) => ({
      label: vr.name,
      value: vr.name,
    }));

    /**
     * Visibility
     */
    builder.addCustomEditor({
      id: 'scrollToTime',
      path: 'scrollToTime',
      name: t('panelOptions.scrollToTime.label'),
      description: t('panelOptions.scrollToTime.description'),
      editor: TimeEditor,
      defaultValue: DEFAULT_SCROLL_TO_TIME,
    });

    /**
     * Layout
     */
    builder
      .addRadio({
        path: 'timeRangeType',
        name: t('panelOptions.timeRangeType.label'),
        description: t('panelOptions.timeRangeType.description'),
        settings: {
          options: TIME_RANGE_TYPE_OPTIONS(t),
        },
        defaultValue: DEFAULT_OPTIONS.timeRangeType,
      })
      .addSelect({
        path: 'startTimeVariable',
        name: t('panelOptions.startTimeVariable.label'),
        description: t('panelOptions.startTimeVariable.description'),
        settings: {
          options: variableOptions,
          isClearable: true,
        },
        showIf: (config) => config.timeRangeType === TimeRangeType.VARIABLE,
      })
      .addSelect({
        path: 'endTimeVariable',
        name: t('panelOptions.endTimeVariable.label'),
        description: t('panelOptions.endTimeVariable.description'),
        settings: {
          options: variableOptions,
          isClearable: true,
        },
        showIf: (config) => config.timeRangeType === TimeRangeType.VARIABLE,
      })
      .addCustomEditor({
        id: 'startTimeRange',
        path: 'startTimeRange',
        name: t('panelOptions.startTimeRange.label'),
        description: t('panelOptions.startTimeRange.description'),
        editor: DateEditor,
        showIf: (config) => config.timeRangeType === TimeRangeType.MANUAL,
      })
      .addCustomEditor({
        id: 'endTimeRange',
        path: 'endTimeRange',
        name: t('panelOptions.endTimeRange.label'),
        description: t('panelOptions.endTimeRange.description'),
        editor: DateEditor,
        showIf: (config) => config.timeRangeType === TimeRangeType.MANUAL,
      })
      .addMultiSelect({
        path: 'views',
        name: t('panelOptions.layout.views.label'),
        category: [t('panelOptions.layout.label')],
        settings: {
          options: CALENDAR_VIEW_OPTIONS(t),
        },
        defaultValue: DEFAULT_VIEWS as unknown,
      })
      .addCustomEditor({
        id: 'defaultViewEditor',
        path: 'defaultView',
        name: t('panelOptions.layout.defaultView.label'),
        category: [t('panelOptions.layout.label')],
        editor: DefaultViewEditor,
        defaultValue: DEFAULT_VIEW,
      })
      .addSelect({
        path: 'dateFormat',
        name: t('panelOptions.layout.dateFormat.label'),
        category: [t('panelOptions.layout.label')],
        settings: {
          options: DATE_FORMAT_OPTIONS(t),
        },
        defaultValue: DEFAULT_OPTIONS.dateFormat,
      })
      .addRadio({
        path: 'colors',
        name: t('panelOptions.layout.colors.label'),
        description: t('panelOptions.layout.colors.description'),
        category: [t('panelOptions.layout.label')],
        settings: {
          options: COLOR_OPTIONS(t),
        },
        defaultValue: DEFAULT_OPTIONS.colors,
      });

    /**
     * Events
     */
    builder
      .addRadio({
        path: 'quickLinks',
        name: t('panelOptions.events.quickLinks.label'),
        description: t('panelOptions.events.quickLinks.description'),
        category: [t('panelOptions.events.label')],
        settings: {
          options: LINK_OPTIONS(t),
        },
        defaultValue: DEFAULT_OPTIONS.quickLinks,
      })
      .addMultiSelect({
        path: 'displayFields',
        name: t('panelOptions.events.displayFields.label'),
        description: t('panelOptions.events.displayFields.description'),
        category: [t('panelOptions.events.label')],
        showIf: (config) => !config.quickLinks,
        settings: {
          options: DISPLAY_FIELD_OPTIONS(t),
        },
        defaultValue: DEFAULT_OPTIONS.displayFields as unknown,
      })
      .addRadio({
        path: 'preformattedDescription',
        name: t('panelOptions.events.preformattedDescription.label'),
        description: t('panelOptions.events.preformattedDescription.description'),
        category: [t('panelOptions.events.label')],
        settings: {
          options: PREFORMATTED_OPTIONS(t),
        },
        showIf: (config) => !config.quickLinks,
        defaultValue: DEFAULT_OPTIONS.quickLinks,
      })
      .addTextInput({
        path: 'locationLabel',
        name: t('panelOptions.events.locationLabel.label'),
        description: t('panelOptions.events.locationLabel.description'),
        category: [t('panelOptions.events.label')],
        showIf: (config) => !config.quickLinks,
        defaultValue: DEFAULT_OPTIONS.locationLabel,
        settings: {
          placeholder: t('panelOptions.events.locationLabel.placeholder'),
        },
      });

    /**
     * Data
     */
    builder
      .addFieldNamePicker({
        path: 'textField',
        name: t('panelOptions.data.textField.label'),
        description: t('panelOptions.data.textField.description'),
        category: [t('panelOptions.data.label')],
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: t('panelOptions.data.textField.noFieldsMessage'),
        },
      })
      .addFieldNamePicker({
        path: 'descriptionField',
        name: t('panelOptions.data.descriptionField.label'),
        description: t('panelOptions.data.descriptionField.description'),
        category: [t('panelOptions.data.label')],
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: t('panelOptions.data.descriptionField.noFieldsMessage'),
        },
      })
      .addFieldNamePicker({
        path: 'locationField',
        name: t('panelOptions.data.locationField.label'),
        description: t('panelOptions.data.locationField.description'),
        category: [t('panelOptions.data.label')],
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: t('panelOptions.data.locationField.noFieldsMessage'),
        },
      })
      .addFieldNamePicker({
        path: 'timeField',
        name: t('panelOptions.data.timeField.label'),
        description: t('panelOptions.data.timeField.description'),
        category: [t('panelOptions.data.label')],
        settings: {
          filter: (f: Field) => [FieldType.time, FieldType.string, FieldType.number].includes(f.type),
        },
      })
      .addFieldNamePicker({
        path: 'endTimeField',
        name: t('panelOptions.data.endTimeField.label'),
        description: t('panelOptions.data.endTimeField.description'),
        category: [t('panelOptions.data.label')],
        settings: {
          filter: (f: Field) => [FieldType.time, FieldType.string, FieldType.number].includes(f.type),
        },
      })
      .addCustomEditor({
        id: 'labelFields',
        path: 'labelFields',
        name: t('panelOptions.data.labelFields.label'),
        description: t('panelOptions.data.labelFields.description'),
        editor: MultiFieldEditor,
        category: [t('panelOptions.data.label')],
        settings: {
          filterByType: [FieldType.string],
        },
      })
      .addFieldNamePicker({
        path: 'colorField',
        name: t('panelOptions.data.colorField.label'),
        description: t('panelOptions.data.colorField.description'),
        category: [t('panelOptions.data.label')],
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
  })
  .setDataSupport({ annotations: true });
