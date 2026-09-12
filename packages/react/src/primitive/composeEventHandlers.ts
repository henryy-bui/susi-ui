/**
 * Calls the consumer handler first, then our internal handler unless the
 * consumer called `event.preventDefault()` (opt out with `checkForDefaultPrevented: false`).
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  theirHandler: ((event: E) => void) | undefined,
  ourHandler: (event: E) => void,
  { checkForDefaultPrevented = true }: { checkForDefaultPrevented?: boolean } = {},
) {
  return function handleEvent(event: E) {
    theirHandler?.(event);
    if (!checkForDefaultPrevented || !event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
