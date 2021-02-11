import { FieldType, PanelPlugin } from '@grafana/data';
import { CalendarOptions } from './types';
import { CalendarPanel } from './CalendarPanel';
import { FieldSelectEditor, getPanelPluginOrFallback } from 'grafana-plugin-support';

export const plugin = getPanelPluginOrFallback(
  'marcusolsson-calendar-panel',
  new PanelPlugin<CalendarOptions>(CalendarPanel).setNoPadding().setPanelOptions(builder => {
    return builder
      .addCustomEditor({
        id: 'timeField',
        path: 'timeField',
        name: 'Time',
        description: 'Field to use for the time. Defaults to the first time field.',
        editor: FieldSelectEditor,
        category: ['Dimensions'],
        settings: {
          filterByType: [FieldType.time],
        },
      })
      .addCustomEditor({
        id: 'textField',
        path: 'textField',
        name: 'Text',
        description: 'Field to use for the text. Defaults to the first textual field.',
        editor: FieldSelectEditor,
        category: ['Dimensions'],
        settings: {
          filterByType: [FieldType.string],
        },
      });
  })
);
