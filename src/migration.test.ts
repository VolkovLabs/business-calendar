import { getMigratedOptions } from './migration';
import { LegacyCalendarOptions } from './types';

describe('Migration', () => {
  it('Remove autoScroll option', () => {
    const panel = {
      options: {
        autoScroll: true,
      },
    } as any;

    const migratedOptions: LegacyCalendarOptions = getMigratedOptions(panel);

    expect(migratedOptions.autoScroll).toBeUndefined();
  });

  it('Remove displayTime option', () => {
    const panel = {
      options: {
        displayTime: true,
      },
    } as any;

    const migratedOptions: LegacyCalendarOptions = getMigratedOptions(panel);

    expect(migratedOptions.displayTime).toBeUndefined();
  });

  it('remove calendarType option', () => {
    const panel = {
      options: {
        calendarType: 'legacy',
      },
    } as any;

    const migratedOptions: LegacyCalendarOptions = getMigratedOptions(panel);

    expect(migratedOptions.calendarType).toBeUndefined();
  });

  it('does not remove any options', () => {
    const panel = {
      options: {
        someOption: 'value',
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).toEqual(panel.options);
  });
});
