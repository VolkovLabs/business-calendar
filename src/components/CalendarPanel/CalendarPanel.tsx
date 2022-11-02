import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import { toTimeField } from 'grafana-plugin-support';
import { useIntervalSelection } from 'hooks';
import React, { useRef, useState } from 'react';
import { css, cx } from '@emotion/css';
import { classicColors, FieldType, GrafanaTheme2, PanelProps, textUtil } from '@grafana/data';
import { Badge, Button, Drawer, HorizontalGroup, Icon, LinkButton, useStyles2, useTheme2 } from '@grafana/ui';
import { alignEvents } from '../../alignEvents';
import { CalendarEvent, CalendarOptions } from '../../types';
import { CalendarEntry } from '../CalendarEntry';
import { Day } from '../Day/Day';

dayjs.extend(isoWeek);
dayjs.extend(utc);

/**
 * Properties
 */
interface Props extends PanelProps<CalendarOptions> {}

/**
 * Calendar Panel
 */
export const CalendarPanel: React.FC<Props> = ({ options, data, timeRange, width, height, onChangeTimeRange }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const [selectedInterval, clearSelection, onTimeSelection] = useIntervalSelection();

  const [drawerProps, setDrawerProps] = useState<Record<string, any>>();

  const frames = data.series.map((frame) => ({
    text: options.textField
      ? frame.fields.find((f) => f.name === options.textField)
      : frame.fields.find((f) => f.type === FieldType.string),
    description: frame.fields.find((f) => f.name === options.descriptionField),
    start: toTimeField(
      options.timeField
        ? frame.fields.find((f) => f.name === options.timeField)
        : frame.fields.find((f) => f.type === FieldType.time)
    ),
    // No default for end time. If end time dimension isn't set, we assume that all events are instants.
    end: toTimeField(frame.fields.find((f) => f.name === options.endTimeField)),
    labels: frame.fields.filter((f) => options.labelFields?.includes(f.name)),
  }));

  const ref = useRef<HTMLDivElement>(null);

  if (ref.current && options.autoScroll) {
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }

  const from = dayjs(timeRange.from.valueOf());
  const to = dayjs(timeRange.to.valueOf());
  const startOfWeek = from.startOf('isoWeek');
  const endOfWeek = to.endOf('isoWeek');
  const numDays = endOfWeek.diff(startOfWeek, 'days');

  const colors = classicColors ?? legacyClassicColors;

  const events = frames.flatMap((frame, frameIdx) => {
    return frame.text && frame.start
      ? Array.from({ length: frame.text.values.length })
          .map((_, i) => ({
            text: frame.text?.values.get(i),
            description: frame.description?.values.get(i),
            start: frame.start?.values.get(i),
            end: frame.end?.values.get(i),
            labels: frame.labels?.map((field) => field.values.get(i)).filter((label) => label),
            links: frame.text?.getLinks!({ valueRowIndex: i }),
          }))
          .map<CalendarEvent>(({ text, description, labels, links, start, end }, i) => ({
            text,
            description,
            labels,
            start: dayjs(start),
            color: colors[Math.floor(frameIdx % colors.length)],
            links,

            // Set undefined if the user hasn't explicitly configured the dimension
            // for end time.
            //
            // Set end time to the end of the time interval if the user configured the
            // end time dimension, but it's missing values. The panel interpretes
            // this as an open interval.
            end: frame.end ? (end ? dayjs(end) : endOfWeek) : undefined,
          }))
      : [];
  });

  const alignedEvents = alignEvents(events);

  const drawerShowDay = (day: dayjs.Dayjs, isOutsideInterval: boolean) => {
    const events = alignedEvents[day.format('YYYY-MM-DD')] ?? [];

    setDrawerProps({
      title: day.format('LL'),
      subtitle: day.format('dddd'),
      children: (
        <div>
          {events
            .filter((event) => event)
            .map((event, i) => (
              <CalendarEntry
                key={i}
                event={event}
                day={day}
                outsideInterval={isOutsideInterval}
                summary={true}
                onClick={() => {
                  if (event) {
                    drawerShowEvent(day, event, isOutsideInterval);
                  }
                }}
              />
            ))}
        </div>
      ),
    });
  };

  const drawerShowEvent = (day: dayjs.Dayjs, event: CalendarEvent, isOutsideInterval: boolean) => {
    setDrawerProps({
      title: event.text,
      subtitle: formatEventInterval(event),
      children: (
        <>
          <Button fill={'text'} onClick={() => drawerShowDay(day, isOutsideInterval)}>
            <Icon name="angle-left" />
            Back to {day.format('LL')}
          </Button>
          {!!event.labels?.length && (
            <div
              className={css`
                margin: ${theme.v1.spacing.sm} 0;
              `}
            >
              {event.labels?.map((label, i) => (
                <Badge key={i} text={label} color={'blue'} />
              ))}
            </div>
          )}
          {event.description && <p dangerouslySetInnerHTML={{ __html: textUtil.sanitize(event.description) }} />}
          <HorizontalGroup>
            {event.links?.map((link, index) => (
              <LinkButton
                key={index}
                icon={link.target === '_self' ? 'link' : 'external-link-alt'}
                href={link.href}
                target={link.target}
                variant={'secondary'}
                onClick={link.onClick}
              >
                {link.title}
              </LinkButton>
            ))}
          </HorizontalGroup>
        </>
      ),
    });
  };

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
      {drawerProps && (
        <Drawer
          scrollableContent={true}
          inline={true}
          expandable={true}
          onClose={() => setDrawerProps(undefined)}
          {...drawerProps}
        >
          {drawerProps.children}
        </Drawer>
      )}
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
            Apply time range
          </Button>
        </div>
      )}

      {/* Header displaying the weekdays */}
      <div className={styles.weekdayContainer}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={styles.weekdayLabel}>
            {dayjs().startOf('isoWeek').add(i, 'days').format('ddd')}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div
        ref={ref}
        className={cx(
          styles.calendarContainer,
          css`
            grid-auto-rows: ${Math.max(100 / Math.ceil(numDays / 7), 20)}%;
          `
        )}
      >
        {Array.from({ length: numDays + 1 }).map((_, i) => {
          const day = dayjs(startOfWeek.valueOf()).startOf('day').add(i, 'days');

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
          const entries = events.map<CalendarEvent | undefined>((event) =>
            event ? { ...event, color: event.color } : undefined
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
              onShowEvent={(event) => drawerShowEvent(day, event, isOutsideInterval)}
              onShowMore={() => drawerShowDay(day, isOutsideInterval)}
              quickLinks={!!options.quickLinks}
            />
          );
        })}
      </div>
    </div>
  );
};

const formatEventInterval = (event: CalendarEvent): string => {
  if (event.end) {
    if (event.start.startOf('day').isSame(event.end?.startOf('day'))) {
      return `${event.start.format('LLL')}–${event.end.format('LT')}`;
    }
    return `${event.start.format('LLL')}–${event.end.format('LLL')}`;
  }
  return `${event.start.format('LLL')}`;
};

const getStyles = (theme: GrafanaTheme2) => ({
  applyIntervalButton: css`
    position: absolute;
    bottom: 0;
    right: 0;
    padding: ${theme.v1.spacing.sm};
    z-index: 1000;
  `,
  weekdayContainer: css`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    font-size: ${theme.typography.size.md};
    font-weight: ${theme.v1.typography.weight.regular};
    border-bottom: 1px solid ${theme.v1.colors.border2};
  `,
  weekdayLabel: css`
    text-align: right;
    padding: ${theme.v1.spacing.xxs} ${theme.v1.spacing.xs};
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
});

// For Grafana versions older than 7.3.0.
export const legacyClassicColors = [
  '#7EB26D', // 0: pale green
  '#EAB839', // 1: mustard
  '#6ED0E0', // 2: light blue
  '#EF843C', // 3: orange
  '#E24D42', // 4: red
  '#1F78C1', // 5: ocean
  '#BA43A9', // 6: purple
  '#705DA0', // 7: violet
  '#508642', // 8: dark green
  '#CCA300', // 9: dark sand
  '#447EBC',
  '#C15C17',
  '#890F02',
  '#0A437C',
  '#6D1F62',
  '#584477',
  '#B7DBAB',
  '#F4D598',
  '#70DBED',
  '#F9BA8F',
  '#F29191',
  '#82B5D8',
  '#E5A8E2',
  '#AEA2E0',
  '#629E51',
  '#E5AC0E',
  '#64B0C8',
  '#E0752D',
  '#BF1B00',
  '#0A50A1',
  '#962D82',
  '#614D93',
  '#9AC48A',
  '#F2C96D',
  '#65C5DB',
  '#F9934E',
  '#EA6460',
  '#5195CE',
  '#D683CE',
  '#806EB7',
  '#3F6833',
  '#967302',
  '#2F575E',
  '#99440A',
  '#58140C',
  '#052B51',
  '#511749',
  '#3F2B5B',
  '#E0F9D7',
  '#FCEACA',
  '#CFFAFF',
  '#F9E2D2',
  '#FCE2DE',
  '#BADFF4',
  '#F9D9F9',
  '#DEDAF7',
];
