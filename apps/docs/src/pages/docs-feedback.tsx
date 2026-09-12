import type { ComponentDoc } from './ComponentPage';
import { COMMON_PROPS } from './ComponentPage';
import ToastDemo from '../demos/toast';
import ProgressDemo from '../demos/progress';
import SeparatorDemo from '../demos/separator';
import VisuallyHiddenDemo from '../demos/visually-hidden';

export const FEEDBACK_DOCS: Record<string, ComponentDoc> = {
  toast: {
    title: 'Toast',
    lead: 'Notifications that dismiss themselves, pause on hover, and can be swiped away.',
    demo: 'toast',
    element: <ToastDemo />,
    anatomy: `import {
  ToastProvider, Toast, ToastTitle, ToastDescription,
  ToastAction, ToastClose, ToastViewport, useToastQueue,
} from '@susi-ui/react';

<ToastProvider duration={5000} swipeDirection="right">
  <Toast open={open} onOpenChange={setOpen}>
    <ToastTitle>Changes saved</ToastTitle>
    <ToastDescription>Your project is up to date.</ToastDescription>
    <ToastAction altText="Undo from the History menu">Undo</ToastAction>
    <ToastClose aria-label="Dismiss">×</ToastClose>
  </Toast>

  {/* Once, near the end of your app */}
  <ToastViewport />
</ToastProvider>`,
    notes: (
      <>
        <p>
          Toasts are declared wherever they make sense and render into the{' '}
          <code>ToastViewport</code>. The viewport is the live region, and it exists before any toast
          does — which is what makes insertions get announced at all.
        </p>
        <p>
          The dismiss timer pauses while the viewport is hovered or holds focus, and resumes with the{' '}
          <em>remaining</em> time rather than a fresh clock. Pass <code>duration={'{Infinity}'}</code>{' '}
          for anything the user must act on.
        </p>
        <p>
          Swiping publishes <code>data-swipe</code> and <code>--susi-toast-swipe-move-x</code> /{' '}
          <code>-y</code>, so the movement is animated by your CSS:
        </p>
        <div className="callout">
          <strong><code>altText</code> is required on an action</strong> — it says how to do the same
          thing without the toast. A toast can vanish before a screen reader user reaches it, so the
          action can never be the only route.
        </div>
        <p>
          Something has to own the list of toasts. <code>useToastQueue</code> is an optional helper
          for exactly that, with a <code>limit</code> and a removal delay so toasts can animate out.
        </p>
      </>
    ),
    props: [
      {
        title: 'ToastProvider',
        rows: [
          { name: 'duration', type: 'number', default: '5000', description: 'Default auto-dismiss time in ms; Infinity disables it.' },
          { name: 'label', type: 'string', default: "'Notifications'", description: 'Accessible name of the viewport region.' },
          { name: 'swipeDirection', type: "'up' | 'down' | 'left' | 'right'", default: "'right'", description: 'Direction that dismisses a toast.' },
          { name: 'swipeThreshold', type: 'number', default: '50', description: 'Distance in px a swipe must travel.' },
        ],
      },
      {
        title: 'ToastViewport',
        rows: [
          { name: 'hotkey', type: 'string[]', default: "['F8']", description: 'Keys that move focus to the viewport.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'Toast',
        rows: [
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'defaultOpen', type: 'boolean', default: 'true', description: 'Initial state when uncontrolled.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it should close — where you remove it from your list.' },
          { name: 'duration', type: 'number', description: 'Overrides the provider’s duration.' },
          { name: 'type', type: "'foreground' | 'background'", default: "'foreground'", description: 'Announce assertively, or wait for a pause.' },
          { name: 'onEscapeKeyDown', type: '(event) => void', description: 'Call preventDefault() to keep it open.' },
          { name: 'onSwipeStart / Move / Cancel / End', type: '(event, delta?) => void', description: 'Swipe lifecycle; preventDefault() on end keeps it open.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'ToastAction',
        rows: [
          { name: 'altText', type: 'string', description: 'Required. How to do this without the toast.' },
          { name: 'keepOpen', type: 'boolean', default: 'false', description: 'Leave the toast open after the action runs.' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'ToastTitle / ToastDescription / ToastClose', rows: COMMON_PROPS },
      {
        title: 'useToastQueue(options)',
        rows: [
          { name: 'limit', type: 'number', default: '3', description: 'Maximum toasts kept; older ones drop off.' },
          { name: 'removeDelay', type: 'number', default: '200', description: 'How long a dismissed toast stays mounted, for its exit animation.' },
          { name: 'returns', type: '{ toasts, add, dismiss, update, remove, clear }', description: 'add() returns the new toast’s id.' },
        ],
      },
    ],
    keyboard: [
      { keys: 'F8', description: 'Moves focus to the toast viewport (configurable).' },
      { keys: 'Tab', description: 'Moves through toasts and their actions once inside.' },
      { keys: 'Escape', description: 'Closes the focused toast.' },
    ],
  },

  progress: {
    title: 'Progress',
    lead: 'Determinate and indeterminate progress, announced as a progressbar.',
    demo: 'progress',
    element: <ProgressDemo />,
    anatomy: `import { Progress, ProgressIndicator } from '@susi-ui/react';

<Progress value={35} getValueLabel={(value, max) => \`\${value} of \${max} uploaded\`}>
  <ProgressIndicator />
</Progress>`,
    notes: (
      <p>
        <code>value={'{null}'}</code> means indeterminate — no <code>aria-valuenow</code>, and{' '}
        <code>data-state="indeterminate"</code> for your animation. Values outside the range are
        clamped. The indicator publishes <code>--susi-progress-percent</code>.
      </p>
    ),
    props: [
      {
        title: 'Progress',
        rows: [
          { name: 'value', type: 'number | null', default: 'null', description: 'Current value, or null for indeterminate.' },
          { name: 'max', type: 'number', default: '100', description: 'Value that means complete.' },
          { name: 'getValueLabel', type: '(value: number, max: number) => string', description: 'Accessible text for the current value.' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'ProgressIndicator', rows: COMMON_PROPS },
    ],
  },

  separator: {
    title: 'Separator',
    lead: 'A divider that is decorative by default, and semantic when it isn’t.',
    demo: 'separator',
    element: <SeparatorDemo />,
    anatomy: `import { Separator } from '@susi-ui/react';

<Separator />
<Separator orientation="vertical" decorative={false} />`,
    notes: (
      <p>
        Most dividers are visual noise to a screen reader, so this one is <code>role="none"</code> by
        default. Pass <code>decorative={'{false}'}</code> when the separation carries meaning — between
        groups in a toolbar, say — and it becomes a real <code>separator</code>.
      </p>
    ),
    props: [
      {
        title: 'Separator',
        rows: [
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Sets data-orientation, and aria-orientation when semantic.' },
          { name: 'decorative', type: 'boolean', default: 'true', description: 'Hide from assistive technology.' },
          ...COMMON_PROPS,
        ],
      },
    ],
  },

  'visually-hidden': {
    title: 'Visually hidden',
    lead: 'Text that screen readers announce and nobody sees.',
    demo: 'visually-hidden',
    element: <VisuallyHiddenDemo />,
    anatomy: `import { VisuallyHidden } from '@susi-ui/react';

<button>
  <VisuallyHidden>Close dialog</VisuallyHidden>
  <span aria-hidden>×</span>
</button>`,
    notes: (
      <p>
        For icon-only buttons, a required <code>DialogTitle</code> you don't want to show, or extra
        context on a link. Unlike <code>display: none</code>, the content stays in the accessibility
        tree. The style object is exported as <code>VISUALLY_HIDDEN_STYLE</code> if you need it
        elsewhere.
      </p>
    ),
    props: [{ title: 'VisuallyHidden', rows: COMMON_PROPS }],
  },
};
