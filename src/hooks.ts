import { useCallback, useEffect } from 'react';

export const useKeyPress = (key: string, onKeyPressed: (pressed: boolean) => void) => {
  const keydownListener = useCallback(e => {
    if (e.key === 'Shift') {
      onKeyPressed(true);
    }
  }, []);

  const keyupListener = useCallback(e => {
    if (e.key === 'Shift') {
      onKeyPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keydownListener, true);
    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener]);

  useEffect(() => {
    window.addEventListener('keyup', keyupListener, true);
    return () => window.removeEventListener('keyup', keyupListener, true);
  }, [keydownListener]);
};
