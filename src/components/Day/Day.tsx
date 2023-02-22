import dayjs from 'dayjs';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { css, cx } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
import { getStyles } from '../../styles';
import { CalendarEvent } from '../../types';
import { CalendarEntry } from '../CalendarEntry';

/**
 * Properties
 */
interface Props {
  day: dayjs.Dayjs;
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
  today,
  events,
  selected,
  onSelectionChange,
  outsideInterval,
  onShowMore,
  onShowEvent,
  quickLinks,
}: Props) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const isWeekend = day.isoWeekday() > 5;

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
    <div
      className={cx(
        styles.day,
        { [styles.weekend]: isWeekend },
        { [styles.today]: today },
        { [styles.selected]: selected },
        { [styles.outsideInterval]: outsideInterval }
      )}
      onClick={(e) => {
        onSelectionChange(!selected);
      }}
    >
      <div className={styles.dateHeader.root}>
        <div className={styles.dateHeader.monthLabel}>{day.format('D') === '1' && day.format('MMM')}</div>
        <div
          className={cx(
            styles.dateHeader.dayLabel,
            {
              [css`
                color: ${theme.v1.colors.textWeak};
              `]: isWeekend,
            },
            {
              [css`
                color: ${theme.v1.colors.textFaint};
              `]: outsideInterval,
            },
            {
              [css`
                background: ${theme.v1.palette.queryRed};
                color: ${theme.v1.palette.black};
              `]: today,
            },
            {
              [css`
                background: ${theme.v1.colors.textBlue};
                color: ${theme.v1.palette.black};
              `]: selected,
            }
          )}
        >
          {day.format('D')}
        </div>
      </div>

      <AutoSizer disableWidth>
        {({ height }) => {
          const heightPerEntry = 17;
          const maxNumEvents = Math.max(Math.floor((height - 3 * heightPerEntry) / heightPerEntry), 0);
          const moreEvents = entries.length - maxNumEvents;

          return (
            <>
              {entries.filter((_, i) => i < maxNumEvents)}

              {entries.length - maxNumEvents > 0 && (
                <div onClick={onShowMore} className={styles.moreEntriesLabel}>{`${moreEvents} more`}</div>
              )}
            </>
          );
        }}
      </AutoSizer>
    </div>
  );
};
