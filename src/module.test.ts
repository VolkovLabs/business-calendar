import { Field, FieldType, PanelPlugin } from '@grafana/data';
import { plugin } from './module';

/**
 * Test Field
 */
type TestField = Pick<Field, 'name' | 'type'>;

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
  });
});
