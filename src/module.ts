import { FieldType, PanelPlugin } from '@grafana/data';
import { CalendarOptions } from './types';
import { CalendarPanel } from './CalendarPanel';
import { FieldSelectEditor, getPanelPluginOrFallback } from 'grafana-plugin-support';

export const plugin = getPanelPluginOrFallback(
  'marcusolsson-calendar-panel',
  new PanelPlugin<CalendarOptions>(CalendarPanel).setNoPadding().setPanelOptions((builder) => {
    return builder
      .addBooleanSwitch({
        path: 'autoScroll',
        name: 'Scroll to bottom',
        description: 'Automatically scroll to the end of the time interval.',
        defaultValue: false,
      })
      .addCustomEditor({
        id: 'textField',
        path: 'textField',
        name: 'Text',
        description: 'Field to use for the event text. Defaults to the first textual field.',
        editor: FieldSelectEditor,
        category: ['Dimensions'],
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
        category: ['Dimensions'],
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
        category: ['Dimensions'],
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
        category: ['Dimensions'],
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
        category: ['Dimensions'],
        settings: {
          filterByType: [FieldType.string],
          multi: true,
        },
      });
  })
);
