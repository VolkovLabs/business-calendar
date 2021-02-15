import React from 'react';
import { css, cx } from 'emotion';

import { stylesFactory, useTheme } from '@grafana/ui';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { GrafanaTheme } from '@grafana/data';

dayjs.extend(isoWeek);

interface CalendarEntry {
  color: string;
  label: string;
}

interface Props {
  day: dayjs.Dayjs;
  weekend: boolean;
  today: boolean;
  entries: CalendarEntry[];
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
  outsideInterval: boolean;
  annotations: any[];
}

export const Day = ({
  day,
  weekend,
  today,
  entries,
  selected,
  onSelectionChange,
  outsideInterval,
  annotations,
}: Props) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const maxNumEntries = 5;

  return (
    <div
      className={cx(
        styles.root,
        { [styles.weekend]: weekend },
        { [styles.today]: today },
        { [styles.selected]: selected },
        { [styles.outsideInterval]: outsideInterval }
      )}
      onClick={() => {
        onSelectionChange(!selected);
      }}
    >
      <div>
        <div
          className={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: ${theme.spacing.xs};
          `}
        >
          <div
            className={css`
              color: ${theme.palette.brandPrimary};
              font-weight: 500;
            `}
          >
            {day.format('D') === '1' && day.format('MMM')}
          </div>
          <div
            className={cx(
              css`
                color: ${theme.colors.textSemiWeak};
                border-radius: 50%;
                width: 3ch;
                height: 3ch;
                text-align: center;
                font-size: ${theme.typography.size.md};
                line-height: 3.1ch;
                user-select: none;
              `,
              {
                [css`
                  color: ${theme.colors.textWeak};
                `]: weekend,
              },
              {
                [css`
                  color: ${theme.colors.textFaint};
                `]: outsideInterval,
              },
              {
                [css`
                  background: ${theme.palette.queryRed};
                  color: ${theme.palette.black};
                `]: today,
              },
              {
                [css`
                  background: ${theme.colors.textBlue};
                  color: ${theme.palette.black};
                `]: selected,
              }
            )}
          >
            {day.format('D')}
          </div>
        </div>
      </div>
      <div>
        {annotations.map(annotation => (
          <div className={styles.annotationEntry}>{annotation.text}</div>
        ))}
        {entries
          .filter((_, i) => i + annotations.length < maxNumEntries)
          .map(_ => (
            <div className={styles.calendarEntry}>
              <svg width={5} height={5} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" fill={_.color}>
                <circle cx={5} cy={5} r={5} />
              </svg>
              <div
                className={cx(styles.calendarEntryLabel, {
                  [css`
                    color: ${theme.colors.textFaint};
                  `]: outsideInterval,
                })}
              >
                {_.label}
              </div>
            </div>
          ))}
        {annotations.length + entries.length - maxNumEntries > 0 && (
          <div className={styles.moreEntriesLabel}>{`${annotations.length +
            entries.length -
            maxNumEntries} more...`}</div>
        )}
      </div>
    </div>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    root: css`
      background: ${theme.colors.panelBg};
      border-top: 1px solid ${theme.colors.border2};
      border-left: 1px solid ${theme.colors.border2};
      overflow: hidden;

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
    outsideInterval: css`
      background: ${theme.colors.dashboardBg};
    `,
    today: css``,
    selected: css``,
    calendarEntry: css`
      display: flex;
      align-items: center;
      padding: 0 ${theme.spacing.xs};
    `,
    calendarEntryLabel: css`
      font-size: ${theme.typography.size.sm};
      margin-left: ${theme.spacing.xs};
      user-select: none;
      box-sizing: border-box;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    moreEntriesLabel: css`
      font-size: ${theme.typography.size.sm};
      margin-left: 10px;
      user-select: none;
      color: ${theme.colors.textWeak};
    `,
    annotationEntry: css`
      font-size: ${theme.typography.size.sm};
      background: ${theme.colors.textBlue};
      color: ${theme.palette.black};
      padding-left: 13px;
      margin-bottom: 1px;
    `,
  };
});
