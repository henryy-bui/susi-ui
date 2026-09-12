import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@susi-ui/react';

export default function PopoverDemo() {
  return (
    <>
      <Popover>
        <PopoverTrigger className="susi-btn">Open popover</PopoverTrigger>
        <PopoverPortal>
          <PopoverContent className="susi-popover" sideOffset={8}>
            <PopoverArrow className="susi-arrow" />
            <p style={{ margin: '0 0 12px' }}>
              Positioned with Floating UI — it flips and shifts to stay on screen.
            </p>
            <PopoverClose className="susi-btn">Close</PopoverClose>
          </PopoverContent>
        </PopoverPortal>
      </Popover>

      <Popover>
        <PopoverTrigger className="susi-btn">Side: right</PopoverTrigger>
        <PopoverPortal>
          <PopoverContent className="susi-popover" side="right" align="start" sideOffset={8}>
            <PopoverArrow className="susi-arrow" />
            Anchored to the right of its trigger.
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </>
  );
}
