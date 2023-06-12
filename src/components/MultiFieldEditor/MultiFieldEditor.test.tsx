import React from 'react';
import { toDataFrame, FieldType } from '@grafana/data';
import { fireEvent, render, screen } from '@testing-library/react';
import { TestIds } from '../../constants';
import { MultiFieldEditor } from './MultiFieldEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  MultiSelect: jest.fn().mockImplementation(({ options, onChange, value, isClearable, isLoading, ...restProps }) => (
    <select
      onChange={(event: any) => {
        if (onChange) {
          onChange(options.filter((option: any) => option.value === event.target.value));
        }
      }}
      /**
       * Fix jest warnings because null value.
       * For Select component in @grafana/io should be used null to reset value.
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
type Props = React.ComponentProps<typeof MultiFieldEditor>;

/**
 * Editor
 */
describe('Editor', () => {
  /**
   * Default context
   */
  const context = {
    options: {},
  };

  /**
   * Get Tested Component
   * @param restProps
   */
  const getComponent = ({ ...restProps }: Partial<Props>) => {
    return <MultiFieldEditor context={context as any} {...(restProps as any)} />;
  };

  it('Should render select component', async () => {
    render(getComponent({}));

    expect(screen.getByLabelText(TestIds.multiFieldEditor.select)).toBeInTheDocument();
    expect(screen.getByLabelText(TestIds.multiFieldEditor.select)).toBeDisabled();
  });

  it('Should render multi select component', async () => {
    const onChange = jest.fn();
    const data = [
      toDataFrame({
        fields: [
          {
            type: FieldType.string,
            name: 'text',
            values: ['111', '222'],
          },
        ],
      }),
    ];
    render(
      getComponent({ context: { data }, item: { settings: { filterByType: [FieldType.string] } } as any, onChange })
    );

    expect(screen.getByLabelText(TestIds.multiFieldEditor.multiSelect)).toBeInTheDocument();

    /**
     * Change multi select value
     */
    fireEvent.change(screen.getByLabelText(TestIds.multiFieldEditor.multiSelect), { target: { value: 'text' } });

    expect(onChange).toHaveBeenCalledWith(['text']);
  });
});
