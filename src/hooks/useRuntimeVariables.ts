import { EventBus } from '@grafana/data';
import { useDashboardVariables } from '@volkovlabs/components';
import { RuntimeVariable } from 'types';

import { getVariablesMap } from '../utils';

/**
 * Runtime Variables
 * @param eventBus
 * @param variableName
 */
export const useRuntimeVariables = (eventBus: EventBus, variableName: string) => {
  const { variable, getVariable } = useDashboardVariables<RuntimeVariable, Record<string, RuntimeVariable>>({
    eventBus,
    variableName,
    toState: getVariablesMap,
    getOne: (variablesMap, variableName) => variablesMap[variableName],
    initial: {},
  });

  return {
    variable,
    getVariable,
  };
};
