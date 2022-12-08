import { FieldType, PanelPlugin } from '@grafana/data';
import { CalendarPanel, FieldSelectEditor } from './components';
import { CalendarOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<CalendarOptions>(CalendarPanel).useFieldConfig().setPanelOptions((builder) => {
  builder
    .addBooleanSwitch({
      path: 'autoScroll',
      name: 'Scroll to bottom',
      description: 'Automatically scroll to the end of the time interval.',
      defaultValue: false,
    })
    .addBooleanSwitch({
      path: 'quickLinks',
      name: 'Quick links',
      description: 'Open data link instead of sidebar when clicking an event.',
      defaultValue: false,
    });

  /**
   * Data
   */
  builder
    .addCustomEditor({
      id: 'textField',
      path: 'textField',
      name: 'Text',
      description: 'Field to use for the event text. Defaults to the first textual field.',
      editor: FieldSelectEditor,
      category: ['Data'],
      settings: {
        filterByType: [FieldType.string],
      },
    })
    .addCustomEditor({
      id: 'descriptionField',
      path: 'descriptionField',
      name: 'Description',
      description: 'Field to use for the event description.',
      editor: FieldSelectEditor,
      category: ['Data'],
      settings: {
        filterByType: [FieldType.string],
      },
    })
    .addCustomEditor({
      id: 'timeField',
      path: 'timeField',
      name: 'Start time',
      description: 'Field to use for the event start time. Defaults to the first time field.',
      editor: FieldSelectEditor,
      category: ['Data'],
      settings: {
        filterByType: [FieldType.time, FieldType.string, FieldType.number],
      },
    })
    .addCustomEditor({
      id: 'endTimeField',
      path: 'endTimeField',
      name: 'End time',
      description: 'Field to use for the event end time. Defaults to the first time field.',
      editor: FieldSelectEditor,
      category: ['Data'],
      settings: {
        filterByType: [FieldType.time, FieldType.string, FieldType.number],
      },
    })
    .addCustomEditor({
      id: 'labelFields',
      path: 'labelFields',
      name: 'Labels',
      description: 'Fields to use as event labels.',
      editor: FieldSelectEditor,
      category: ['Data'],
      settings: {
        filterByType: [FieldType.string],
        multi: true,
      },
    });
});
