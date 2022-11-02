import { FieldSelectEditor, getPanelPluginOrFallback } from 'grafana-plugin-support';
import { FieldType, PanelPlugin } from '@grafana/data';
import { CalendarPanel } from './components/CalendarPanel/CalendarPanel';
import { CalendarOptions } from './types';

export const plugin = getPanelPluginOrFallback(
  'marcusolsson-calendar-panel',
  new PanelPlugin<CalendarOptions>(CalendarPanel)
    .setNoPadding()
    .useFieldConfig()
    .setPanelOptions((builder) => {
      return builder
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
