import { useState } from 'react';
import { Switch, SwitchThumb } from '@susi-ui/react';

export default function ControlledDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      {/* Uncontrolled: the component owns the state */}
      <label className="susi-field">
        <Switch className="susi-switch" defaultChecked>
          <SwitchThumb className="susi-switch-thumb" />
        </Switch>
        Uncontrolled
      </label>

      {/* Controlled: you own it, and nothing changes unless you say so */}
      <label className="susi-field">
        <Switch className="susi-switch" checked={checked} onCheckedChange={setChecked}>
          <SwitchThumb className="susi-switch-thumb" />
        </Switch>
        Controlled ({String(checked)})
      </label>

      {/* Controlled and ignored: the switch never moves */}
      <label className="susi-field">
        <Switch className="susi-switch" checked={false} onCheckedChange={() => {}}>
          <SwitchThumb className="susi-switch-thumb" />
        </Switch>
        Frozen
      </label>
    </>
  );
}
