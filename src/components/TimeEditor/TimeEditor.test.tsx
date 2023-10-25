import React from 'react';
import { dateTime } from '@grafana/data';
import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import { TestIds } from '../../constants';
import { TimeEditor } from './TimeEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  TimeOfDayPicker: jest.fn(({ onChange, ...restProps }) => {
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
 * Component Props
 */
type Props = React.ComponentProps<typeof TimeEditor>;

/**
 * Time Editor
 */
describe('Time Editor', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TestIds.timeEditor);
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = (props: Partial<Props>) => {
    return <TimeEditor {...(props as any)} />;
  };

  it('Should convert to utc date', () => {
    const onChange = jest.fn();
    render(getComponent({ onChange }));

    fireEvent.change(selectors.field(), { target: { value: 'Wed Oct 05 2011 16:48:00 GMT+0200 (CEST)' } });

    expect(onChange).toHaveBeenCalledWith('2011-10-05T14:48:00.000Z');
  });
});
