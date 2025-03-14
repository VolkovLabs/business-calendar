import { css } from '@emotion/css';
import { Alert, useTheme2 } from '@grafana/ui';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import { BigMessages } from 'types';

/**
 * Use Update Messages
 * In the future it will allow to extend and support logic for changing messages and text under different conditions
 * Allows not to extend and mix logic in useLocalizer
 */
export const useMessagesUpdate = ({ messages }: { messages: BigMessages }) => {
  const theme = useTheme2();

  return useMemo(
    () => ({
      messages: {
        ...messages,
        noEventsInRange: (
          <div
            className={css`
              padding: ${theme.spacing(1)};
            `}
          >
            <Alert title={t('localizerMessages.event')} severity="info">
              {t('localizerMessages.noEventsInRange')}
            </Alert>
          </div>
        ),
      },
    }),
    [messages, theme]
  );
};
