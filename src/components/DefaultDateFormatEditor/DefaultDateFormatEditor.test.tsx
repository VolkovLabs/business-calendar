import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import i18next from 'i18next';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { DateFormat } from '../../types';
import { DefaultDateFormatEditor } from './DefaultDateFormatEditor';

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
type Props = React.ComponentProps<typeof DefaultDateFormatEditor>;

/**
 * Default Date Format Editor
 */
describe('Default Date Format Editor', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.defaultDateFormatEditor);
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = (props: Partial<Props>) => {
    return <DefaultDateFormatEditor {...(props as any)} />;
  };

  it('Should update value', () => {
    const onChange = jest.fn();

    render(
      getComponent({
        value: DateFormat.EN,
        onChange,
      })
    );

    expect(selectors.field()).toHaveValue(DateFormat.EN);

    /**
     * Change value
     */
    fireEvent.change(selectors.field(), { target: { value: DateFormat.DE } });

    expect(onChange).toHaveBeenCalledWith(DateFormat.DE);
  });

  it('Should not use first available option if value available ', () => {
    const onChange = jest.fn();

    const { rerender } = render(
      getComponent({
        value: DateFormat.ZH,
        onChange,
      })
    );

    expect(selectors.field()).toHaveValue(DateFormat.ZH);

    /**
     * Re-render
     */
    rerender(
      getComponent({
        value: DateFormat.ZH,
        onChange,
      })
    );

    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should change i18next language', () => {
    const onChange = jest.fn();
    const i18nextChangeLangSpy = jest.spyOn(i18next, 'changeLanguage');

    render(
      getComponent({
        value: DateFormat.EN_24H,
        onChange,
      })
    );

    expect(selectors.field()).toHaveValue(DateFormat.EN_24H);

    fireEvent.change(selectors.field(), { target: { value: DateFormat.DE } });

    expect(i18nextChangeLangSpy).toHaveBeenCalledWith(DateFormat.DE);

    i18nextChangeLangSpy.mockRestore();
  });

  it('Should change i18next language for EN_24H format', () => {
    const onChange = jest.fn();
    const i18nextChangeLangSpy = jest.spyOn(i18next, 'changeLanguage');

    render(
      getComponent({
        value: DateFormat.DE,
        onChange,
      })
    );

    expect(selectors.field()).toHaveValue(DateFormat.DE);

    fireEvent.change(selectors.field(), { target: { value: DateFormat.EN_24H } });

    expect(i18nextChangeLangSpy).toHaveBeenCalledWith(DateFormat.EN);

    i18nextChangeLangSpy.mockRestore();
  });
});
