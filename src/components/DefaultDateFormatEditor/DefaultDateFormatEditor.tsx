import { StandardEditorProps } from '@grafana/data';
import { Select } from '@grafana/ui';
import i18next from 'i18next';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { DATE_FORMAT_OPTIONS, TEST_IDS } from '../../constants';
import { CalendarOptions, DateFormat } from '../../types';

/**
 * Properties
 */
interface Props extends StandardEditorProps<DateFormat, null, CalendarOptions> {}

/**
 * Default Date Format Editor
 */
export const DefaultDateFormatEditor: React.FC<Props> = ({ onChange, value }) => {
  /**
   * Translation
   */
  const { t } = useTranslation();

  /**
   * Change Date Format
   */
  const onChangeHandler = useCallback(
    (value?: DateFormat) => {
      /**
       * Call .changeLanguage() to change language on panel options and UI
       */
      value === DateFormat.EN_24H ? i18next.changeLanguage(DateFormat.EN) : i18next.changeLanguage(value);

      onChange(value);
    },
    [onChange]
  );

  return (
    <Select
      onChange={(event) => {
        onChangeHandler(event.value);
      }}
      options={DATE_FORMAT_OPTIONS(t)}
      value={value}
      aria-label={TEST_IDS.defaultDateFormatEditor.field}
    />
  );
};
