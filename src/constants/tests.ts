import { selectors } from '@grafana/e2e-selectors';

/**
 * Tests Identifiers
 */
export const TestIds = {
  calendarEntry: {
    filler: 'data-testid calendar-entry filler',
    event: 'data-testid calendar-entry event',
  },
  panel: {
    root: 'data-testid calendar-panel',
  },
  day: {
    root: 'data-testid day',
  },
  dayDrawer: {
    /**
     * Default Drawer selector
     * https://github.com/grafana/grafana/blob/186cd96447fdd3a9ae26907a48023998c825c6d6/packages/grafana-ui/src/components/Drawer/Drawer.tsx#L106
     */
    root: selectors.components.Drawer.General.title,
  },
  multiFieldEditor: {
    select: 'multi-field-editor select',
    multiSelect: 'multi-field-editor multi-select',
  },
};
