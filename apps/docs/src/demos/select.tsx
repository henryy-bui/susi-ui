import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '@susi-ui/react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Dragon fruit', 'Elderberry'];

export default function SelectDemo() {
  const [fruit, setFruit] = useState<string>();

  return (
    <>
      <Select value={fruit} onValueChange={setFruit} name="fruit">
        <SelectTrigger className="susi-select-trigger" aria-label="Fruit">
          <SelectValue placeholder="Pick a fruit" />
          <SelectIcon>⌄</SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent className="susi-menu susi-select-content">
            <SelectViewport className="susi-select-viewport">
              <SelectGroup>
                <SelectLabel className="susi-menu-label">Fruit</SelectLabel>
                {FRUITS.map((item) => (
                  <SelectItem className="susi-menu-item" key={item} value={item.toLowerCase()}>
                    <SelectItemText>{item}</SelectItemText>
                    <SelectItemIndicator className="susi-menu-indicator">✓</SelectItemIndicator>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </Select>

      <span className="state">value: {fruit ?? 'none'}</span>
    </>
  );
}
