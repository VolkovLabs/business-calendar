import dayjs from 'dayjs';
import React from 'react';
import { css } from '@emotion/css';
import { textUtil } from '@grafana/data';
import { Badge, Button, Drawer, HorizontalGroup, Icon, LinkButton, useTheme2 } from '@grafana/ui';
import { CalendarEvent } from '../../types';
import { CalendarEntry } from '../CalendarEntry';

/**
 * Properties
 */
interface Props {
  /**
   * Day
   */
  day: dayjs.Dayjs | undefined;

  /**
   * Aligned Events
   */
  events: Record<string, Array<CalendarEvent | undefined>>;

  /**
   * Event
   */
  event: CalendarEvent | undefined;

  /**
   * Set Event handler
   */
  setEvent: any;

  /**
   * OnClose Event handler
   */
  onClose: any;
}

/**
 * Day Drawer
 */
export const DayDrawer = ({ day, events, event, setEvent, onClose }: Props) => {
  const theme = useTheme2();

  if (!day) {
    return (
      <Drawer title="Day" scrollableContent={true} onClose={onClose}>
        Events not found.
      </Drawer>
    );
  }

  /**
   * Day
   */
  let title = day.format('LL');
  let subtitle = day.format('dddd');

  /**
   * Events
   */
  const dayEvents = events[day.format('YYYY-MM-DD')] ?? [];
  let children = (
    <div>
      {dayEvents
        .filter((event) => event)
        .map((event, i) => (
          <CalendarEntry
            key={i}
            event={event}
            day={day}
            outsideInterval={false}
            summary={true}
            onClick={() => {
              setEvent(event);
            }}
          />
        ))}
    </div>
  );

  /**
   * Event
   */
  if (event) {
    title = event.text;

    /**
     * Subtitle
     */
    subtitle = `${event.start.format('LLL')}`;
    if (event.end) {
      if (event.start.startOf('day').isSame(event.end?.startOf('day'))) {
        subtitle = `${event.start.format('LLL')} - ${event.end.format('LT')}`;
      }

      subtitle = `${event.start.format('LLL')} - ${event.end.format('LLL')}`;
    }

    children = (
      <>
        <Button fill={'text'} onClick={() => setEvent(undefined)}>
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
    );
  }

  /**
   * Return
   */
  return (
    <Drawer title={title} subtitle={subtitle} scrollableContent={true} onClose={onClose}>
      {children}
    </Drawer>
  );
};
