import { Field, FieldType, PanelPlugin } from '@grafana/data';
import { CalendarOptions, TimeRangeType } from 'types';

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
  };

  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add inputs', () => {
    /**
     * Supplier
     */
    plugin['optionsSupplier'](builder);

    /**
     * Inputs
     */
    expect(builder.addCustomEditor).toHaveBeenCalled();
    expect(builder.addRadio).toHaveBeenCalled();
    expect(builder.addFieldNamePicker).toHaveBeenCalled();
    expect(builder.addSliderInput).toHaveBeenCalled();
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

    it('Should return only string fields for textField', () => {
      const fields: TestField[] = [
        { name: 'string', type: FieldType.string },
        { name: 'number', type: FieldType.number },
      ];
      const shownFields: TestField[] = [];

      builder.addFieldNamePicker.mockImplementation(addFieldNameImplementation('textField', fields, shownFields));

      plugin['optionsSupplier'](builder);

      expect(shownFields).toEqual([{ name: 'string', type: FieldType.string }]);
    });

    it('Should return only string fields for descriptionField', () => {
      const fields: TestField[] = [
        { name: 'string', type: FieldType.string },
        { name: 'number', type: FieldType.number },
      ];
      const shownFields: TestField[] = [];

      builder.addFieldNamePicker.mockImplementation(
        addFieldNameImplementation('descriptionField', fields, shownFields)
      );

      plugin['optionsSupplier'](builder);

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

      plugin['optionsSupplier'](builder);

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

      plugin['optionsSupplier'](builder);

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

      plugin['optionsSupplier'](builder);

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

      plugin['optionsSupplier'](builder);

      expect(shownFields).toEqual([fields[0]]);
    });

    it('Should show endTimeVariable and startTimeVariable if timeRangeType is `variable` ', () => {
      const shownOptionsPaths: string[] = [];

      builder.addSelect.mockImplementation(
        addInputImplementation({ timeRangeType: TimeRangeType.VARIABLE }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['startTimeVariable', 'endTimeVariable', 'dateFormat']));
    });

    it('Should show endTimeRange and startTimeRange if timeRangeType is `manual` ', () => {
      const shownOptionsPaths: string[] = [];

      builder.addCustomEditor.mockImplementation(
        addInputImplementation({ timeRangeType: TimeRangeType.MANUAL }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(
        expect.arrayContaining(['startTimeRange', 'endTimeRange', 'defaultView', 'scrollToTime', 'labelFields'])
      );
    });
  });
});
