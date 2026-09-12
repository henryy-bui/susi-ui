import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@susi-ui/react';

const meta = { title: 'Overlays/Dialog & Popover' } satisfies Meta;
export default meta;

export const Modal: StoryObj = {
  render: () => (
    <Dialog>
      <DialogTrigger className="btn">Delete project</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="overlay" />
        <DialogContent className="dialog">
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            Focus is trapped inside, body scroll is locked, and Escape or an outside click closes it.
          </DialogDescription>
          <div className="dialog-actions">
            <DialogClose className="btn">Cancel</DialogClose>
            <DialogClose className="btn">Delete</DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  ),
};

export const NonModal: StoryObj = {
  name: 'Dialog (non-modal)',
  render: () => (
    <Dialog modal={false}>
      <DialogTrigger className="btn">Open panel</DialogTrigger>
      <DialogPortal>
        <DialogContent className="dialog">
          <DialogTitle>Non-modal</DialogTitle>
          <DialogDescription>The page stays scrollable and focus is not trapped.</DialogDescription>
          <div className="dialog-actions">
            <DialogClose className="btn">Close</DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  ),
};

export const PopoverSides: StoryObj = {
  name: 'Popover (sides)',
  render: () => (
    <div className="row" style={{ padding: 80 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger className="btn">{side}</PopoverTrigger>
          <PopoverPortal>
            <PopoverContent className="popover" side={side} sideOffset={8}>
              <PopoverArrow className="popover-arrow" />
              <p style={{ margin: '0 0 12px' }}>Anchored to the {side}.</p>
              <PopoverClose className="btn">Close</PopoverClose>
            </PopoverContent>
          </PopoverPortal>
        </Popover>
      ))}
    </div>
  ),
};
