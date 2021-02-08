import React, { useState, useEffect, useCallback } from 'react';
import { DateTime, dateTimeParse, FieldType, PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { Button, useTheme } from '@grafana/ui';

interface Props extends PanelProps<SimpleOptions> {}

type Range = [DateTime, DateTime];

export const SimplePanel: React.FC<Props> = ({
  options,
  data,
  timeRange,
  timeZone,
  width,
  height,
  onChangeTimeRange,
}) => {
  const theme = useTheme();
  const [selectedInterval, setSelectedInterval] = useState<Range>();

  const [intervalSelection, setIntervalSelection] = useState(false);

  const keydownListener = useCallback(e => {
    if (e.key === 'Shift') {
      setIntervalSelection(true);
    }
  }, []);

  const keyupListener = useCallback(e => {
    if (e.key === 'Shift') {
      setIntervalSelection(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keydownListener, true);
    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener]);

  useEffect(() => {
    window.addEventListener('keyup', keyupListener, true);
    return () => window.removeEventListener('keyup', keyupListener, true);
  }, [keydownListener]);

  const onIntervalSelection = (time: DateTime) => (selected: boolean) => {
    if (!intervalSelection || !selectedInterval) {
      const clone1 = dateTimeParse(time.valueOf(), { timeZone });
      clone1.startOf('day');
      setSelectedInterval([clone1, clone1]);
    } else {
      const clone1 = dateTimeParse(time.valueOf(), { timeZone });
      const [start, end] = selectedInterval;

      if (clone1.isBefore(end)) {
        clone1.startOf('day');
        setSelectedInterval([clone1, end]);
      }
      if (start.isBefore(clone1)) {
        clone1.endOf('day');
        setSelectedInterval([start, clone1]);
      }
    }
  };

  const firstDayOfWeek = dateTimeParse(Date.now(), { timeZone }).startOf('week');

  const timeField = data.series[0].fields.find(_ => _.type === FieldType.time);
  const stringField = data.series[0].fields.find(_ => _.type === FieldType.string);

  const init: { [day: string]: Array<{ time: number; value: string }> } = {};

  const buckets = Array.from({ length: data.series[0].length })
    .map((_, i) => {
      return {
        time: timeField?.values.get(i),
        value: stringField?.values.get(i),
      };
    })
    .reduce((acc, curr) => {
      const day = dateTimeParse(curr.time, { timeZone }).format('YYYY-MM-DD');
      (acc[day] = acc[day] || []).push(curr);
      return acc;
    }, init);

  const from = dateTimeParse(timeRange.from, { timeZone });
  from.startOf('week');

  const to = dateTimeParse(timeRange.to, { timeZone });
  to.endOf('week');

  const days = to.diff(from, 'days');

  return (
    <div
      className={cx(
        css`
          width: ${width}px;
          height: ${height}px;
          display: flex;
          flex-direction: column;
        `
      )}
      onKeyPress={e => {
        console.log('he');
      }}
    >
      {selectedInterval && (
        <div
          className={css`
            position: absolute;
            bottom: 0;
            right: 0;
            padding: ${theme.spacing.sm};
          `}
        >
          <Button
            onClick={() => {
              if (selectedInterval) {
                const [from, to] = selectedInterval;
                onChangeTimeRange({ from: from.valueOf(), to: to.valueOf() });
              }
            }}
          >
            Apply time interval
          </Button>
        </div>
      )}

      <div
        className={css`
          width: 100%;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          font-size: ${theme.typography.size.md};
          font-weight: ${theme.typography.weight.regular};
          border-bottom: 1px solid ${theme.colors.border2};
        `}
      >
        {Array.from({ length: 7 }).map((_, i) => {
          const clone = dateTimeParse(firstDayOfWeek.valueOf(), { timeZone });
          clone.add(i, 'days');

          return (
            <div
              className={css`
                text-align: right;
                padding: ${theme.spacing.xxs} ${theme.spacing.xs};
              `}
            >
              {clone.format('ddd')}
            </div>
          );
        })}
      </div>
      <div
        className={css`
          width: 100%;
          display: grid;
          flex-grow: 1;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          grid-auto-rows: 10rem;
          overflow: auto;
        `}
      >
        {Array.from({ length: days + 1 }).map((_, i) => {
          const clone = dateTimeParse(from.valueOf(), { timeZone });
          clone.add(i, 'days');

          const isWeekend = clone.isoWeekday() === 6 || clone.isoWeekday() === 7;
          const isToday = clone.startOf('day').isSame(dateTimeParse(Date.now(), { timeZone }).startOf('day'));

          const entries = buckets[clone.format('YYYY-MM-DD')] ?? [];

          const isSelected =
            selectedInterval &&
            selectedInterval[0].valueOf() <= clone.valueOf() &&
            clone.valueOf() <= selectedInterval[1].valueOf();

          return (
            <Day
              day={clone.format('D')}
              key={i}
              weekend={isWeekend}
              today={isToday}
              entries={entries.map(_ => ({ label: _.value, color: theme.palette.brandSuccess }))}
              selected={isSelected ?? false}
              onSelectionChange={onIntervalSelection(clone)}
            />
          );
        })}
      </div>
    </div>
  );
};

interface CalendarEntry {
  color: string;
  label: string;
}

interface DayProps {
  day: string;
  weekend: boolean;
  today: boolean;
  entries: CalendarEntry[];
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

const Day = ({ day, weekend, today, entries, selected, onSelectionChange }: DayProps) => {
  const theme = useTheme();

  const styles = {
    root: css`
      background: ${weekend ? theme.colors.bg2 : theme.colors.bg1};
      border-top: 1px solid ${theme.colors.border2};
      border-left: 1px solid ${theme.colors.border2};

      &:nth-last-child(-n + 7) {
        border-bottom: 1px solid ${theme.colors.border2};
      }
      &:nth-child(7n) {
      }
      &:nth-child(7n + 1) {
        border-left: 0;
      }
      &:nth-child(-n + 7) {
        border-top: 0;
      }
    `,
    weekend: css`
      background: ${theme.colors.bg2};
    `,
    today: css``,
    selected: css`
      background: rgba(255, 0, 0, 0.05);
    `,
  };

  return (
    <div
      className={cx(
        styles.root,
        { [styles.weekend]: weekend },
        { [styles.today]: today },
        { [styles.selected]: selected }
      )}
      onClick={() => {
        onSelectionChange(!selected);
      }}
    >
      <div
        className={cx(
          css`
            float: right;
            color: ${theme.colors.textSemiWeak};
            border-radius: ${theme.border.radius.lg};
            font-size: ${theme.typography.size.md};
            margin: ${theme.spacing.xs};
            padding: 0.3em;
            padding-bottom: 0.1em;
            line-height: 1;
            user-select: none;
          `,
          {
            [css`
              color: ${theme.colors.textWeak};
            `]: weekend,
          },
          {
            [css`
              background: ${theme.palette.queryRed};
              color: ${theme.palette.black};
            `]: today,
          }
        )}
      >
        {day}
      </div>
      <div
        className={css`
          padding: 0.3em 0.5em;
        `}
      >
        {entries.map(_ => (
          <div
            className={css`
              display: flex;
              align-items: center;
              & > * {
                min-width: 5px;
              }
            `}
          >
            <svg width={5} height={5} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" fill={_.color}>
              <circle cx={5} cy={5} r={5} />
            </svg>
            <div
              className={css`
                font-size: ${theme.typography.size.sm};
                margin-left: ${theme.spacing.xs};
                user-select: none;
                box-sizing: border-box;
                flex-grow: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              `}
            >
              {_.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
