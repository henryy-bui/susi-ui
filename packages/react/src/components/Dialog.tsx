import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { Portal, type PortalProps } from '../primitive/Portal';
import { FocusScope } from '../primitive/FocusScope';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useControllableState } from '../hooks/useControllableState';
import { useEscapeKeydown } from '../hooks/useEscapeKeydown';
import { useOutsidePointerDown } from '../hooks/useOutsidePointerDown';
import { useScrollLock } from '../hooks/useScrollLock';
import { useId } from '../hooks/useId';

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  modal: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const [DialogProvider, useDialogContext] = createContext<DialogContextValue>('Dialog');

export interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Modal dialogs lock scroll and trap focus. Set false for a non-modal panel. */
  modal?: boolean;
}

/** An accessible modal dialog: focus trap, scroll lock, Escape and outside dismiss. */
export function Dialog({ children, open: openProp, defaultOpen = false, onOpenChange, modal = true }: DialogProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = useId();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const context = React.useMemo(
    () => ({
      open,
      setOpen: setOpen as (open: boolean) => void,
      contentId: `${baseId}-content`,
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
      modal,
      contentRef,
      triggerRef,
    }),
    [open, setOpen, baseId, modal],
  );

  return <DialogProvider value={context}>{children}</DialogProvider>;
}
Dialog.displayName = 'Dialog';

export interface DialogTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(function DialogTrigger(
  { onClick, ...props },
  forwardedRef,
) {
  const context = useDialogContext('DialogTrigger');
  return (
    <Primitive.button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      data-state={context.open ? 'open' : 'closed'}
      onClick={composeEventHandlers(onClick, () => context.setOpen(true))}
      {...props}
      ref={composeRefs(forwardedRef, context.triggerRef)}
    />
  );
});

export function DialogPortal({ children, container }: PortalProps) {
  const context = useDialogContext('DialogPortal');
  if (!context.open) return null;
  return <Portal container={container}>{children}</Portal>;
}
DialogPortal.displayName = 'DialogPortal';

export interface DialogOverlayProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

/** The backdrop. Purely presentational — dismissal is handled by the content. */
export const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(function DialogOverlay(
  props,
  forwardedRef,
) {
  const context = useDialogContext('DialogOverlay');
  if (!context.open) return null;
  return (
    <Primitive.div data-state={context.open ? 'open' : 'closed'} {...props} ref={forwardedRef} />
  );
});

export interface DialogContentProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { onEscapeKeyDown, onPointerDownOutside, onOpenAutoFocus, onCloseAutoFocus, ...props },
  forwardedRef,
) {
  const context = useDialogContext('DialogContent');
  const open = context.open;

  useScrollLock(open && context.modal);

  useEscapeKeydown((event) => {
    if (!open) return;
    onEscapeKeyDown?.(event);
    if (!event.defaultPrevented) context.setOpen(false);
  });

  useOutsidePointerDown(open, [context.contentRef, context.triggerRef], (event) => {
    onPointerDownOutside?.(event);
    if (!event.defaultPrevented) context.setOpen(false);
  });

  if (!open) return null;

  return (
    <FocusScope
      role="dialog"
      aria-modal={context.modal || undefined}
      id={context.contentId}
      aria-labelledby={context.titleId}
      aria-describedby={context.descriptionId}
      data-state={open ? 'open' : 'closed'}
      trapped={context.modal}
      onMountAutoFocus={onOpenAutoFocus}
      onUnmountAutoFocus={onCloseAutoFocus}
      {...props}
      ref={composeRefs(forwardedRef, context.contentRef)}
    />
  );
});

export interface DialogTitleProps extends React.ComponentPropsWithoutRef<'h3'> {
  asChild?: boolean;
}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  props,
  forwardedRef,
) {
  const context = useDialogContext('DialogTitle');
  return <Primitive.h3 id={context.titleId} {...props} ref={forwardedRef} />;
});

export interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<'p'> {
  asChild?: boolean;
}

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription(props, forwardedRef) {
    const context = useDialogContext('DialogDescription');
    return <Primitive.p id={context.descriptionId} {...props} ref={forwardedRef} />;
  },
);

export interface DialogCloseProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(function DialogClose(
  { onClick, ...props },
  forwardedRef,
) {
  const context = useDialogContext('DialogClose');
  return (
    <Primitive.button
      type="button"
      onClick={composeEventHandlers(onClick, () => context.setOpen(false))}
      {...props}
      ref={forwardedRef}
    />
  );
});
