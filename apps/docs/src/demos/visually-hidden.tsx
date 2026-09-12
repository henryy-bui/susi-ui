import { Button, VisuallyHidden } from '@susi-ui/react';

export default function VisuallyHiddenDemo() {
  return (
    <>
      <Button className="susi-btn">
        <VisuallyHidden>Close dialog</VisuallyHidden>
        <span aria-hidden>×</span>
      </Button>
      <span className="state">The button reads as “Close dialog”, but shows only ×.</span>
    </>
  );
}
