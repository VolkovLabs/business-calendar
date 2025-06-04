import { CustomVariableModel, EventBusSrv, LoadingState, TypedVariableModel, VariableHide } from '@grafana/data';
import { renderHook } from '@testing-library/react';
import { useDashboardVariables } from '@volkovlabs/components';

import { VariableType } from '../types';
import { useRuntimeVariables } from './useRuntimeVariables';

const mockUseDashboardVariables = useDashboardVariables as jest.MockedFunction<typeof useDashboardVariables>;

/**
 * Mock variables data
 */
const mockVariables: TypedVariableModel[] = [];

/**
 * Mock getTemplateSrv
 */
const mockGetTemplateSrv = {
  getVariables: jest.fn(() => mockVariables),
};

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getTemplateSrv: jest.fn(() => mockGetTemplateSrv),
}));

/**
 * Mock @volkovlabs/components
 */
jest.mock('@volkovlabs/components', () => ({
  useDashboardVariables: jest.fn(),
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

  beforeEach(() => {
    jest.clearAllMocks();
    mockVariables.length = 0;
    mockUseDashboardVariables.mockClear();
  });

  it('Should return variables', () => {
    const deviceVariable = createVariable({ name: 'device' });
    const serverVariable = createVariable({ name: 'server' });

    /**
     * Mock the useDashboardVariables hook return value
     */
    mockUseDashboardVariables.mockReturnValue({
      variable: deviceVariable,
      getVariable: jest.fn((name: string) => {
        const variablesMap: Record<string, CustomVariableModel> = {
          device: deviceVariable,
          server: serverVariable,
        };
        return variablesMap[name];
      }),
    } as any);

    const { result } = renderHook(() => useRuntimeVariables(eventBus, 'device'));

    expect(result.current.variable).toEqual(deviceVariable);
    expect(result.current.getVariable('device')).toEqual(deviceVariable);
    expect(result.current.getVariable('server')).toEqual(serverVariable);
  });

  it('Should handle non-existent variable', () => {
    const deviceVariable = createVariable({ name: 'device' });

    mockUseDashboardVariables.mockReturnValue({
      variable: undefined,
      getVariable: jest.fn((name: string) => {
        const variablesMap: Record<string, CustomVariableModel> = {
          device: deviceVariable,
        };
        return variablesMap[name];
      }),
    } as any);

    const { result } = renderHook(() => useRuntimeVariables(eventBus, 'nonexistent'));

    expect(result.current.variable).toBeUndefined();
    expect(result.current.getVariable('nonexistent')).toBeUndefined();
    expect(result.current.getVariable('device')).toEqual(deviceVariable);
  });

  it('Should call useDashboardVariables with correct parameters', () => {
    const deviceVariable = createVariable({ name: 'device' });

    mockUseDashboardVariables.mockReturnValue({
      variable: deviceVariable,
      getVariable: jest.fn(),
    } as any);

    renderHook(() => useRuntimeVariables(eventBus, 'device'));

    expect(mockUseDashboardVariables).toHaveBeenCalledWith({
      eventBus,
      variableName: 'device',
      toState: expect.any(Function),
      getOne: expect.any(Function),
      initial: {},
    });
  });

  it('Should test getOne function retrieves variable correctly', () => {
    const deviceVariable = createVariable({ name: 'device' });
    const serverVariable = createVariable({ name: 'server' });

    mockUseDashboardVariables.mockReturnValue({
      variable: deviceVariable,
      getVariable: jest.fn(),
    } as any);

    renderHook(() => useRuntimeVariables(eventBus, 'device'));

    /**
     * Get the getOne function that was passed to useDashboardVariables
     */
    const call = mockUseDashboardVariables.mock.calls[0][0];
    const getOne = call.getOne;

    /**
     * Test the getOne function
     */
    const variablesMap: Record<string, CustomVariableModel> = {
      device: deviceVariable,
      server: serverVariable,
    };

    expect(getOne(variablesMap, 'device')).toEqual(deviceVariable);
    expect(getOne(variablesMap, 'server')).toEqual(serverVariable);
    expect(getOne(variablesMap, 'nonexistent')).toBeUndefined();
  });
});
