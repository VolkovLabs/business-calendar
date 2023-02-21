import React from 'react';
import { FieldType, StandardEditorProps } from '@grafana/data';
import { MultiSelect, Select } from '@grafana/ui';

/**
 * Settings
 */
interface Settings {
  filterByType: FieldType[];
}

/**
 * Properties
 */
interface Props extends StandardEditorProps<string | string[] | null, Settings> {}

/**
 * Multi Field Editor
 */
export const MultiFieldEditor: React.FC<Props> = ({ item, value, onChange, context }) => {
  if (!context.data || !context.data.length) {
    return <Select onChange={() => {}} disabled={true} />;
  }

  /**
   * Options
   */
  const options = context.data
    .flatMap((frame) => frame.fields)
    .filter((field) => item.settings?.filterByType.includes(field.type))
    .map((field) => ({
      label: field.name,
      value: field.name,
    }));

  return (
    <MultiSelect
      isClearable
      isLoading={false}
      value={value as string[]}
      onChange={(element) => onChange(element.map((s) => s.value!))}
      options={options}
    />
  );
};
