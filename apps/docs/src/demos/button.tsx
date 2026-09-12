import { useState } from 'react';
import { Button } from '@susi-ui/react';

export default function ButtonDemo() {
  const [saving, setSaving] = useState(false);

  return (
    <>
      <Button className="susi-btn" onClick={() => setSaving((value) => !value)}>
        Toggle loading
      </Button>

      <Button className="susi-btn" loading={saving}>
        Save changes
      </Button>

      <Button className="susi-btn" disabled>
        Disabled
      </Button>

      {/* asChild renders the anchor, but keeps the button's behaviour */}
      <Button className="susi-btn" asChild>
        <a href="https://example.com">Open docs</a>
      </Button>
    </>
  );
}
