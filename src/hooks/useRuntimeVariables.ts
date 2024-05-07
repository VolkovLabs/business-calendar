import { EventBus, TypedVariableModel } from '@grafana/data';
import { getTemplateSrv, RefreshEvent } from '@grafana/runtime';
import { useCallback, useEffect, useState } from 'react';
import { RuntimeVariable, VariableType } from 'types';

/**
 * Runtime Variables
 * @param eventBus
 * @param variableName
 */
export const useRuntimeVariables = (eventBus: EventBus, variableName: string) => {
  const [variables, setVariables] = useState<TypedVariableModel[]>([]);

  const [variable, setVariable] = useState<RuntimeVariable>();

  useEffect(() => {
    setVariables(getTemplateSrv().getVariables());

    /**
     * Update variable on Refresh
     */
    const subscriber = eventBus.getStream(RefreshEvent).subscribe(() => {
      setVariables(getTemplateSrv().getVariables());
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [eventBus]);

  const getVariable = useCallback(
    (variableName: string) => {
      const variable = variables.find((variable) => variable.name === variableName);
      if (
        variable &&
        (variable.type === VariableType.CONSTANT ||
          variable.type === VariableType.CUSTOM ||
          variable.type === VariableType.QUERY ||
          variable.type === VariableType.TEXTBOX)
      ) {
        return variable;
      }
      return undefined;
    },
    [variables]
  );

  useEffect(() => {
    setVariable(getVariable(variableName));
  }, [getVariable, variableName]);

  return {
    variable,
    getVariable,
  };
};
