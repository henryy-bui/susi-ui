import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Checkbox,
  CheckboxIndicator,
  Switch,
  SwitchThumb,
  Toggle,
  type CheckedState,
} from '@susi-ui/react';

const meta = {
  title: 'Controls/Button',
  component: Button,
  args: { children: 'Save changes', className: 'btn' },
  argTypes: { loading: { control: 'boolean' }, disabled: { control: 'boolean' } },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };

export const AsChild: Story = {
  name: 'asChild (renders an anchor)',
  args: { asChild: true, children: <a href="https://example.com">Go to docs</a> },
};

export const ToggleButton: StoryObj = {
  render: () => (
    <div className="row">
      <Toggle className="btn">Bold</Toggle>
      <Toggle className="btn" defaultPressed>
        Italic
      </Toggle>
    </div>
  ),
};

export const CheckboxStates: StoryObj = {
  render: function Render() {
    const [checked, setChecked] = useState<CheckedState>('indeterminate');
    return (
      <div className="row">
        <label className="field">
          <Checkbox className="checkbox" checked={checked} onCheckedChange={setChecked}>
            <CheckboxIndicator className="checkbox-indicator">
              {checked === 'indeterminate' ? '–' : '✓'}
            </CheckboxIndicator>
          </Checkbox>
          Accept terms
        </label>
        <span className="state">state: {String(checked)}</span>
      </div>
    );
  },
};

export const SwitchControl: StoryObj = {
  render: () => (
    <label className="field">
      <Switch className="switch" defaultChecked>
        <SwitchThumb className="switch-thumb" />
      </Switch>
      Wi-Fi
    </label>
  ),
};
