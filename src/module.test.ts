import { Field, FieldType, PanelPlugin } from '@grafana/data';
import { CalendarOptions, ColorMode, TimeRangeType } from 'types';

import { plugin } from './module';

/**
 * Test Field
 */
type TestField = Pick<Field, 'name' | 'type'>;

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getTemplateSrv: jest.fn(() => ({
    getVariables: jest.fn(() => []),
  })),
}));

/*
 Plugin
 */
describe('plugin', () => {
  /**
   * Builder
   */
  const builder: any = {
    addCustomEditor: jest.fn().mockImplementation(() => builder),
    addRadio: jest.fn().mockImplementation(() => builder),
    addFieldNamePicker: jest.fn().mockImplementation(() => builder),
    addSliderInput: jest.fn().mockImplementation(() => builder),
    addSelect: jest.fn().mockImplementation(() => builder),
    addMultiSelect: jest.fn().mockImplementation(() => builder),
    addTextInput: jest.fn().mockImplementation(() => builder),
    addNumberInput: jest.fn().mockImplementation(() => builder),
  };

  /**
   * Context
   */
  const context = {};

  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add inputs', () => {
    /**
     * Supplier
     */
    plugin['optionsSupplier'](builder, context);

    /**
     * Inputs
     */
    expect(builder.addCustomEditor).toHaveBeenCalled();
    expect(builder.addRadio).toHaveBeenCalled();
    expect(builder.addFieldNamePicker).toHaveBeenCalled();
    expect(builder.addSliderInput).toHaveBeenCalled();
    expect(builder.addTextInput).toHaveBeenCalled();
    expect(builder.addNumberInput).toHaveBeenCalled();
  });

  describe('Settings', () => {
    const addFieldNameImplementation =
      (optionPath: string, allFields: TestField[], shownFields: TestField[]) => (input: any) => {
        if (optionPath === input.path) {
          const fields = allFields.filter(input.settings.filter);
          shownFields.push(...fields);
        }
        return builder;
      };

    /**
     * Add Input Implementation
     * @param config
     * @param result
     */
    const addInputImplementation = (config: Partial<CalendarOptions>, result: string[]) => (input: any) => {
      if (input.showIf) {
        if (input.showIf(config)) {
          result.push(input.path);
        }
      } else {
        result.push(input.path);
      }
      return builder;
    };

    it('Should show displayFields if quickLinks specified', () => {
      const shownOptionsPaths: string[] = [];

      builder.addMultiSelect.mockImplementation(addInputImplementation({ quickLinks: false }, shownOptionsPaths));
      plugin['optionsSupplier'](builder, context);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['views', 'displayFields']));
    });

    it('Should show locationLabel if quickLinks specified', () => {
      const shownOptionsPaths: string[] = [];

      builder.addTextInput.mockImplementation(addInputImplementation({ quickLinks: false }, shownOptionsPaths));
      plugin['optionsSupplier'](builder, context);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['locationLabel']));
    });

    it('Should return only string fields for textField', () => {
      const fields: TestField[] = [
        { name: 'string', type: FieldType.string },
        { name: 'number', type: FieldType.number },
      ];
      const shownFields: TestField[] = [];

      builder.addFieldNamePicker.mockImplementation(addFieldNameImplementation('textField', fields, shownFields));

      plugin['optionsSupplier'](builder, context);

      expect(shownFields).toEqual([{ name: 'string', type: FieldType.string }]);
    });

    it('Should return correct fields for timeField', () => {
      const fields: TestField[] = [
        { name: 'string', type: FieldType.string },
        { name: 'number', type: FieldType.number },
        { name: 'time', type: FieldType.time },
        { name: 'frame', type: FieldType.frame },
      ];
      const shownFields: TestField[] = [];

      builder.addFieldNamePicker.mockImplementation(addFieldNameImplementation('timeField', fields, shownFields));

      plugin['optionsSupplier'](builder, context);

      expect(shownFields).toEqual([fields[0], fields[1], fields[2]]);
    });

    it('Should return correct fields for endTimeField', () => {
      const fields: TestField[] = [
        { name: 'string', type: FieldType.string },
        { name: 'number', type: FieldType.number },
        { name: 'time', type: FieldType.time },
        { name: 'frame', type: FieldType.frame },
      ];
      const shownFields: TestField[] = [];

      builder.addFieldNamePicker.mockImplementation(addFieldNameImplementation('endTimeField', fields, shownFields));

      plugin['optionsSupplier'](builder, context);

      expect(shownFields).toEqual([fields[0], fields[1], fields[2]]);
    });

    it('Should return correct fields for colorField', () => {
      const fields: TestField[] = [
        { name: 'string', type: FieldType.string },
        { name: 'number', type: FieldType.number },
        { name: 'time', type: FieldType.time },
        { name: 'frame', type: FieldType.frame },
      ];
      const shownFields: TestField[] = [];

      builder.addFieldNamePicker.mockImplementation(addFieldNameImplementation('colorField', fields, shownFields));

      plugin['optionsSupplier'](builder, context);

      expect(shownFields).toEqual([fields[0], fields[1]]);
    });

    it('Should return correct fields for locationField', () => {
      const fields: TestField[] = [
        { name: 'string', type: FieldType.string },
        { name: 'number', type: FieldType.number },
        { name: 'time', type: FieldType.time },
        { name: 'frame', type: FieldType.frame },
      ];
      const shownFields: TestField[] = [];

      builder.addFieldNamePicker.mockImplementation(addFieldNameImplementation('locationField', fields, shownFields));

      plugin['optionsSupplier'](builder, context);

      expect(shownFields).toEqual([fields[0]]);
    });

    it('Should show endTimeVariable and startTimeVariable if timeRangeType is `variable` ', () => {
      const shownOptionsPaths: string[] = [];

      builder.addSelect.mockImplementation(
        addInputImplementation({ timeRangeType: TimeRangeType.VARIABLE }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder, context);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['startTimeVariable', 'endTimeVariable', 'dateFormat']));
    });

    it('Should show endTimeRange and startTimeRange if timeRangeType is `manual` ', () => {
      const shownOptionsPaths: string[] = [];

      builder.addCustomEditor.mockImplementation(
        addInputImplementation({ timeRangeType: TimeRangeType.MANUAL }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder, context);

      expect(shownOptionsPaths).toEqual(
        expect.arrayContaining([
          'startTimeRange',
          'endTimeRange',
          'defaultView',
          'scrollToTime',
          'labelFields',
          'descriptionField',
        ])
      );
    });

    it('Should show colorField if thresholds is selected', () => {
      const shownOptionsPaths: string[] = [];

      builder.addFieldNamePicker.mockImplementation(
        addInputImplementation({ colors: ColorMode.THRESHOLDS }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder, context);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['colorField']));
    });

    it('Should show preformattedDescription if quickLinks is false', () => {
      const shownOptionsPaths: string[] = [];

      builder.addRadio.mockImplementation(addInputImplementation({ quickLinks: false }, shownOptionsPaths));
      plugin['optionsSupplier'](builder, context);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['preformattedDescription']));
    });
  });
});
