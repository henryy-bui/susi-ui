import { CodeBlock } from '../components/CodeBlock';
import { Page } from '../components/Layout';
import { PropsTable } from '../components/PropsTable';

const CONTROLLABLE = `const [value, setValue] = useControllableState({
  prop: props.value,           // controlled value, or undefined
  defaultProp: props.defaultValue ?? '',
  onChange: props.onValueChange,
});`;

const DISMISS = `useDismiss({
  enabled: open,
  refs: [contentRef, triggerRef],   // pointer downs in here don't count as outside
  onEscapeKeyDown,                  // consumer can preventDefault()
  onPointerDownOutside,
  onDismiss: () => setOpen(false),
});`;

const MISC = `useEscapeKeydown((event) => close());          // Escape anywhere in the document
useOutsidePointerDown(open, [ref], close);     // pointer down outside these elements
useScrollLock(open);                           // reference counted, scrollbar compensated
useCallbackRef(onChange);                      // stable identity, always the latest function
useIsomorphicLayoutEffect(fn, deps);           // useLayoutEffect that is quiet on the server
useId(props.id);                               // the given id, or a generated stable one`;

export function Hooks() {
  return (
    <Page title="Hooks" lead="Every hook the components use is exported, because your components need the same things.">
      <h2>useControllableState</h2>
      <p>
        The hook that lets one component be both controlled and uncontrolled. In controlled mode it
        never stores state — it calls your handler and renders what you pass.
      </p>
      <CodeBlock code={CONTROLLABLE} />

      <h2>useDismiss</h2>
      <p>Escape plus outside-pointer dismissal, with both cancelable by the consumer.</p>
      <CodeBlock code={DISMISS} />

      <h2>useToastQueue</h2>
      <PropsTable
        rows={[
          { name: 'limit', type: 'number', default: '3', description: 'Maximum toasts kept at once.' },
          { name: 'removeDelay', type: 'number', default: '200', description: 'Delay between dismiss and removal, for exit animations.' },
          { name: 'returns', type: '{ toasts, add, dismiss, update, remove, clear }', description: 'A list you render, and the functions that change it.' },
        ]}
      />

      <h2>useTypeahead</h2>
      <p>
        Type-to-select over a list of elements: characters typed in quick succession build a search
        string, and repeating one character cycles through the items starting with it.
      </p>

      <h2>The rest</h2>
      <CodeBlock code={MISC} />
    </Page>
  );
}
