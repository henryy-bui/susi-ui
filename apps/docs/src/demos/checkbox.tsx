import { useState } from 'react';
import { Button, Checkbox, CheckboxIndicator, type CheckedState } from '@susi-ui/react';

export default function CheckboxDemo() {
  const [checked, setChecked] = useState<CheckedState>('indeterminate');

  return (
    <>
      <label className="susi-field">
        <Checkbox
          className="susi-checkbox"
          checked={checked}
          onCheckedChange={setChecked}
          name="terms"
        >
          <CheckboxIndicator className="susi-checkbox-indicator">
            {checked === 'indeterminate' ? '–' : '✓'}
          </CheckboxIndicator>
        </Checkbox>
        Accept terms
      </label>

      <Button className="susi-btn" onClick={() => setChecked('indeterminate')}>
        Set indeterminate
      </Button>

      <span className="state">state: {String(checked)}</span>
    </>
  );
}
