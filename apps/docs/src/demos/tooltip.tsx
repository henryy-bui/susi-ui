import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@susi-ui/react';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

export default function TooltipDemo() {
  return (
    // One provider near the root of your app shares the delay between tooltips
    <TooltipProvider delayDuration={300}>
      {SIDES.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger className="susi-btn">{side}</TooltipTrigger>
          <TooltipPortal>
            <TooltipContent className="susi-tooltip" side={side}>
              <TooltipArrow className="susi-tooltip-arrow" />
              Opens on hover and on keyboard focus.
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      ))}
    </TooltipProvider>
  );
}
