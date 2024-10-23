import { ColorMode } from 'types';

import { getMigratedOptions } from './migration';

describe('Migration', () => {
  it('Remove autoScroll option', () => {
    const panel = {
      options: {
        autoScroll: true,
      },
      fieldConfig: {
        defaults: {},
        overrides: [],
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
      fieldConfig: {
        defaults: {},
        overrides: [],
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
      fieldConfig: {
        defaults: {},
        overrides: [],
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
      fieldConfig: {
        defaults: {},
        overrides: [],
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
      fieldConfig: {
        defaults: {},
        overrides: [],
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
      fieldConfig: {
        defaults: {},
        overrides: [],
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).not.toHaveProperty('descriptionField');
  });

  it('Should update colors options for manual overrides', () => {
    const panel = {
      options: {
        colors: ColorMode.FRAME,
        colorField: 'color',
      },
      fieldConfig: {
        defaults: {},
        overrides: [
          {
            matcher: {
              id: 'byName',
              options: 'color',
            },
            properties: [{}],
          },
        ],
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions.colors).toEqual(ColorMode.THRESHOLDS);
  });

  it('Should update colors options correctly', () => {
    const panel = {
      options: {
        colors: ColorMode.FRAME,
        colorField: 'color',
      },
      fieldConfig: {
        defaults: {
          thresholds: {
            steps: [{}, {}],
          },
        },
        overrides: [],
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions.colors).toEqual(ColorMode.THRESHOLDS);
  });

  it('Should not update colors options if set only base threshold value', () => {
    const panel = {
      options: {
        colors: ColorMode.FRAME,
        colorField: 'color',
      },
      fieldConfig: {
        defaults: {
          thresholds: {
            steps: [
              {
                color: '#b1b3b5',
                value: null,
              },
            ],
          },
        },
        overrides: [],
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions.colors).toEqual(ColorMode.FRAME);
  });

  it('Should not update colors options if set event scheme', () => {
    const panel = {
      options: {
        colors: ColorMode.EVENT,
        colorField: 'color',
      },
      fieldConfig: {
        defaults: {
          thresholds: {
            steps: [
              {
                color: '#b1b3b5',
                value: null,
              },
              {
                color: '#b1b3b5',
                value: null,
              },
            ],
          },
        },
        overrides: [],
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions.colors).toEqual(ColorMode.EVENT);
  });

  it('Should not update colors option if colorField not specified', () => {
    const panel = {
      options: {
        colors: ColorMode.FRAME,
        colorField: '',
      },
      fieldConfig: {
        defaults: {
          thresholds: {
            steps: [
              {
                color: '#b1b3b5',
                value: null,
              },
              {
                color: '#b1b3b5',
                value: null,
              },
            ],
          },
        },
        overrides: [],
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions.colors).toEqual(ColorMode.FRAME);
  });

  it('Should not update colors option if defaults and overrides not specified', () => {
    const panel = {
      options: {
        colors: ColorMode.FRAME,
        colorField: 'color',
      },
      fieldConfig: {
        defaults: {},
        overrides: [],
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions.colors).toEqual(ColorMode.FRAME);
  });
});
