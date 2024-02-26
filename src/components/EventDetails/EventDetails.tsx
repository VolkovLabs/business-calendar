import { textUtil } from '@grafana/data';
import { Card, LinkButton, TagList, useStyles2 } from '@grafana/ui';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TestIds } from '../../constants';
import { CalendarEvent } from '../../types';
import { Styles } from './EventDetails.styles';

/**
 * Properties
 */
interface Props {
  /**
   * Event
   */
  event: CalendarEvent;

  /**
   * Show Full Info
   */
  showFullInfo?: boolean;

  /**
   * On Click
   */
  onClick?: (event: unknown) => void;
}

/**
 * Event Details
 * @param event
 * @param showFullInfo
 * @param onClick
 * @constructor
 */
export const EventDetails: React.FC<Props> = ({ event, showFullInfo = true, onClick }) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  /**
   * Translation
   */
  const { t } = useTranslation();

  /**
   * Meta
   */
  const meta = useMemo(() => {
    const location = event.location ? t('eventDetailsDrawer.location', { location: event.location }) : '';

    if (event.end) {
      return [
        `${event.start.format('LLL')} - ${
          event.start.startOf('day').isSame(event.end?.startOf('day'))
            ? event.end.format('LT')
            : event.end.format('LLL')
        }`,
        location,
      ];
    }

    return [`${event.start.format('LLL')}`, location];
  }, [event.end, event.location, event.start, t]);

  /**
   * Tags
   */
  const tags = useMemo(() => event.labels.flatMap((label) => label.split(',')), [event.labels]);

  return (
    <Card onClick={onClick} data-testid={TestIds.eventDetails.root}>
      <Card.Heading aria-label={TestIds.eventDetails.titleButton}>
        <div data-testid={TestIds.eventDetails.titleText}>
          <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" fill={event.color} className={styles.svg}>
            <circle cx={5} cy={5} r={5} />
          </svg>
          {event.text}
        </div>
      </Card.Heading>
      <Card.Meta>{meta}</Card.Meta>
      <Card.Tags>
        <TagList tags={tags} />
      </Card.Tags>
      {showFullInfo && (
        <>
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
                  aria-label={TestIds.eventDetails.link}
                >
                  {link.title}
                </LinkButton>
              ))}
          </Card.Actions>
        </>
      )}
    </Card>
  );
};
