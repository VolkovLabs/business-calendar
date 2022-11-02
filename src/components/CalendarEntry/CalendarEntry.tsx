import dayjs from 'dayjs';
import React from 'react';
import { css, cx } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, useTheme2 } from '@grafana/ui';
import { CalendarEvent } from '../../types';

/**
 * Properties
 */
interface Props {
  event?: CalendarEvent;
  day: dayjs.Dayjs;
  outsideInterval: boolean;
  summary: boolean;
  onClick?: (e: any) => void;
  quickLinks?: boolean;
}

/**
 * Calendar Entry
 */
export const CalendarEntry = ({ event, day, outsideInterval, summary, onClick, quickLinks }: Props) => {
  const theme = useTheme2().v1;
  const styles = useStyles2(getStyles);

  /**
   * A filler is added to offset entries that started on a day with previously ongoing events.
   */
  const filler = <div className={cx(styles.event, styles.multiDayEvent, styles.filler)}></div>;
  if (!event) {
    return filler;
  }

  const eventStartsToday = (e: CalendarEvent): boolean => e.start.startOf('day').isSame(day);
  const eventEndsToday = (e: CalendarEvent): boolean =>
    e.end ? e.end.startOf('day').isSame(day) : e.end === undefined ? eventStartsToday(e) : false;

  const startOfWeek = day.startOf('day').isSame(day.startOf('isoWeek'));
  const endOfWeek = day.endOf('day').isSame(day.endOf('isoWeek'));
  const startsToday = eventStartsToday(event);
  const endsToday = eventEndsToday(event);

  const firstLink = event.links?.[0];

  const Link = quickLinks ? 'a' : 'div';
  const linkProps = quickLinks
    ? {
        href: firstLink?.href,
        target: firstLink?.target,
        onClick: firstLink?.onClick,
      }
    : {
        onClick: onClick,
      };

  return startsToday && endsToday ? (
    <Link title={event.text} className={cx(styles.event, styles.centerItems)} {...linkProps}>
      <svg
        width={theme.spacing.sm}
        height={theme.spacing.sm}
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        fill={event.color}
        className={css`
          margin-right: ${theme.spacing.xs};
          min-width: ${theme.spacing.sm};
          min-height: ${theme.spacing.sm};
        `}
      >
        <circle cx={5} cy={5} r={5} />
      </svg>
      <div
        className={cx(styles.eventLabel, {
          [css`
            color: ${theme.colors.textFaint};
          `]: outsideInterval,
        })}
      >
        {event.text}
      </div>
    </Link>
  ) : (
    <Link
      title={event.text}
      className={cx(
        styles.event,
        styles.multiDayEvent,
        css`
          background: ${event.color};
        `,
        {
          [styles.startDayStyle]: startOfWeek || startsToday,
          [styles.endDayStyle]: endOfWeek || endsToday,
          [styles.summary]: summary,
        }
      )}
      {...linkProps}
    >
      {/* Only display the event text on the day it starts. */}
      {(startOfWeek || startsToday || summary) && <div className={cx(styles.eventLabel)}>{event.text}</div>}
    </Link>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  event: css`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 1.5rem;
    padding: 0 ${theme.v1.spacing.xs};
    margin-bottom: 1px;

    color: ${theme.colors.text};

    &:hover {
      color: ${theme.v1.colors.textStrong};
      cursor: pointer;
    }
  `,
  eventLabel: css`
    font-size: ${theme.typography.size.base};
    font-weight: ${theme.v1.typography.weight.semibold};
    r-select: none;
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  multiDayEvent: css`
    padding-left: calc(4 * ${theme.v1.spacing.xs});
    color: ${theme.v1.palette.dark5};
    &:hover {
      color: ${theme.v1.palette.black};
      cursor: pointer;
    }
  `,
  centerItems: css`
    display: flex;
    align-items: center;
  `,
  filler: css`
    background: transparent;
    &:hover {
      cursor: initial;
    }
  `,
  startDayStyle: css`
    border-radius: ${theme.v1.border.radius.md} 0 0 ${theme.v1.border.radius.md};
  `,
  endDayStyle: css`
    width: calc(100% - ${theme.v1.spacing.sm});
    border-radius: 0 ${theme.v1.border.radius.md} ${theme.v1.border.radius.md} 0;
  `,
  summary: css`
    width: calc(100% - 2 * ${theme.v1.spacing.xs});
    margin-left: ${theme.v1.spacing.xs};
    border-radius: ${theme.v1.border.radius.lg};
  `,
  tooltip: css`
    min-width: 200px;
    border-radius: ${theme.v1.border.radius.md};
    background-color: ${theme.v1.colors.bg2};
    padding: ${theme.v1.spacing.sm};
    box-shadow: 0px 0px 20px ${theme.v1.colors.dropdownShadow};
  `,
});
