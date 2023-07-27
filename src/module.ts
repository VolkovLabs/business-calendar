import { Field, FieldConfigProperty, FieldType, PanelPlugin } from '@grafana/data';
import { CalendarPanel, MultiFieldEditor } from './components';
import {
  AnnotationsOptions,
  CalendarTypeOptions,
  ColorsOptions,
  DefaultOptions,
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

    builder
      .addRadio({
        path: 'calendarType',
        name: 'Calendar Type',
        settings: {
          options: CalendarTypeOptions,
        },
        defaultValue: CalendarType.LEGACY,
      })
      .addRadio({
        path: 'autoScroll',
        name: 'Scroll to bottom',
        description: 'Automatically scroll to the end of the time interval.',
        settings: {
          options: ScrollOptions,
        },
        defaultValue: DefaultOptions.autoScroll,
        showIf: showForLegacy,
      })
      .addRadio({
        path: 'displayTime',
        name: 'Display Time',
        description: 'Display Time for each entry.',
        settings: {
          options: DisplayTimeOptions,
        },
        defaultValue: DefaultOptions.annotations,
        showIf: showForLegacy,
      })
      .addRadio({
        path: 'quickLinks',
        name: 'On Click',
        description: 'Open data link or display drawer when clicking an event.',
        settings: {
          options: LinksOptions,
        },
        defaultValue: DefaultOptions.quickLinks,
      })
      .addRadio({
        path: 'annotations',
        name: 'Annotations',
        description: 'Display annotations.',
        settings: {
          options: AnnotationsOptions,
        },
        defaultValue: DefaultOptions.annotations,
      })
      .addRadio({
        path: 'colors',
        name: 'Colors',
        description: 'Display colors based on Frame or Event id if Color field is not specified.',
        settings: {
          options: ColorsOptions,
        },
        defaultValue: DefaultOptions.colors,
      });

    /**
     * Events
     */
    builder
      .addFieldNamePicker({
        path: 'textField',
        name: 'Text',
        description: 'Field to use for the event text. Defaults to the first textual field.',
        category: ['Events'],
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: 'No string fields found',
        },
      })
      .addFieldNamePicker({
        path: 'descriptionField',
        name: 'Description',
        description: 'Field to use for the event description.',
        category: ['Events'],
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: 'No string fields found',
        },
      })
      .addFieldNamePicker({
        path: 'timeField',
        name: 'Start time',
        description: 'Field to use for the event start time. Defaults to the first time field.',
        category: ['Events'],
        settings: {
          filter: (f: Field) => [FieldType.time, FieldType.string, FieldType.number].includes(f.type),
        },
      })
      .addFieldNamePicker({
        path: 'endTimeField',
        name: 'End time',
        description: 'Field to use for the event end time. If not set, event is instant.',
        category: ['Events'],
        settings: {
          filter: (f: Field) => [FieldType.time, FieldType.string, FieldType.number].includes(f.type),
        },
      })
      .addCustomEditor({
        id: 'labelFields',
        path: 'labelFields',
        name: 'Labels',
        description: 'Fields to use as event labels.',
        editor: MultiFieldEditor,
        category: ['Events'],
        settings: {
          filterByType: [FieldType.string],
        },
      })
      .addFieldNamePicker({
        path: 'colorField',
        name: 'Color',
        description: 'Field to use as event color.',
        category: ['Events'],
        settings: {
          filter: (f: Field) => [FieldType.string, FieldType.number].includes(f.type),
        },
      });
  });
