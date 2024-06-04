import { dateTime } from '@grafana/data';
import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { DateEditor } from './DateEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  DateTimePicker: jest.fn(({ onChange, ...restProps }) => {
    return (
      <input
        data-testid={restProps['data-testid']}
        value={restProps.value}
        onChange={(event) => {
          if (onChange) {
            onChange(dateTime(new Date(event.target.value)));
          }
        }}
      />
    );
  }),
}));

/**
 * Date Editor
 */
describe('Date Editor', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.dateEditor);
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   */
  const getComponent = ({ value = '', ...restProps }: any) => {
    return <DateEditor {...restProps} value={value} />;
  };

  it('should change date', () => {
    const onChange = jest.fn();
    render(getComponent({ onChange }));

    fireEvent.change(selectors.field(), { target: { value: '2022-03-10T00:00:00.000Z' } });

    expect(onChange).toHaveBeenCalledWith('2022-03-10T00:00:00.000Z');
  });
});
