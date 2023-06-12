import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React from 'react';
import { textUtil } from '@grafana/data';
import { Card, Drawer, LinkButton, Tab, TabsBar, TagList, useStyles2 } from '@grafana/ui';
import { TestIds } from '../../constants';
import { Styles } from '../../styles';
import { CalendarEvent } from '../../types';

/**
 * Day.js Plugins
 * - https://day.js.org/docs/en/plugin/localized-format
 */
dayjs.extend(localizedFormat);

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
export const DayDrawer: React.FC<Props> = ({ day, events, event, setEvent, onClose }) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  if (!day) {
    return (
      <Drawer title="Day" scrollableContent onClose={onClose}>
        Events not found.
      </Drawer>
    );
  }

  /**
   * Events
   */
  const dayEvents = events[day.format('YYYY-MM-DD')].filter((event) => event !== undefined) ?? [];

  /**
   * Meta
   */
  const meta = (event: CalendarEvent) => {
    if (event.end) {
      return `${event.start.format('LLL')} - ${
        event.start.startOf('day').isSame(event.end?.startOf('day')) ? event.end.format('LT') : event.end.format('LLL')
      }`;
    }

    return `${event.start.format('LLL')}`;
  };

  /**
   * Svg
   */
  const heading = (event: CalendarEvent) => (
    <div data-testid={TestIds.dayDrawer.eventTitle}>
      <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" fill={event.color} className={styles.event.svg}>
        <circle cx={5} cy={5} r={5} />
      </svg>
      {event.text}
    </div>
  );

  /**
   * Tabs
   */
  const tabs = (
    <TabsBar>
      <Tab label={'All Events'} active={!event} onChangeTab={() => setEvent(undefined)} counter={dayEvents.length} />
      {event && <Tab label={event.text} active={!!event} />}
    </TabsBar>
  );

  /**
   * Tags
   */
  const tags = (labels: string[]) => labels.flatMap((label) => label.split(','));

  /**
   * Return
   */
  return (
    <Drawer title={day.format('LL')} tabs={tabs} subtitle={day.format('dddd')} scrollableContent onClose={onClose}>
      {event && (
        <Card data-testid={TestIds.dayDrawer.event}>
          <Card.Heading>{heading(event)}</Card.Heading>
          <Card.Meta>{meta(event)}</Card.Meta>
          <Card.Tags>
            <TagList tags={tags(event.labels)} />
          </Card.Tags>
          <Card.Description>
            {event.description && <p dangerouslySetInnerHTML={{ __html: textUtil.sanitize(event.description) }} />}
          </Card.Description>
          <Card.Actions>
            {event.links
              ?.filter((link) => link.href)
              .map((link, index) => (
                <LinkButton
                  key={index}
                  icon={link.target === '_self' ? 'link' : 'external-link-alt'}
                  href={link.href}
                  target={link.target}
                  variant={'secondary'}
                  onClick={link.onClick}
                  aria-label={TestIds.dayDrawer.eventLink}
                >
                  {link.title}
                </LinkButton>
              ))}
          </Card.Actions>
        </Card>
      )}

      {!event && (
        <>
          {dayEvents.map((event, i) => {
            if (!event) {
              return;
            }

            return (
              <Card key={i} onClick={() => setEvent(event)} data-testid={TestIds.dayDrawer.dayEvent}>
                <Card.Heading aria-label={TestIds.dayDrawer.dayEventTitle}>{heading(event)}</Card.Heading>
                <Card.Meta>{meta(event)}</Card.Meta>
                <Card.Tags>
                  <TagList tags={tags(event.labels)} />
                </Card.Tags>
              </Card>
            );
          })}
        </>
      )}
    </Drawer>
  );
};
