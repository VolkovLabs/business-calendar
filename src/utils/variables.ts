import { RuntimeVariable, VariableType } from 'types';

/**
 * Get Variable Value
 * @param variable
 */
export const getVariableValue = (variable: RuntimeVariable) => {
  if (variable.type === VariableType.TEXTBOX || variable.type === VariableType.CONSTANT) {
    return Array.isArray(variable.current.value) ? variable.current.value[0] : variable.current.value;
  } else {
    return Array.isArray(variable.current.value)
      ? variable.current.value[variable.includeAll ? 1 : 0]
      : variable.current.value;
  }
};
