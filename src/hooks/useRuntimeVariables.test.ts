import { getTemplateSrv } from '@grafana/runtime';
import { act, renderHook, waitFor } from '@testing-library/react';

import { VariableType } from '../types';
import { useRuntimeVariables } from './useRuntimeVariables';

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getTemplateSrv: jest.fn(() => ({
    getVariables: jest.fn(() => []),
  })),
}));

/**
 * Create eventBus mock
 */
const createEventBus = () => {
  let subscriber: () => void;

  return {
    getStream: jest.fn(() => ({
      subscribe: jest.fn((handler) => {
        subscriber = handler;
        return {
          unsubscribe: jest.fn(),
        };
      }),
    })),
    publish: () => {
      if (subscriber) {
        subscriber();
      }
    },
  };
};

describe('Use Runtime Variables', () => {
  const eventBus: any = createEventBus();

  const variableDevice = {
    name: 'device',
    type: VariableType.CUSTOM,
    options: [
      {
        text: 'Device1',
        value: '1',
      },
    ],
  };
  const variableCountry = {
    name: 'country',
    type: VariableType.QUERY,
    options: [],
  };
  const variableText = {
    name: 'text',
    type: VariableType.TEXTBOX,
    options: [],
  };
  const variableConstant = {
    name: 'constant',
    type: VariableType.CONSTANT,
    options: [],
  };
  const variableData = {
    name: 'data',
    type: 'datasource',
    options: [],
  };
  jest.mocked(getTemplateSrv).mockImplementation(
    () =>
      ({
        getVariables: jest.fn(() => [variableCountry, variableDevice, variableData, variableText, variableConstant]),
      }) as any
  );

  it('Should return variable', () => {
    const { result } = renderHook(() => useRuntimeVariables(eventBus, 'device'));

    expect(result.current.variable).toEqual({
      ...variableDevice,
    });
  });

  it('Should not return variable', () => {
    const { result } = renderHook(() => useRuntimeVariables(eventBus, 'data'));

    expect(result.current.variable).toBeUndefined();
  });

  it('Should update variable', async () => {
    const { result } = renderHook(() => useRuntimeVariables(eventBus, 'device'));

    expect(result.current.variable).toEqual({
      ...variableDevice,
    });

    /**
     * Update variables
     */
    jest.mocked(getTemplateSrv).mockImplementation(
      () =>
        ({
          getVariables: jest.fn(() => []),
        }) as any
    );

    /**
     * Trigger refresh event
     */
    await act(() => eventBus.publish());

    /**
     * Check if updated variable returns
     */
    await waitFor(() => expect(result.current.variable).not.toBeDefined());
  });
});
