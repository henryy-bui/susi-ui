import {
  Button,
  Toast,
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToastQueue,
} from '@susi-ui/react';

interface Notice {
  title: string;
  description: string;
}

export default function ToastDemo() {
  const queue = useToastQueue<Notice>({ limit: 3 });

  return (
    <ToastProvider duration={5000} swipeDirection="right">
      <Button
        className="susi-btn"
        onClick={() => queue.add({ title: 'Changes saved', description: 'Your project is up to date.' })}
      >
        Show toast
      </Button>
      <Button className="susi-btn" onClick={queue.clear}>
        Clear all
      </Button>
      <span className="state">Hover to pause · swipe right to dismiss · F8 focuses the viewport</span>

      {queue.toasts.map((toast) => (
        <Toast
          className="susi-toast"
          key={toast.id}
          open={toast.open}
          onOpenChange={(open) => !open && queue.dismiss(toast.id)}
        >
          <ToastTitle className="susi-toast-title">{toast.data.title}</ToastTitle>
          <ToastDescription className="susi-toast-description">{toast.data.description}</ToastDescription>
          <ToastAction className="susi-btn susi-toast-action" altText="Undo from the History menu">
            Undo
          </ToastAction>
        </Toast>
      ))}

      {/* Put the viewport once, near the end of your app */}
      <ToastViewport className="susi-toast-viewport" />
    </ToastProvider>
  );
}
