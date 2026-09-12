import { Separator } from '@susi-ui/react';

export default function SeparatorDemo() {
  return (
    <div style={{ width: '100%' }}>
      <p style={{ margin: 0 }}>Decorative separators are hidden from assistive technology.</p>
      <Separator className="susi-separator" style={{ margin: '14px 0' }} />
      <div className="row" style={{ height: 24 }}>
        <span>Edit</span>
        <Separator className="susi-separator" orientation="vertical" decorative={false} />
        <span>Duplicate</span>
        <Separator className="susi-separator" orientation="vertical" decorative={false} />
        <span>Delete</span>
      </div>
    </div>
  );
}
