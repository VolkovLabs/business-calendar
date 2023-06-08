import React from 'react';
import { toDataFrame } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { act, render, screen, waitFor } from '@testing-library/react';
import { TestIds } from '../../constants';
import { CalendarPanel } from './CalendarPanel';

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve()),
  })),
}));

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component', async () => {
    const getComponent = ({ options = { name: 'data' }, ...restProps }: any) => {
      const data = {
        series: [
          toDataFrame({
            name: 'data',
            fields: [],
          }),
        ],
      };
      return (
        <CalendarPanel data={data} {...restProps} options={options} timeRange={{ from: Date.now(), to: Date.now() }} />
      );
    };

    const getMock = jest.fn(() => Promise.resolve());
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: getMock,
        } as any)
    );

    await act(async () => {
      await render(getComponent({}));

      /**
       * Remove act warnings
       * Wait timeout until promise resolves. Because there is not loading element for checking promise resolves
       */
      await new Promise((resolve) => setTimeout(resolve, 1));
    });

    await waitFor(() => expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument());
  });
});
