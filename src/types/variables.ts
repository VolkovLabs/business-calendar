import { ConstantVariableModel, CustomVariableModel, QueryVariableModel, TextBoxVariableModel } from '@grafana/data';

/**
 * Dashboard variable type
 * `query`: Query-generated list of values such as metric names, server names, sensor IDs, data centers, and so on.
 * `constant`: 	Define a hidden constant.
 * `textbox`: Display a free text input field with an optional default value.
 * `custom`: Define the variable options manually using a comma-separated list.
 */
export enum VariableType {
  CONSTANT = 'constant',
  CUSTOM = 'custom',
  TEXTBOX = 'textbox',
  QUERY = 'query',
}

export type RuntimeVariable = CustomVariableModel | QueryVariableModel | TextBoxVariableModel | ConstantVariableModel;
