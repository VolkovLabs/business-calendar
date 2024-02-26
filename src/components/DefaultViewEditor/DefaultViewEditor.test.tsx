import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

import { DefaultView, TestIds } from '../../constants';
import { View } from '../../types';
import { DefaultViewEditor } from './DefaultViewEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  Select: jest.fn(({ options, onChange, value, ...restProps }) => (
    <select
      onChange={(event: any) => {
        if (onChange) {
          const option = options.find((option: any) => {
            /**
             * Jest convert number to string, so just using not strict comparison
             */
            // eslint-disable-next-line eqeqeq
            return option.value == event.target.value;
          });

          if (option) {
            onChange(option);
          }
        }
      }}
      /**
       * Fix jest warnings because null value.
       * For Select component in @grafana/ui should be used null to reset value.
       */
      value={value === null ? '' : value}
      {...restProps}
    >
      {options.map(({ label, value }: any) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )),
}));

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof DefaultViewEditor>;

/**
 * Default View Editor
 */
describe('Default View Editor', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TestIds.defaultViewEditor);
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = (props: Partial<Props>) => {
    return <DefaultViewEditor {...(props as any)} />;
  };

  it('Should update value', () => {
    const onChange = jest.fn();

    render(
      getComponent({
        value: View.YEAR,
        context: { options: { views: [View.MONTH, View.YEAR] } as any } as any,
        onChange,
      })
    );

    expect(selectors.field()).toHaveValue(View.YEAR);

    /**
     * Change value
     */
    fireEvent.change(selectors.field(), { target: { value: View.MONTH } });

    expect(onChange).toHaveBeenCalledWith(View.MONTH);
  });

  it('Should filter available options', () => {
    const onChange = jest.fn();

    render(
      getComponent({
        value: View.YEAR,
        context: { options: { views: [View.MONTH, View.YEAR] } as any } as any,
        onChange,
      })
    );

    expect(selectors.field()).toHaveValue(View.YEAR);

    /**
     * Change on unavailable value
     */
    fireEvent.change(selectors.field(), { target: { value: View.DAY } });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should use first available option if value unavailable ', () => {
    const onChange = jest.fn();

    const { rerender } = render(
      getComponent({
        value: View.YEAR,
        context: { options: { views: [View.WEEK, View.YEAR] } as any } as any,
        onChange,
      })
    );

    expect(selectors.field()).toHaveValue(View.YEAR);

    /**
     * Re-render
     */
    rerender(
      getComponent({
        value: View.YEAR,
        context: { options: { views: [View.WEEK] } as any } as any,
        onChange,
      })
    );

    expect(onChange).toHaveBeenCalledWith(View.WEEK);
  });

  it('Should not use first available option if value available ', () => {
    const onChange = jest.fn();

    const { rerender } = render(
      getComponent({
        value: View.YEAR,
        context: { options: { views: [View.WEEK, View.YEAR] } as any } as any,
        onChange,
      })
    );

    expect(selectors.field()).toHaveValue(View.YEAR);

    /**
     * Re-render
     */
    rerender(
      getComponent({
        value: View.YEAR,
        context: { options: { views: [View.YEAR] } as any } as any,
        onChange,
      })
    );

    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should use default value if no options', () => {
    const onChange = jest.fn();

    render(
      getComponent({
        value: View.YEAR,
        context: { options: { views: [] } as any } as any,
        onChange,
      })
    );

    expect(onChange).toHaveBeenCalledWith(DefaultView);
  });
});
