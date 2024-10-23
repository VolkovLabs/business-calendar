import { PanelModel } from '@grafana/data';

import { CalendarOptions, ColorMode } from './types';

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
  const { overrides, defaults } = panel.fieldConfig;

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

  /**
   * Overrides color scheme
   */
  if (
    options.colors === ColorMode.FRAME &&
    options.colorField &&
    (!!overrides.length || (defaults.thresholds && defaults.thresholds.steps?.length > 1))
  ) {
    options.colors = ColorMode.THRESHOLDS;
  }
  return options as CalendarOptions;
};
