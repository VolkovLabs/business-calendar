import React from 'react';
import { Messages, Navigate, ToolbarProps } from 'react-big-calendar';
import { Button, ButtonGroup, useStyles2 } from '@grafana/ui';
import { TestIds } from '../../constants';
import { Styles } from './BigToolbar.styles';

/**
 * Properties
 */
interface Props extends ToolbarProps {}

/**
 * Toolbar for Big Calendar
 * @constructor
 */
export const BigToolbar: React.FC<Props> = ({ localizer: { messages }, label, onNavigate, views, view, onView }) => {
  /**
   * Theme
   */
  const styles = useStyles2(Styles);

  /**
   * Render Views
   */
  const renderViews = (messages: Messages) => {
    const viewNames = Array.isArray(views) ? views : [];
    if (!viewNames.length) {
      return null;
    }

    return viewNames.map((name) => (
      <Button
        type="button"
        key={name}
        onClick={() => onView(name)}
        disabled={view === name}
        variant="secondary"
        data-testid={TestIds.bigCalendarToolbar.buttonView(name)}
      >
        {messages[name]}
      </Button>
    ));
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.div}>
        <Button
          type="button"
          onClick={() => onNavigate(Navigate.TODAY)}
          variant="secondary"
          data-testid={TestIds.bigCalendarToolbar.buttonToday}
        >
          {messages.today}
        </Button>

        <ButtonGroup>
          <Button
            type="button"
            className={styles.prev}
            onClick={() => onNavigate(Navigate.PREVIOUS)}
            variant="secondary"
            data-testid={TestIds.bigCalendarToolbar.buttonBack}
            icon="angle-left"
          />
          <Button
            type="button"
            onClick={() => onNavigate(Navigate.NEXT)}
            variant="secondary"
            data-testid={TestIds.bigCalendarToolbar.buttonNext}
            icon="angle-right"
          />
        </ButtonGroup>
      </div>

      <span className={styles.date}>{label}</span>

      <ButtonGroup>{renderViews(messages)}</ButtonGroup>
    </div>
  );
};
