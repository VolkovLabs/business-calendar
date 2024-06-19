import { PanelModel } from '@grafana/data';

import { CalendarOptions } from './types';

/**
 * Outdated Panel Options
 */
interface OutdatedPanelOptions extends CalendarOptions {
  /**
   * Auto Scroll
   *
   * Removed in 3.0.0
   */
  autoScroll?: boolean;

  /**
   * Display Time
   *
   * Removed in 3.0.0
   */
  displayTime?: boolean;

  /**
   * Calendar Type
   *
   * Removed in 3.0.0
   */
  calendarType?: string;
}

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

  /**
   * Description fields transform to array
   */
  if (options.descriptionField && !Array.isArray(options.descriptionField)) {
    options.descriptionField = [options.descriptionField];
  }

  return options as CalendarOptions;
};
