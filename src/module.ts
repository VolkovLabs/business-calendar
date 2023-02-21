import { Field, FieldType, PanelPlugin } from '@grafana/data';
import { CalendarPanel, MultiFieldEditor } from './components';
import { AnnotationsOptions, DefaultOptions, LinksOptions, ScrollOptions } from './constants';
import { CalendarOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<CalendarOptions>(CalendarPanel).useFieldConfig().setPanelOptions((builder) => {
  builder
    .addRadio({
      path: 'autoScroll',
      name: 'Scroll to bottom',
      description: 'Automatically scroll to the end of the time interval.',
      settings: {
        options: ScrollOptions,
      },
      defaultValue: DefaultOptions.autoScroll,
    })
    .addRadio({
      path: 'quickLinks',
      name: 'Links',
      description: 'Open data link instead of sidebar when clicking an event.',
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
      description: 'Field to use for the event end time. Defaults to the first time field.',
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
