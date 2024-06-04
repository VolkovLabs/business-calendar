import { VariableType } from 'types';

import { getVariableValue } from './variables';

describe('getVariableValue', () => {
  it('should return the value for TEXTBOX type', () => {
    const variable = {
      type: VariableType.TEXTBOX,
      current: {
        value: 'Textbox value',
      },
    } as any;

    const result = getVariableValue(variable);
    expect(result).toBe('Textbox value');
  });

  it('should return the value for TEXTBOX type from array', () => {
    const variable = {
      type: VariableType.TEXTBOX,
      current: {
        value: ['Textbox value', 'Texbox value 2'],
      },
    } as any;

    const result = getVariableValue(variable);
    expect(result).toBe('Textbox value');
  });

  it('should return the value for CONSTANT type', () => {
    const variable = {
      type: VariableType.CONSTANT,
      current: {
        value: 'Constant value',
      },
    } as any;

    const result = getVariableValue(variable);
    expect(result).toBe('Constant value');
  });

  it('should return the value for CUSTOM without includeAll', () => {
    const variable = {
      type: VariableType.CUSTOM,
      includeAll: false,
      current: {
        value: ['Value 1', 'Value 2', 'Value 3'],
      },
    } as any;

    const result = getVariableValue(variable);
    expect(result).toBe('Value 1');
  });

  it('should return the value QUERY types with includeAll', () => {
    const variable = {
      type: VariableType.CUSTOM,
      includeAll: true,
      current: {
        value: ['All', 'Value 2', 'Value 3'],
      },
    } as any;

    const result = getVariableValue(variable);
    expect(result).toBe('Value 2');
  });

  it('should return the value when value is not an array', () => {
    const variable = {
      type: VariableType.QUERY,
      current: {
        value: 'Single value',
      },
    } as any;

    const result = getVariableValue(variable);
    expect(result).toBe('Single value');
  });
});
