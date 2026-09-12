import * as React from 'react';

/**
 * Type-to-select over a list of items, the way native selects and menus behave:
 * characters typed in quick succession build a search string, and repeating a
 * single character cycles through the items starting with it.
 */
export function useTypeahead(timeout = 1000) {
  const searchRef = React.useRef('');
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return React.useCallback(
    (char: string, items: HTMLElement[], currentIndex: number): HTMLElement | undefined => {
      if (timerRef.current) clearTimeout(timerRef.current);
      searchRef.current += char.toLowerCase();
      timerRef.current = setTimeout(() => {
        searchRef.current = '';
      }, timeout);

      const search = searchRef.current;
      const isRepeat = search.length > 1 && search.split('').every((c) => c === search[0]);
      const needle = isRepeat ? search[0]! : search;
      // On a repeated character, start looking after the current item.
      const start = isRepeat ? currentIndex + 1 : currentIndex === -1 ? 0 : currentIndex;
      const ordered = [...items.slice(start), ...items.slice(0, start)];

      return ordered.find((item) =>
        (item.textContent ?? '').trim().toLowerCase().startsWith(needle),
      );
    },
    [timeout],
  );
}
