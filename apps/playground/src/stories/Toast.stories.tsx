import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToastQueue,
} from '@susi-ui/react';

const meta = { title: 'Feedback/Toast' } satisfies Meta;
export default meta;

interface Notice {
  title: string;
  description: string;
}

export const Queue: StoryObj = {
  render: function Render() {
    const queue = useToastQueue<Notice>({ limit: 3 });

    return (
      <ToastProvider duration={5000} swipeDirection="right">
        <div className="row">
          <button
            className="btn"
            onClick={() =>
              queue.add({ title: 'Changes saved', description: 'Your project is up to date.' })
            }
          >
            Show toast
          </button>
          <button className="btn" onClick={queue.clear}>
            Clear all
          </button>
        </div>

        {queue.toasts.map((toast) => (
          <Toast
            className="toast"
            key={toast.id}
            open={toast.open}
            onOpenChange={(open) => !open && queue.dismiss(toast.id)}
          >
            <ToastTitle className="toast-title">{toast.data.title}</ToastTitle>
            <ToastDescription className="toast-description">{toast.data.description}</ToastDescription>
            <ToastAction className="btn toast-action" altText="Undo from the History menu">
              Undo
            </ToastAction>
          </Toast>
        ))}

        <ToastViewport className="toast-viewport" />
      </ToastProvider>
    );
  },
};

export const Persistent: StoryObj = {
  name: 'No auto-dismiss',
  render: () => (
    <ToastProvider duration={Infinity}>
      <Toast className="toast">
        <ToastTitle className="toast-title">Connection lost</ToastTitle>
        <ToastDescription className="toast-description">
          Stays until dismissed, because losing this message loses the information.
        </ToastDescription>
        <ToastClose className="btn toast-action" aria-label="Dismiss">
          ×
        </ToastClose>
      </Toast>
      <ToastViewport className="toast-viewport" />
    </ToastProvider>
  ),
};
