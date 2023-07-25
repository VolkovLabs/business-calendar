import React from 'react';
import { Messages, Navigate, ToolbarProps } from 'react-big-calendar';
import { Button, ButtonGroup, useStyles2 } from '@grafana/ui';
import { TestIds } from '../../constants';
import { Styles } from '../BigCalendar/styles';

/**
 * Properties
 */
interface Props extends ToolbarProps {}

/**
 * Toolbar for Big Calendar
 * @constructor
 */
export const Toolbar: React.FC<Props> = ({ localizer: { messages }, label, onNavigate, views, view, onView }) => {
  /**
   * Theme
   */
  const styles = useStyles2(Styles);

  /**
   * Render Views
   */
  const renderViews = (messages: Messages) => {
    const viewNames = Array.isArray(views) ? views : [];

    if (viewNames.length > 1) {
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
    }
    return null;
  };

  return (
    <div className={styles.toolbar}>
      <ButtonGroup>
        <Button
          type="button"
          onClick={() => onNavigate(Navigate.TODAY)}
          variant="secondary"
          data-testid={TestIds.bigCalendarToolbar.buttonToday}
        >
          {messages.today}
        </Button>
        <Button
          type="button"
          onClick={() => onNavigate(Navigate.PREVIOUS)}
          variant="secondary"
          data-testid={TestIds.bigCalendarToolbar.buttonBack}
        >
          {messages.previous}
        </Button>
        <Button
          type="button"
          onClick={() => onNavigate(Navigate.NEXT)}
          variant="secondary"
          data-testid={TestIds.bigCalendarToolbar.buttonNext}
        >
          {messages.next}
        </Button>
      </ButtonGroup>

      <span>{label}</span>

      <ButtonGroup>{renderViews(messages)}</ButtonGroup>
    </div>
  );
};
