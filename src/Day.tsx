import React, { useState, useRef } from 'react';
import { css, cx } from 'emotion';

import { Badge, stylesFactory, useTheme } from '@grafana/ui';

import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();

  const [moreVisible, setMoreVisible] = useState(false);
  const hideMore = () => setMoreVisible(false);
  const showMore = (e: any) => {
    e.stopPropagation();
    setEntryVisible(false);
    setMoreVisible(true);
  };

  const [entryVisible, setEntryVisible] = useState(false);
  const hideEntry = () => setEntryVisible(false);
  const showEntry = (event?: CalendarEvent) => (e: any) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setMoreVisible(false);
    setEntryVisible(true);
  };

  const theme = useTheme();
  const styles = getStyles(theme);

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
      onClick={showEntry(event)}
    />
  ));

  const eventSummary = (event: CalendarEvent) => {
    return (
      <div
        className={css`
          & > * {
            &:not(&:last-child) {
              margin-bottom: ${theme.spacing.sm};
            }
          }
        `}
      >
        <h4>{event.text}</h4>
        <div>
          {event.start.format('LL')}

          {event.end ? (
            // If the event has a duration, check if starts and finishes in the
            // same day. In that case, we'll display a more detailed time format.
            event.start.startOf('day').isSame(event.end?.startOf('day')) ? (
              <>
                <span
                  className={css`
                    margin: 0 ${theme.spacing.sm};
                  `}
                >
                  &middot;
                </span>
                {event.start.format('LT')}&ndash;{event.end.format('LT')}
              </>
            ) : (
              <>&ndash;{event.end.format('LL')}</>
            )
          ) : (
            // Instant event
            event.start.format('LT')
          )}
        </div>
        {!!event.labels?.length && (
          <div>
            {event.labels?.map((label, i) => (
              <Badge key={i} text={label} color={'blue'} />
            ))}
          </div>
        )}
        {event.description && <div>{event.description}</div>}
      </div>
    );
  };

  return (
    <div
      ref={rootRef}
      className={cx(
        styles.root,
        { [styles.weekend]: weekend },
        { [styles.today]: today },
        { [styles.selected]: selected },
        { [styles.outsideInterval]: outsideInterval }
      )}
      onClick={() => {
        setEntryVisible(false);
        setMoreVisible(false);
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
              {selectedEvent && (
                <Tippy
                  maxWidth={500}
                  content={eventSummary(selectedEvent)}
                  placement="auto-start"
                  animation={false}
                  className={styles.tooltip}
                  visible={entryVisible}
                  onClickOutside={hideEntry}
                  interactive={true}
                  appendTo={document.body}
                  trigger="manual"
                  reference={rootRef}
                />
              )}

              {entries.filter((_, i) => i < maxNumEvents)}
              {entries.length - maxNumEvents > 0 && (
                <>
                  <div onClick={showMore} className={styles.moreEntriesLabel}>{`${
                    entries.length - maxNumEvents
                  } more…`}</div>
                  <Tippy
                    maxWidth={500}
                    content={
                      <div>
                        {events
                          .filter((event) => event)
                          .map((event, i) => (
                            <CalendarEntry
                              key={i}
                              event={event}
                              day={day}
                              outsideInterval={outsideInterval}
                              summary={true}
                              onClick={showEntry(event)}
                            />
                          ))}
                      </div>
                    }
                    placement="bottom"
                    animation={false}
                    className={styles.tooltip}
                    visible={moreVisible}
                    onClickOutside={hideMore}
                    interactive={true}
                    appendTo={document.body}
                    reference={rootRef}
                  />
                </>
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
