import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@susi-ui/react';

export default function CollapsibleDemo() {
  return (
    <Collapsible>
      <CollapsibleTrigger className="susi-btn">Show details</CollapsibleTrigger>
      <CollapsibleContent className="susi-accordion-content" style={{ paddingTop: 12 }}>
        The content measures itself and publishes{' '}
        <code>--susi-collapsible-content-height</code>, so it can animate open in CSS.
      </CollapsibleContent>
    </Collapsible>
  );
}
