// Every demo's source is read at build time, so the code shown in the docs is
// literally the code running above it.
const sources = import.meta.glob('./*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export function getDemoSource(name: string): string {
  const source = sources[`./${name}.tsx`];
  if (!source) throw new Error(`No demo source found for "${name}".`);
  return source;
}
