import React, { ReactNode } from 'react';

import { TEST_IDS } from '../../../constants';

const actual = jest.requireActual('@grafana/ui');

const CardHeading = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const CardMeta = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const CardTags = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const CardDescription = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const CardActions = ({ children }: { children: ReactNode }) => <div>{children}</div>;

export const Card = ({ children }: { children: ReactNode }) => (
  <div className="card" data-testid={TEST_IDS.eventDetails.root}>
    {React.Children.map(children, (child) => {
      return child;
    })}
  </div>
);

Card.Heading = CardHeading;
Card.Meta = CardMeta;
Card.Tags = CardTags;
Card.Description = CardDescription;
Card.Actions = CardActions;

module.exports = {
  ...actual,
  Card,
};
