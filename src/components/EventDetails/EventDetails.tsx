import { textUtil } from '@grafana/data';
import { Card, LinkButton, TagList, useStyles2 } from '@grafana/ui';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TEST_IDS } from '../../constants';
import { CalendarEvent, EventField } from '../../types';
import { displayTime, isFieldVisible } from '../../utils';
import { getStyles } from './EventDetails.styles';

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

  /**
   * Fields
   *
   * @type {EventField[]}
   */
  fields: EventField[];

  /**
   * Fields
   *
   * @type {string}
   */
  locationLabel: string;

  /**
   * Preformatted Description
   *
   * @type {boolean}
   */
  preformattedDescription?: boolean;

  /**
   * is Event Details use for tooltip displaying
   *
   * @type {boolean}
   */
  isForTooltip: boolean;
}

/**
 * Event Details
 */
export const EventDetails: React.FC<Props> = ({
  event,
  showFullInfo = true,
  onClick,
  locationLabel,
  fields,
  preformattedDescription,
  isForTooltip,
}) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Translation
   */
  const { t } = useTranslation();

  /**
   * Meta
   */
  const meta = useMemo(() => {
    /**
     * Location text
     */
    const location =
      isFieldVisible(EventField.LOCATION, fields) && event.location
        ? locationLabel.trim()
          ? `${locationLabel} ${event.location}`
          : t('eventDetailsDrawer.location', { location: event.location })
        : '';

    let time = '';

    if (isFieldVisible(EventField.TIME, fields)) {
      time = displayTime(event);
    }
    return [time, location];
  }, [event, fields, locationLabel, t]);

  /**
   * Tags
   */
  const tags = useMemo(() => event.labels.flatMap((label) => label.split(',')), [event.labels]);

  /**
   * Action links
   */
  const actionLinks = useMemo(() => event.links?.filter((link) => link.href), [event.links]);

  return (
    <>
      <Card onClick={onClick} data-testid={TEST_IDS.eventDetails.root}>
        <Card.Heading aria-label={TEST_IDS.eventDetails.titleButton}>
          <div data-testid={TEST_IDS.eventDetails.titleText}>
            <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" fill={event.color} className={styles.svg}>
              <circle cx={5} cy={5} r={5} />
            </svg>
            {isFieldVisible(EventField.TEXT, fields) && event.text}
          </div>
        </Card.Heading>
        <Card.Meta>{meta}</Card.Meta>
        {isFieldVisible(EventField.LABELS, fields) && !isForTooltip && (
          <Card.Tags>
            <TagList tags={tags} className={styles.labels} />
          </Card.Tags>
        )}

        {showFullInfo && !!actionLinks?.length && (
          <Card.Actions>
            {isFieldVisible(EventField.LINKS, fields) &&
              actionLinks.map((link, index) => (
                <LinkButton
                  key={index}
                  href={link.href}
                  target={link.target}
                  variant={'secondary'}
                  onClick={link.onClick}
                  aria-label={TEST_IDS.eventDetails.link}
                >
                  {link.title}
                </LinkButton>
              ))}
          </Card.Actions>
        )}
      </Card>
      {isFieldVisible(EventField.LABELS, fields) && isForTooltip && (
        <TagList tags={tags} className={styles.labelsTooltip} />
      )}
      {showFullInfo &&
        isFieldVisible(EventField.DESCRIPTION, fields) &&
        event.description &&
        event.description.map((description, index) => {
          if (preformattedDescription) {
            return (
              <pre
                key={description}
                className={isForTooltip ? styles.descriptionTooltip : styles.description}
                data-testid={TEST_IDS.eventDetails.preformatted(index)}
              >
                {textUtil.sanitize(description)}
              </pre>
            );
          }
          return (
            <p
              key={description}
              data-testid={TEST_IDS.eventDetails.description(index)}
              className={isForTooltip ? styles.descriptionTooltip : styles.description}
              dangerouslySetInnerHTML={{ __html: textUtil.sanitize(description) }}
            />
          );
        })}
    </>
  );
};
