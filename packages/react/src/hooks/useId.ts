import * as React from 'react';

/** Uses a provided id when there is one, otherwise a stable generated one. */
export function useId(providedId?: string): string {
  const generatedId = React.useId();
  return providedId ?? `susi-${generatedId.replace(/[:«»]/g, '')}`;
}
