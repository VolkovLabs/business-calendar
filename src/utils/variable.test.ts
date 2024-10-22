import { VariableType } from 'types';

import { getVariablesMap, getVariableValue } from './variables';

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

describe('getVariablesMap', () => {
  it('Should return a map with valid runtime variables', () => {
    const variables = [
      { name: 'var1', type: VariableType.CONSTANT, value: 10 },
      { name: 'var2', type: VariableType.CUSTOM, value: 'customValue' },
      { name: 'var3', type: VariableType.QUERY, value: 'test' },
      { name: 'var4', type: VariableType.TEXTBOX, value: 'Some text' },
      { name: 'var5', type: 'system', value: 'Should not be included' },
      { name: 'var5', type: 'adhoc', value: 'Should not be included' },
    ] as any;

    const expectedMap = {
      var1: { name: 'var1', type: VariableType.CONSTANT, value: 10 },
      var2: { name: 'var2', type: VariableType.CUSTOM, value: 'customValue' },
      var3: { name: 'var3', type: VariableType.QUERY, value: 'test' },
      var4: { name: 'var4', type: VariableType.TEXTBOX, value: 'Some text' },
    };

    const result = getVariablesMap(variables);
    expect(result).toEqual(expectedMap);
  });

  it('Should return an empty map when no valid runtime variables are provided', () => {
    const variables = [{ name: 'var5', type: 'adhoc', value: 'Should not be included' }] as any;

    const result = getVariablesMap(variables);
    expect(result).toEqual({});
  });
});
