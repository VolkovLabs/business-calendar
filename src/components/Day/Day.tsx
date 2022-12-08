import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, { useRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { css, cx } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, useTheme2 } from '@grafana/ui';
import { CalendarEvent } from '../../types';
import { CalendarEntry } from '../CalendarEntry';

dayjs.extend(localizedFormat);

/**
 * Properties
 */
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
  onShowMore: () => void;
  onShowEvent: (event: CalendarEvent) => void;
  quickLinks: boolean;
}

/**
 * Day
 */
export const Day = ({
  day,
  weekend,
  today,
  events,
  selected,
  onSelectionChange,
  outsideInterval,
  onShowMore,
  onShowEvent,
  quickLinks,
}: Props) => {
  const theme = useTheme2().v1;
  const styles = useStyles2(getStyles);

  const rootRef = useRef<HTMLDivElement | null>(null);

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

  const entries = events.map((event, i) => (
    <CalendarEntry
      key={i}
      event={event}
      day={day}
      outsideInterval={outsideInterval}
      summary={false}
      onClick={() => {
        if (event) {
          onShowEvent(event);
        }
      }}
      quickLinks={quickLinks}
    />
  ));

  return (
    <>
      <div
        ref={rootRef}
        className={cx(
          styles.root,
          { [styles.weekend]: weekend },
          { [styles.today]: today },
          { [styles.selected]: selected },
          { [styles.outsideInterval]: outsideInterval }
        )}
        onClick={(e) => {
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
                  <>
                    <div onClick={onShowMore} className={styles.moreEntriesLabel}>{`${
                      entries.length - maxNumEvents
                    } more…`}</div>
                  </>
                )}
              </>
            );
          }}
        </AutoSizer>
      </div>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  root: css`
    background: ${theme.v1.colors.panelBg};
    border-top: 1px solid ${theme.v1.colors.border2};
    border-left: 1px solid ${theme.v1.colors.border2};
    overflow: hidden;

    &:nth-last-child(-n + 7) {
      border-bottom: 1px solid ${theme.v1.colors.border2};
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
    background: ${theme.v1.colors.bg2};
  `,
  outsideInterval: css`
    background: ${theme.v1.colors.dashboardBg};
  `,
  today: css``,
  selected: css``,

  moreEntriesLabel: css`
    margin-top: 1px;
    display: inline-block;
    font-size: ${theme.typography.size.xs};
    padding: ${theme.v1.spacing.xs};
    user-select: none;
    color: ${theme.v1.colors.textWeak};
    cursor: pointer;

    &:hover {
      background: ${theme.v1.colors.bg3};
      border-radius: 0 ${theme.v1.border.radius.lg} ${theme.v1.border.radius.lg} 0;
    }
  `,
  startDayStyle: css`
    width: calc(100% - ${theme.v1.spacing.xs});
    margin-left: ${theme.v1.spacing.xs};
    border-radius: ${theme.v1.border.radius.lg} 0 0 ${theme.v1.border.radius.lg};
  `,
  endDayStyle: css`
    width: calc(100% - ${theme.v1.spacing.xs});
    border-radius: 0 ${theme.v1.border.radius.lg} ${theme.v1.border.radius.lg} 0;
  `,
  dateHeader: {
    root: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: ${theme.v1.spacing.xs};
    `,
    monthLabel: css`
      color: ${theme.v1.palette.brandPrimary};
      font-weight: 500;
    `,
    dayLabel: css`
      color: ${theme.v1.colors.textSemiWeak};
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
    border-radius: ${theme.v1.border.radius.sm};
    background-color: ${theme.v1.colors.bg2};
    padding: ${theme.v1.spacing.sm};
    box-shadow: 0px 0px 20px ${theme.v1.colors.dropdownShadow};
  `,
});
