import { selectors } from '@grafana/e2e-selectors';

/**
 * Tests Identifiers
 */
export const TestIds = {
  calendarEntry: {
    filler: 'data-testid calendar-entry filler',
    eventOneDay: 'data-testid calendar-entry event-one-day',
    eventOneDayWithTime: 'data-testid calendar-entry event-one-day-with-time',
    eventOneDayWithoutTime: 'data-testid calendar-entry event-one-day-without-time',
    eventFewDays: 'data-testid calendar-entry event-few-days',
    eventFewDaysWithTime: 'data-testid calendar-entry event-few-days-with-time',
    eventFewDaysWithoutTime: 'data-testid calendar-entry event-few-days-without-time',
    eventFewDaysNotStartedToday: 'data-testid calendar-entry event-few-days-not-started-today',
  },
  panel: {
    root: 'data-testid calendar-panel',
    buttonApplyInterval: 'data-testid calendar-panel button-apply-interval',
  },
  day: {
    root: 'data-testid day',
    dayDate: 'data-testid day date',
    buttonShowMore: 'data-testid day button-show-more',
  },
  dayDrawer: {
    /**
     * Default Drawer selector
     * https://github.com/grafana/grafana/blob/186cd96447fdd3a9ae26907a48023998c825c6d6/packages/grafana-ui/src/components/Drawer/Drawer.tsx#L106
     */
    root: selectors.components.Drawer.General.title,
  },
  bigCalendar: {
    root: 'data-testid lib-calendar',
    /**
     * Default Drawer selector
     * https://github.com/grafana/grafana/blob/186cd96447fdd3a9ae26907a48023998c825c6d6/packages/grafana-ui/src/components/Drawer/Drawer.tsx#L106
     */
    drawerClose: selectors.components.Drawer.General.close,
  },
  bigCalendarToolbar: {
    buttonToday: 'data-testid big-calendar-toolbar button-today',
    buttonBack: 'data-testid big-calendar-toolbar button-back',
    buttonNext: 'data-testid big-calendar-toolbar button-next',
    buttonView: (view: string) => `data-testid big-calendar-toolbar button-${view}`,
  },
  eventDetails: {
    root: 'data-testid event-details',
    titleButton: 'event-details title-button',
    titleText: 'data-testid event-details title-text',
    link: 'event-details link',
  },
  multiFieldEditor: {
    select: 'multi-field-editor select',
    multiSelect: 'multi-field-editor multi-select',
  },
};
