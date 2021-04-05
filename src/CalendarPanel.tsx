import React from 'react';
import { css, cx } from 'emotion';

import { FieldType, GrafanaTheme, PanelProps } from '@grafana/data';
import { Button, stylesFactory, useTheme } from '@grafana/ui';

import { alignEvents } from 'alignEvents';
import { Day } from './Day';
import { CalendarEvent, CalendarOptions } from './types';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import { useIntervalSelection } from 'hooks';

dayjs.extend(isoWeek);
dayjs.extend(utc);

interface Props extends PanelProps<CalendarOptions> {}

export const CalendarPanel: React.FC<Props> = ({ options, data, timeRange, width, height, onChangeTimeRange }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [selectedInterval, clearSelection, onTimeSelection] = useIntervalSelection();

  const frame = data.series.length > 0 ? data.series[0] : undefined;

  // Find the fields we're going to be using for the visualization. If the user
  // has set the field explicitly we use that one, otherwise we guess based on
  // the expected field type.
  const textField = options.textField
    ? frame?.fields.find(f => f.name === options.textField)
    : frame?.fields.find(f => f.type === FieldType.string);

  const startTimeField = options.timeField
    ? frame?.fields.find(f => f.name === options.timeField)
    : frame?.fields.find(f => f.type === FieldType.time);

  // No default for end time. If end time dimension isn't set, we assume that all events are instants.
  const endTimeField = frame?.fields.find(f => f.name === options.endTimeField);

  // We'll still show the calendar even if no dimensions are set. However, if the user has configured a text field
  // without a matching time field, this is likely an error.
  if (textField && !startTimeField) {
    return <div>You've configured a text field without a corresponding time field.</div>;
  }

  const from = dayjs(timeRange.from.valueOf());
  const to = dayjs(timeRange.to.valueOf());
  const startOfWeek = from.startOf('isoWeek');
  const endOfWeek = to.endOf('isoWeek');
  const numDays = endOfWeek.diff(startOfWeek, 'days');

  const events = Array.from({ length: frame?.length ?? 0 })
    .map((_, i) => ({
      label: textField?.values.get(i),
      start: startTimeField?.values.get(i),
      end: endTimeField?.values.get(i),
    }))
    .map<CalendarEvent>(({ label, start, end }) => ({
      label,
      start: dayjs(start),

      // Set undefined if the user hasn't explicitly configured the dimension
      // for end time.
      //
      // Set end time to the end of the time interval if the user configured the
      // end time dimension, but it's missing values. The panel interpretes
      // this as an open interval.
      end: endTimeField ? (end ? dayjs(end) : endOfWeek) : undefined,
      open: !!endTimeField && !end,
    }));

  const alignedEvents = alignEvents(events);

  return (
    <div
      className={cx(
        css`
          width: ${width}px;
          height: ${height}px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        `
      )}
    >
      {/* Apply time interval */}
      {selectedInterval && (
        <div className={styles.applyIntervalButton}>
          <Button
            onClick={() => {
              if (selectedInterval) {
                const [from, to] = selectedInterval;
                clearSelection();
                onChangeTimeRange({ from: from.valueOf(), to: to.valueOf() });
              }
            }}
          >
            Apply time interval
          </Button>
        </div>
      )}

      {/* Header displaying the weekdays */}
      <div className={styles.weekdayContainer}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div className={styles.weekdayLabel}>
            {dayjs()
              .startOf('isoWeek')
              .add(i, 'days')
              .format('ddd')}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div
        className={cx(
          styles.calendarContainer,
          css`
            grid-auto-rows: ${Math.max(100 / Math.ceil(numDays / 7), 20)}%;
          `
        )}
      >
        {Array.from({ length: numDays + 1 }).map((_, i) => {
          const day = dayjs(startOfWeek.valueOf())
            .startOf('day')
            .add(i, 'days');

          const isWeekend = day.isoWeekday() > 5;
          const isToday = day.isSame(dayjs().startOf('day'));
          const isSelected =
            selectedInterval &&
            selectedInterval[0].valueOf() <= day.valueOf() &&
            day.valueOf() <= selectedInterval[1].valueOf();

          // Since the calendar always displays full weeks, the day may be
          // rendered even if it's outside of the selected time interval.
          const isOutsideInterval = day.isBefore(from.startOf('day')) || day.isAfter(to.startOf('day'));

          const events = alignedEvents[day.format('YYYY-MM-DD')] ?? [];
          const entries = events.map<CalendarEvent | undefined>(event =>
            event ? { ...event, color: theme.palette.brandSuccess } : undefined
          );

          return (
            <Day
              key={i}
              day={day}
              weekend={isWeekend}
              today={isToday}
              events={entries}
              selected={!!isSelected}
              onSelectionChange={() => onTimeSelection(day)}
              outsideInterval={isOutsideInterval}
              from={startOfWeek}
              to={endOfWeek}
            />
          );
        })}
      </div>
    </div>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    applyIntervalButton: css`
      position: absolute;
      bottom: 0;
      right: 0;
      padding: ${theme.spacing.sm};
      z-index: 1000;
    `,
    weekdayContainer: css`
      width: 100%;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      font-size: ${theme.typography.size.md};
      font-weight: ${theme.typography.weight.regular};
      border-bottom: 1px solid ${theme.colors.border2};
    `,
    weekdayLabel: css`
      text-align: right;
      padding: ${theme.spacing.xxs} ${theme.spacing.xs};
      overflow: hidden;
    `,
    calendarContainer: css`
      width: 100%;
      display: grid;
      flex-grow: 1;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      grid-auto-rows: 20%;
      overflow: auto;
      user-select: none;
    `,
  };
});
