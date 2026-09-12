import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@susi-ui/react';

export default function AsChildDemo() {
  return (
    <>
      {/* A link that carries the Button's behaviour */}
      <Button className="susi-btn" asChild>
        <a href="https://example.com">Anchor</a>
      </Button>

      {/* Two components merged onto one element: the trigger renders the Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="susi-btn">Open dialog</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="susi-overlay" />
          <DialogContent className="susi-dialog">
            <DialogTitle>One element, two components</DialogTitle>
            <DialogDescription>
              The trigger merged its props onto the Button instead of wrapping it in another element.
            </DialogDescription>
            <div className="susi-dialog-actions">
              <DialogClose asChild>
                <Button className="susi-btn">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
