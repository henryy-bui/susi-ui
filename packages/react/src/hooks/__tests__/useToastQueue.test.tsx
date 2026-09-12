import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useToastQueue } from '../useToastQueue';

interface Message {
  title: string;
}

afterEach(() => vi.useRealTimers());

describe('useToastQueue', () => {
  it('adds toasts and hands back their ids', () => {
    const { result } = renderHook(() => useToastQueue<Message>());

    let id = '';
    act(() => {
      id = result.current.add({ title: 'Saved' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({ id, open: true, data: { title: 'Saved' } });
  });

  it('keeps only the newest toasts up to the limit', () => {
    const { result } = renderHook(() => useToastQueue<Message>({ limit: 2 }));

    act(() => {
      result.current.add({ title: 'one' });
      result.current.add({ title: 'two' });
      result.current.add({ title: 'three' });
    });

    expect(result.current.toasts.map((toast) => toast.data.title)).toEqual(['two', 'three']);
  });

  it('closes a toast first and removes it after the exit delay', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToastQueue<Message>({ removeDelay: 200 }));

    let id = '';
    act(() => {
      id = result.current.add({ title: 'Saved' });
    });
    act(() => result.current.dismiss(id));

    // Still mounted, so it can animate out.
    expect(result.current.toasts[0]?.open).toBe(false);

    act(() => void vi.advanceTimersByTime(200));
    expect(result.current.toasts).toHaveLength(0);
  });

  it('updates and clears', () => {
    const { result } = renderHook(() => useToastQueue<Message>());

    let id = '';
    act(() => {
      id = result.current.add({ title: 'Uploading' });
    });
    act(() => result.current.update(id, { title: 'Uploaded' }));
    expect(result.current.toasts[0]?.data.title).toBe('Uploaded');

    act(() => result.current.clear());
    expect(result.current.toasts).toHaveLength(0);
  });
});
