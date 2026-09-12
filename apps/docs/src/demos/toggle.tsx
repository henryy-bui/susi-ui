import { useState } from 'react';
import { Toggle } from '@susi-ui/react';

export default function ToggleDemo() {
  const [bold, setBold] = useState(false);

  return (
    <>
      <Toggle className="susi-btn" pressed={bold} onPressedChange={setBold}>
        Bold
      </Toggle>

      <Toggle className="susi-btn" defaultPressed>
        Italic
      </Toggle>

      <span className="state">bold: {String(bold)}</span>
    </>
  );
}
