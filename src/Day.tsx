import React, { useState } from 'react';
import { css, cx } from 'emotion';

import { stylesFactory, useTheme } from '@grafana/ui';

import dayjs from 'dayjs';
import { GrafanaTheme } from '@grafana/data';
import AutoSizer from 'react-virtualized-auto-sizer';
import { CalendarEvent } from 'types';
import Tippy from '@tippyjs/react';
import { CalendarEntry } from './CalendarEntry';

interface Props {
  day: dayjs.Dayjs;
  weekend: boolean;
  today: boolean;
  events: Array<CalendarEvent | undefined>;
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
  outsideInterval: boolean;
  from: dayjs.Dayjs;
  to: dayjs.Dayjs;
}

export const Day = ({ day, weekend, today, events, selected, onSelectionChange, outsideInterval }: Props) => {
  const [visible, setVisible] = useState(false);
  const show = (e: any) => {
    e.stopPropagation();
    setVisible(true);
  };
  const hide = () => setVisible(false);

  const theme = useTheme();
  const styles = getStyles(theme);

  const dateHeader = (
    <div className={styles.dateHeader.root}>
      <div className={styles.dateHeader.monthLabel}>{day.format('D') === '1' && day.format('MMM')}</div>
      <div
        className={cx(
          styles.dateHeader.dayLabel,
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
  );

  const entries = events.map(event => (
    <CalendarEntry event={event} day={day} outsideInterval={outsideInterval} summary={false} />
  ));

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
      {dateHeader}

      <AutoSizer disableWidth>
        {({ height }) => {
          // TODO: Can we compute this rather than having it hard-coded?
          const heightPerEntry = 17;

          const maxNumEvents = Math.max(Math.floor((height - 3 * heightPerEntry) / heightPerEntry), 0);

          return (
            <>
              {entries.filter((_, i) => i < maxNumEvents)}
              {entries.length - maxNumEvents > 0 && (
                <Tippy
                  maxWidth={500}
                  content={
                    <div>
                      {events.map(event => (
                        <CalendarEntry event={event} day={day} outsideInterval={outsideInterval} summary={true} />
                      ))}
                    </div>
                  }
                  placement="bottom"
                  animation={false}
                  className={styles.tooltip}
                  visible={visible}
                  onClickOutside={hide}
                >
                  <div onClick={show} className={styles.moreEntriesLabel}>{`${entries.length -
                    maxNumEvents} more…`}</div>
                </Tippy>
              )}
            </>
          );
        }}
      </AutoSizer>
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

    event: css`
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 1rem;
      padding: 0 ${theme.spacing.xs};
      width: 100%;

      &:not(&:last-child) {
        margin-bottom: 1px;
      }
    `,
    eventLabel: css`
      font-size: ${theme.typography.size.xs};
      user-select: none;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    multiDayEvent: css`
      padding-left: ${theme.spacing.sm};
      background: ${theme.colors.textBlue};
      color: ${theme.palette.black};
    `,
    centerItems: css`
      display: flex;
      align-items: center;
    `,
    filler: css`
      background: transparent;
    `,
    moreEntriesLabel: css`
      margin-top: 1px;
      display: inline-block;
      font-size: ${theme.typography.size.xs};
      padding: ${theme.spacing.xs};
      user-select: none;
      color: ${theme.colors.textWeak};
      cursor: pointer;

      &:hover {
        background: ${theme.colors.bg3};
        border-radius: 0 ${theme.border.radius.lg} ${theme.border.radius.lg} 0;
      }
    `,
    startDayStyle: css`
      width: calc(100% - ${theme.spacing.xs});
      margin-left: ${theme.spacing.xs};
      border-radius: ${theme.border.radius.lg} 0 0 ${theme.border.radius.lg};
    `,
    endDayStyle: css`
      width: calc(100% - ${theme.spacing.xs});
      border-radius: 0 ${theme.border.radius.lg} ${theme.border.radius.lg} 0;
    `,
    dateHeader: {
      root: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: ${theme.spacing.xs};
      `,
      monthLabel: css`
        color: ${theme.palette.brandPrimary};
        font-weight: 500;
      `,
      dayLabel: css`
        color: ${theme.colors.textSemiWeak};
        border-radius: 50%;
        width: 3ch;
        height: 3ch;
        text-align: center;
        font-size: ${theme.typography.size.md};
        line-height: 3.1ch;
        user-select: none;
      `,
    },
    tooltip: css`
      min-width: 200px;
      border-radius: ${theme.border.radius.md};
      background-color: ${theme.colors.bg2};
      padding: ${theme.spacing.sm};
      box-shadow: 0px 0px 20px ${theme.colors.dropdownShadow};
    `,
  };
});
