import type { ComponentDoc } from './ComponentPage';
import { COMMON_PROPS } from './ComponentPage';
import ButtonDemo from '../demos/button';
import ToggleDemo from '../demos/toggle';
import CheckboxDemo from '../demos/checkbox';
import SwitchDemo from '../demos/switch';
import RadioGroupDemo from '../demos/radio-group';
import SliderDemo from '../demos/slider';

export const CONTROL_DOCS: Record<string, ComponentDoc> = {
  button: {
    title: 'Button',
    lead: 'A button that defaults to type="button" and stays inert while loading.',
    demo: 'button',
    element: <ButtonDemo />,
    anatomy: `import { Button } from '@susi-ui/react';

<Button loading={saving} onClick={save}>
  Save
</Button>`,
    notes: (
      <p>
        The native <code>type</code> of a button inside a form is <code>submit</code>, which submits
        forms by accident more often than it helps. This one defaults to <code>button</code>; pass{' '}
        <code>type="submit"</code> when you mean it. With <code>asChild</code> the element can't be
        disabled natively, so <code>aria-disabled</code> is set and clicks are prevented instead.
      </p>
    ),
    props: [
      {
        title: 'Button',
        rows: [
          { name: 'loading', type: 'boolean', default: 'false', description: 'Blocks activation and sets aria-busy and data-loading.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Standard disabled state; also sets data-disabled.' },
          { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Overridable; defaults away from submit.' },
          ...COMMON_PROPS,
        ],
      },
    ],
  },

  toggle: {
    title: 'Toggle',
    lead: 'A two-state button — bold in a toolbar, a filter that stays pressed.',
    demo: 'toggle',
    element: <ToggleDemo />,
    anatomy: `import { Toggle } from '@susi-ui/react';

<Toggle pressed={bold} onPressedChange={setBold}>
  Bold
</Toggle>`,
    notes: (
      <p>
        Use a toggle when the button itself stays pressed. For an option in a form, use a{' '}
        <code>Checkbox</code> or <code>Switch</code> so it is announced as one.
      </p>
    ),
    props: [
      {
        title: 'Toggle',
        rows: [
          { name: 'pressed', type: 'boolean', description: 'Controlled pressed state.' },
          { name: 'defaultPressed', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
          { name: 'onPressedChange', type: '(pressed: boolean) => void', description: 'Called whenever the state should change.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the toggle.' },
          ...COMMON_PROPS,
        ],
      },
    ],
    keyboard: [
      { keys: 'Enter, Space', description: 'Toggles the pressed state.' },
    ],
  },

  checkbox: {
    title: 'Checkbox',
    lead: 'A checkbox that can also be indeterminate — the state a native input can only reach from JavaScript.',
    demo: 'checkbox',
    element: <CheckboxDemo />,
    anatomy: `import { Checkbox, CheckboxIndicator } from '@susi-ui/react';

<Checkbox checked={checked} onCheckedChange={setChecked} name="terms">
  <CheckboxIndicator>✓</CheckboxIndicator>
</Checkbox>`,
    notes: (
      <p>
        Clicking an indeterminate checkbox resolves it to <code>true</code>. Inside a{' '}
        <code>&lt;form&gt;</code> with a <code>name</code>, a visually hidden input mirrors the value
        so native submission and form resets keep working.
      </p>
    ),
    props: [
      {
        title: 'Checkbox',
        rows: [
          { name: 'checked', type: "boolean | 'indeterminate'", description: 'Controlled checked state.' },
          { name: 'defaultChecked', type: "boolean | 'indeterminate'", default: 'false', description: 'Initial state when uncontrolled.' },
          { name: 'onCheckedChange', type: '(checked: CheckedState) => void', description: 'Called whenever the state should change.' },
          { name: 'name', type: 'string', description: 'Renders a hidden input for form submission.' },
          { name: 'value', type: 'string', default: "'on'", description: 'Value submitted when checked.' },
          { name: 'required', type: 'boolean', description: 'Marks the control required, on both the button and the hidden input.' },
          { name: 'disabled', type: 'boolean', description: 'Disables the checkbox.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'CheckboxIndicator',
        rows: [
          { name: 'forceMount', type: 'boolean', default: 'false', description: 'Render even when unchecked, for exit animations.' },
          ...COMMON_PROPS,
        ],
      },
    ],
    keyboard: [
      { keys: 'Space', description: 'Toggles the checkbox.' },
      { keys: 'Enter', description: 'Does nothing, matching native checkboxes (it will not submit the form).' },
    ],
  },

  switch: {
    title: 'Switch',
    lead: 'An on/off control that applies immediately, announced as a switch.',
    demo: 'switch',
    element: <SwitchDemo />,
    anatomy: `import { Switch, SwitchThumb } from '@susi-ui/react';

<Switch defaultChecked name="wifi">
  <SwitchThumb />
</Switch>`,
    notes: (
      <p>
        Reach for a switch when the change takes effect at once, and a checkbox when it is part of a
        form the user will submit later.
      </p>
    ),
    props: [
      {
        title: 'Switch',
        rows: [
          { name: 'checked', type: 'boolean', description: 'Controlled state.' },
          { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
          { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called whenever the state should change.' },
          { name: 'name', type: 'string', description: 'Renders a hidden input for form submission.' },
          { name: 'value', type: 'string', default: "'on'", description: 'Value submitted when checked.' },
          { name: 'disabled', type: 'boolean', description: 'Disables the switch.' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'SwitchThumb', rows: COMMON_PROPS },
    ],
    keyboard: [{ keys: 'Enter, Space', description: 'Toggles the switch.' }],
  },

  'radio-group': {
    title: 'Radio group',
    lead: 'One choice from a set, with the keyboard behaviour the radio pattern requires.',
    demo: 'radio-group',
    element: <RadioGroupDemo />,
    anatomy: `import { RadioGroup, RadioGroupItem, RadioGroupIndicator } from '@susi-ui/react';

<RadioGroup value={plan} onValueChange={setPlan} name="plan">
  <RadioGroupItem value="pro">
    <RadioGroupIndicator />
  </RadioGroupItem>
</RadioGroup>`,
    notes: (
      <p>
        Arrows move <em>and</em> select — that is the pattern, not a shortcut. The group holds a
        single tab stop: Tab moves into the checked item (or the first one when nothing is checked)
        and out again, rather than through every option.
      </p>
    ),
    props: [
      {
        title: 'RadioGroup',
        rows: [
          { name: 'value', type: 'string', description: 'Controlled selected value.' },
          { name: 'defaultValue', type: 'string', description: 'Initial value when uncontrolled.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selection should change.' },
          { name: 'name', type: 'string', description: 'Renders hidden radio inputs for form submission.' },
          { name: 'required', type: 'boolean', description: 'Marks the group required.' },
          { name: 'disabled', type: 'boolean', description: 'Disables every item.' },
          { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Which arrow keys navigate.' },
          { name: 'loop', type: 'boolean', default: 'true', description: 'Wrap from the last item to the first.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'RadioGroupItem',
        rows: [
          { name: 'value', type: 'string', description: 'Required. The value this item selects.' },
          { name: 'disabled', type: 'boolean', description: 'Disables this item; the keyboard skips it.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'RadioGroupIndicator',
        rows: [
          { name: 'forceMount', type: 'boolean', default: 'false', description: 'Render even when unchecked.' },
          ...COMMON_PROPS,
        ],
      },
    ],
    keyboard: [
      { keys: 'Tab', description: 'Moves into the group at the checked item, and out on the next press.' },
      { keys: '↓ →', description: 'Moves to the next enabled item and selects it.' },
      { keys: '↑ ←', description: 'Moves to the previous enabled item and selects it.' },
      { keys: 'Home, End', description: 'Jumps to the first or last item.' },
    ],
  },

  slider: {
    title: 'Slider',
    lead: 'One or more values on a range, by pointer or keyboard.',
    demo: 'slider',
    element: <SliderDemo />,
    anatomy: `import { Slider, SliderTrack, SliderRange, SliderThumb } from '@susi-ui/react';

<Slider value={range} onValueChange={setRange} onValueCommit={save} step={5}>
  <SliderTrack>
    <SliderRange />
  </SliderTrack>
  <SliderThumb index={0} aria-label="Minimum" />
  <SliderThumb index={1} aria-label="Maximum" />
</Slider>`,
    notes: (
      <>
        <p>
          The value is always an array — one number per thumb — and thumbs cannot cross each other.
          Dragging the track grabs the nearest thumb and follows the pointer until release.
        </p>
        <p>
          Positioning stays in your CSS. Each thumb publishes{' '}
          <code>--susi-slider-percent</code>, and the range publishes{' '}
          <code>--susi-slider-range-start</code> and <code>--susi-slider-range-end</code>. Give every
          thumb an <code>aria-label</code> — “Minimum” and “Maximum” beat two sliders called nothing.
        </p>
      </>
    ),
    props: [
      {
        title: 'Slider',
        rows: [
          { name: 'value', type: 'number[]', description: 'Controlled value, one entry per thumb.' },
          { name: 'defaultValue', type: 'number[]', default: '[0]', description: 'Initial value when uncontrolled.' },
          { name: 'onValueChange', type: '(value: number[]) => void', description: 'Fires on every step while dragging or pressing keys.' },
          { name: 'onValueCommit', type: '(value: number[]) => void', description: 'Fires once the interaction settles — the one to save on.' },
          { name: 'min', type: 'number', default: '0', description: 'Lowest value.' },
          { name: 'max', type: 'number', default: '100', description: 'Highest value.' },
          { name: 'step', type: 'number', default: '1', description: 'Granularity; values snap to it.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Axis of the slider.' },
          { name: 'disabled', type: 'boolean', description: 'Disables pointer and keyboard interaction.' },
          { name: 'name', type: 'string', description: 'Renders hidden inputs for form submission.' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'SliderTrack / SliderRange', rows: COMMON_PROPS },
      {
        title: 'SliderThumb',
        rows: [
          { name: 'index', type: 'number', default: '0', description: 'Which value in the array this thumb controls.' },
          { name: 'getValueLabel', type: '(value: number) => string', description: 'Accessible text for the current value (aria-valuetext).' },
          ...COMMON_PROPS,
        ],
      },
    ],
    keyboard: [
      { keys: '← ↓', description: 'Decreases by one step.' },
      { keys: '→ ↑', description: 'Increases by one step.' },
      { keys: 'PageUp, PageDown', description: 'Moves by a larger step (a tenth of the range).' },
      { keys: 'Home, End', description: 'Jumps to the minimum or maximum.' },
    ],
  },
};
