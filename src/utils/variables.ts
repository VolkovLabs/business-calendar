import { TypedVariableModel } from '@grafana/data';
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

/**
 * Get Runtime Variable
 * @param variable
 */
export const getRuntimeVariable = (variable: TypedVariableModel): RuntimeVariable | undefined => {
  if (
    variable.type === VariableType.CONSTANT ||
    variable.type === VariableType.CUSTOM ||
    variable.type === VariableType.QUERY ||
    variable.type === VariableType.TEXTBOX
  ) {
    return variable;
  }
  return undefined;
};

/**
 * Get Variables Map
 */
export const getVariablesMap = (variables: TypedVariableModel[]): Record<string, RuntimeVariable> => {
  return variables.reduce((acc, variable) => {
    const runtimeVariable = getRuntimeVariable(variable);

    if (runtimeVariable) {
      return {
        ...acc,
        [runtimeVariable.name]: runtimeVariable,
      };
    }
    return acc;
  }, {});
};
