import { useState } from 'react';
import { Button, Progress, ProgressIndicator } from '@susi-ui/react';

export default function ProgressDemo() {
  const [value, setValue] = useState<number | null>(35);

  return (
    <>
      <Progress
        className="susi-progress"
        value={value}
        getValueLabel={(current, max) => `${current} of ${max} uploaded`}
      >
        <ProgressIndicator className="susi-progress-indicator" />
      </Progress>

      <Button
        className="susi-btn"
        onClick={() => setValue((current) => (current === null ? 35 : current >= 100 ? 0 : current + 20))}
      >
        Advance
      </Button>

      <Button className="susi-btn" onClick={() => setValue((current) => (current === null ? 35 : null))}>
        Toggle indeterminate
      </Button>
    </>
  );
}
