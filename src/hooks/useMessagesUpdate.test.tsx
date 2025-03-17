import { renderHook } from '@testing-library/react';

import { useMessagesUpdate } from './useMessagesUpdate';

describe('Use Messages Update', () => {
  it('Should wrap noEventsInRange message with Alert', () => {
    const { result } = renderHook(() => useMessagesUpdate({ messages: { noEventsInRange: 'test message' } as any }));

    const element = result.current.messages.noEventsInRange;

    expect(element).not.toEqual('test message');
    expect(element).toHaveProperty('props');
  });
});
