import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@susi-ui/react';

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger className="susi-btn">Delete project</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="susi-overlay" />
        <DialogContent className="susi-dialog">
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This removes the project and everything in it. Focus is trapped, scroll is locked, and
            Escape closes.
          </DialogDescription>
          <div className="susi-dialog-actions">
            <DialogClose className="susi-btn">Cancel</DialogClose>
            <DialogClose className="susi-btn">Delete</DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
