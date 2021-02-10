import React, { useState } from 'react';
import { css, cx } from 'emotion';

import { Field, FieldType, GrafanaTheme, PanelProps } from '@grafana/data';
import { Button, stylesFactory, useTheme } from '@grafana/ui';

import { Day } from './Day';
import { CalendarOptions } from 'types';
import { useKeyPress } from 'hooks';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

type Range = [dayjs.Dayjs, dayjs.Dayjs];

interface Props extends PanelProps<CalendarOptions> {}

export const CalendarPanel: React.FC<Props> = ({ options, data, timeRange, width, height, onChangeTimeRange }) => {
  const [selectedInterval, setSelectedInterval] = useState<Range>();
  const [intervalSelection, setIntervalSelection] = useState(false);

  useKeyPress('Shift', pressed => {
    setIntervalSelection(pressed);
  });

  const theme = useTheme();
  const styles = getStyles(theme);

  const onIntervalSelection = (time: dayjs.Dayjs) => (selected: boolean) => {
    if (!selectedInterval && !intervalSelection) {
      setSelectedInterval([time.startOf('day'), time.endOf('day')]);
      return;
    }

    if (selectedInterval && intervalSelection) {
      const [start, end] = selectedInterval;

      if (time.isSame(start)) {
        setSelectedInterval(undefined);
      }
      if (time.isBefore(end)) {
        setSelectedInterval([time, end]);
      }
      if (start.isBefore(time)) {
        setSelectedInterval([start, time.endOf('day')]);
      }

      return;
    }

    if (selectedInterval) {
      const clone1 = time.startOf('day');
      const clone2 = time.endOf('day');

      if (clone1.isSame(selectedInterval[0])) {
        setSelectedInterval(undefined);
        return;
      }

      setSelectedInterval([clone1, clone2]);
    }
  };

  const frame = data.series[0];

  // Find the fields we're going to be using for the visualization. If the user
  // has set the field explicitly we use that one, otherwise we guess based on
  // the expected field type.
  const textField = options.textField
    ? frame.fields.find(f => f.name === options.textField)
    : frame.fields.find(f => f.type === FieldType.string);

  const timeField = options.timeField
    ? frame.fields.find(f => f.name === options.timeField)
    : frame.fields.find(f => f.type === FieldType.time);

  const buckets = groupByDays(timeField, textField);

  const from = dayjs(timeRange.from.valueOf()).startOf('isoWeek');
  const to = dayjs(timeRange.to.valueOf()).endOf('isoWeek');

  const days = to.diff(from, 'days');

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
      {selectedInterval && (
        <div className={styles.applyIntervalButton}>
          <Button
            onClick={() => {
              if (selectedInterval) {
                const [from, to] = selectedInterval;
                setSelectedInterval(undefined);
                onChangeTimeRange({ from: from.valueOf(), to: to.valueOf() });
              }
            }}
          >
            Apply time interval
          </Button>
        </div>
      )}

      <div className={styles.weekdayContainer}>
        {Array.from({ length: 7 }).map((_, i) => {
          const clone = dayjs()
            .startOf('isoWeek')
            .add(i, 'days');

          return <div className={styles.weekdayLabel}>{clone.format('ddd')}</div>;
        })}
      </div>

      <div className={styles.calendarContainer}>
        {Array.from({ length: days + 1 }).map((_, i) => {
          const day = dayjs(from.valueOf())
            .startOf('day')
            .add(i, 'days');

          const outsideInterval =
            day.isBefore(dayjs(timeRange.from.valueOf()).startOf('day')) ||
            day.isAfter(dayjs(timeRange.to.valueOf()).startOf('day'));

          const isWeekend = day.isoWeekday() > 5;

          const isToday = dayjs()
            .startOf('day')
            .isSame(day);

          const entries = buckets[day.format('YYYY-MM-DD')] ?? [];

          const isSelected =
            selectedInterval &&
            selectedInterval[0].valueOf() <= day.valueOf() &&
            day.valueOf() <= selectedInterval[1].valueOf();

          return (
            <Day
              day={day}
              key={i}
              weekend={isWeekend}
              today={isToday}
              entries={entries
                .filter(_ => _.value && _.time)
                .map(_ => ({ label: _.value, color: theme.palette.brandSuccess }))}
              selected={isSelected ?? false}
              onSelectionChange={onIntervalSelection(day)}
              outsideInterval={outsideInterval}
            />
          );
        })}
      </div>
    </div>
  );
};

const groupByDays = (timeField?: Field, textField?: Field) => {
  const init: { [day: string]: Array<{ time: number; value: string }> } = {};

  return Array.from({ length: timeField?.values.length ?? 0 })
    .map((_, i) => {
      return {
        time: timeField?.values.get(i),
        value: textField?.values.get(i),
      };
    })
    .reduce((acc, curr) => {
      const day = dayjs(curr.time).format('YYYY-MM-DD');
      (acc[day] = acc[day] || []).push(curr);
      return acc;
    }, init);
};

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    applyIntervalButton: css`
      position: absolute;
      bottom: 0;
      right: 0;
      padding: ${theme.spacing.sm};
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
      grid-auto-rows: 10rem;
      overflow: auto;
      user-select: none;
    `,
  };
});
