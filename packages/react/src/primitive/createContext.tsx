import * as React from 'react';

/**
 * Creates a strictly-typed context plus a hook that throws a helpful error when
 * a compound part is rendered outside of its root.
 */
export function createContext<ContextValue>(rootName: string) {
  const Context = React.createContext<ContextValue | null>(null);
  Context.displayName = `${rootName}Context`;

  function Provider({ value, children }: { value: ContextValue; children: React.ReactNode }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }
  Provider.displayName = `${rootName}Provider`;

  function useContext(consumerName: string): ContextValue {
    const context = React.useContext(Context);
    if (context === null) {
      throw new Error(`\`${consumerName}\` must be rendered inside \`${rootName}\`.`);
    }
    return context;
  }

  return [Provider, useContext, Context] as const;
}
