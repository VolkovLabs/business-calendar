import React from 'react';
import { StandardEditorProps, FieldType } from '@grafana/data';
import { MultiSelect, Select } from '@grafana/ui';

interface Settings {
  filterByType: FieldType[];
  multi: boolean;
}

interface Props extends StandardEditorProps<string | string[] | null, Settings> {}

export const FieldSelectEditor: React.FC<Props> = ({ item, value, onChange, context }) => {
  if (context.data && context.data.length > 0) {
    const options = context.data
      .flatMap(frame => frame.fields)
      .filter(field => (item.settings?.filterByType ? item.settings?.filterByType.some(_ => field.type === _) : true))
      .map(field => ({
        label: field.name,
        value: field.name,
      }));

    if (item.settings?.multi) {
      return (
        <MultiSelect
          isClearable
          isLoading={false}
          value={value as string[]}
          onChange={e => onChange(e.map(_ => _.value!))}
          options={options}
        />
      );
    } else {
      return (
        <Select
          isClearable
          isLoading={false}
          value={value as string | null}
          onChange={e => {
            onChange(e?.value);
          }}
          options={options}
        />
      );
    }
  }

  return <Select onChange={() => {}} disabled={true} />;
};
