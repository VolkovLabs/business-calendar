import { getMigratedOptions } from './migration';

describe('Migration', () => {
  it('Remove autoScroll option', () => {
    const panel = {
      options: {
        autoScroll: true,
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).not.toHaveProperty('autoScroll');
  });

  it('Remove displayTime option', () => {
    const panel = {
      options: {
        displayTime: true,
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).not.toHaveProperty('displayTime');
  });

  it('Remove calendarType option', () => {
    const panel = {
      options: {
        calendarType: 'legacy',
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).not.toHaveProperty('calendarType');
  });

  it('Should keep valid options', () => {
    const panel = {
      options: {
        someOption: 'value',
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).toEqual(panel.options);
  });

  it('Should return descriptionField as array', () => {
    const panel = {
      options: {
        someOption: 'value',
        descriptionField: 'description',
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions.descriptionField).toEqual(['description']);
  });

  it('Should not return descriptionField as array if not specified', () => {
    const panel = {
      options: {
        someOption: 'value',
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).not.toHaveProperty('descriptionField');
  });
});
