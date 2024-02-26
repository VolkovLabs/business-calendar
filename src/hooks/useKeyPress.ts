import { useCallback, useEffect } from 'react';

/**
 * Key Press
 */
export const useKeyPress = (key: string, onKeyPressed: (pressed: boolean) => void) => {
  /**
   * Key down
   */
  const keydownListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        onKeyPressed(true);
      }
    },
    [onKeyPressed]
  );

  /**
   * Key up
   */
  const keyupListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        onKeyPressed(false);
      }
    },
    [onKeyPressed]
  );

  /**
   * Event for Key down
   */
  useEffect(() => {
    window.addEventListener('keydown', keydownListener, true);
    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener]);

  /**
   * Event for Key up
   */
  useEffect(() => {
    window.addEventListener('keyup', keyupListener, true);
    return () => window.removeEventListener('keyup', keyupListener, true);
  }, [keyupListener]);
};
