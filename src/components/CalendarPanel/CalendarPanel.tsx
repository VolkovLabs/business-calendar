import React from 'react';
import { PanelProps } from '@grafana/data';
import { CalendarOptions } from '../../types';
import { CustomCalendar } from '../CustomCalendar';
import { LibCalendar } from '../LibCalendar';

/**
 * Properties
 */
interface Props extends PanelProps<CalendarOptions> {}

/**
 * Calendar Panel
 */
export const CalendarPanel: React.FC<Props> = (props) => {
  if (props.options.calendarType === 'library') {
    return <LibCalendar {...props} />;
  }

  return <CustomCalendar {...props} />;
};
