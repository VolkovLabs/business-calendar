import { PanelModel } from '@grafana/data';

import { CalendarOptions, LegacyCalendarOptions } from './types';

/**
 * Outdated Panel Options
 */
interface OutdatedPanelOptions extends LegacyCalendarOptions {}

/**
 * Get Migrated Options
 * @param panel
 */
export const getMigratedOptions = (panel: PanelModel<OutdatedPanelOptions>): CalendarOptions => {
  const { ...options } = panel.options;

  /**
   * Remove Legacy option autoScroll
   */
  if (options.hasOwnProperty('autoScroll')) {
    delete options.autoScroll;
  }

  /**
   * Remove Legacy option displayTime
   */
  if (options.hasOwnProperty('displayTime')) {
    delete options.displayTime;
  }

  /**
   * Remove Legacy option calendarType
   */
  if (options.hasOwnProperty('calendarType')) {
    delete options.calendarType;
  }

  return options as CalendarOptions;
};
