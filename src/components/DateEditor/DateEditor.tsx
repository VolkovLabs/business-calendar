import { DateTime, dateTime, StandardEditorProps } from '@grafana/data';
import { DateTimePicker } from '@grafana/ui';
import React from 'react';

import { TEST_IDS } from '../../constants';

/**
 * Properties
 */
type Props = Pick<StandardEditorProps<string>, 'value' | 'onChange'>;

/**
 * Date Editor
 */
export const DateEditor: React.FC<Props> = ({ value, onChange }) => {
  return (
    <DateTimePicker
      minDate={undefined}
      maxDate={undefined}
      date={dateTime(value)}
      onChange={(dateTime?: DateTime) => {
        onChange(dateTime?.toISOString());
      }}
      data-testid={TEST_IDS.dateEditor.field}
    />
  );
};
