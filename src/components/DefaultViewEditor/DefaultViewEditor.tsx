import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StandardEditorProps } from '@grafana/data';
import { Select } from '@grafana/ui';
import { CalendarViewOptions, DefaultView, TestIds } from '../../constants';
import { CalendarOptions, View } from '../../types';

/**
 * Properties
 */
interface Props extends StandardEditorProps<View, null, CalendarOptions> {}

/**
 * Default View Editor
 */
export const DefaultViewEditor: React.FC<Props> = ({ onChange, value, context }) => {
  /**
   * Translation
   */
  const { t } = useTranslation();

  /**
   * Available options
   */
  const options = useMemo(() => {
    const allOptions = CalendarViewOptions(t);

    return allOptions.filter((option) => context.options?.views?.includes(option.value));
  }, [context.options?.views, t]);

  /**
   * Use first option if selectedValue is unavailable
   */
  useEffect(() => {
    if (!options.some((option) => option.value === value)) {
      onChange(options[0]?.value || DefaultView);
    }
  }, [onChange, options, value]);

  return (
    <Select
      onChange={(event) => {
        onChange(event.value);
      }}
      options={options}
      value={value}
      aria-label={TestIds.defaultViewEditor.field}
    />
  );
};
