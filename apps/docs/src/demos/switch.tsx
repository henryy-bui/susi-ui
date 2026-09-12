import { Switch, SwitchThumb } from '@susi-ui/react';

export default function SwitchDemo() {
  return (
    <label className="susi-field">
      <Switch className="susi-switch" defaultChecked name="wifi">
        <SwitchThumb className="susi-switch-thumb" />
      </Switch>
      Wi-Fi
    </label>
  );
}
