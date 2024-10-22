import { CustomVariableModel, EventBusSrv, LoadingState, TypedVariableModel, VariableHide } from '@grafana/data';
import { renderHook } from '@testing-library/react';

import { VariableType } from '../types';
import { useRuntimeVariables } from './useRuntimeVariables';

/**
 * Mock @grafana/runtime
 */
const getVariablesMock = jest.fn((): TypedVariableModel[] => []);

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getTemplateSrv: jest.fn(() => ({
    getVariables: getVariablesMock,
  })),
}));

describe('useRuntimeVariables', () => {
  /**
   * Event Bus
   */
  const eventBus = new EventBusSrv();

  /**
   * Create Variable
   */
  const createVariable = (item: Partial<CustomVariableModel>): CustomVariableModel => ({
    type: VariableType.CUSTOM,
    name: '',
    options: [],
    id: '',
    multi: false,
    includeAll: false,
    current: {},
    query: '',
    rootStateKey: '',
    global: false,
    hide: VariableHide.dontHide,
    description: '',
    allValue: null,
    skipUrlSync: false,
    index: 0,
    state: LoadingState.Done,
    error: '',
    ...item,
  });

  it('Should return variables', () => {
    getVariablesMock.mockReturnValue([createVariable({ name: 'device' })]);

    const { result } = renderHook(() => useRuntimeVariables(eventBus, 'device'));

    expect(result.current.getVariable('device')).toEqual(
      expect.objectContaining({
        name: 'device',
      })
    );
  });
});
