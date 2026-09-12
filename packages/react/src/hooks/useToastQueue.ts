import * as React from 'react';

export interface QueuedToast<Data> {
  id: string;
  data: Data;
  /** Flipped to false on dismiss, so the toast can animate out before removal. */
  open: boolean;
}

export interface UseToastQueueOptions {
  /** Oldest toasts beyond this are dropped as new ones arrive. */
  limit?: number;
  /** How long to keep a dismissed toast mounted for its exit animation, in ms. */
  removeDelay?: number;
}

export interface ToastQueue<Data> {
  toasts: Array<QueuedToast<Data>>;
  /** Adds a toast and returns its id. */
  add: (data: Data) => string;
  /** Marks a toast closed; it is removed after `removeDelay`. */
  dismiss: (id: string) => void;
  update: (id: string, data: Partial<Data>) => void;
  /** Removes a toast immediately, skipping the exit delay. */
  remove: (id: string) => void;
  clear: () => void;
}

let counter = 0;

/**
 * Optional state helper for the common case: a list of toasts you push to from
 * anywhere and render inside a `ToastViewport`. The components work fine
 * without it — this just saves rebuilding the queue in every project.
 */
export function useToastQueue<Data>({
  limit = 3,
  removeDelay = 200,
}: UseToastQueueOptions = {}): ToastQueue<Data> {
  const [toasts, setToasts] = React.useState<Array<QueuedToast<Data>>>([]);
  const timersRef = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());

  React.useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  const remove = React.useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const add = React.useCallback(
    (data: Data) => {
      const id = `toast-${++counter}`;
      setToasts((prev) => [...prev, { id, data, open: true }].slice(-limit));
      return id;
    },
    [limit],
  );

  const dismiss = React.useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)),
      );
      if (timersRef.current.has(id)) return;
      timersRef.current.set(id, setTimeout(() => remove(id), removeDelay));
    },
    [remove, removeDelay],
  );

  const update = React.useCallback((id: string, data: Partial<Data>) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, data: { ...toast.data, ...data } } : toast)),
    );
  }, []);

  const clear = React.useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
    setToasts([]);
  }, []);

  return { toasts, add, dismiss, update, remove, clear };
}
