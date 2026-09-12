import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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

const meta = { title: 'Menus/Dropdown & Select' } satisfies Meta;
export default meta;

export const Dropdown: StoryObj = {
  render: function Render() {
    const [showHidden, setShowHidden] = useState(true);
    const [sort, setSort] = useState('name');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="btn">Actions</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="menu">
            <DropdownMenuItem className="menu-item">New file</DropdownMenuItem>
            <DropdownMenuItem className="menu-item">Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="menu-item" disabled>
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator className="menu-separator" />
            <DropdownMenuCheckboxItem
              className="menu-item"
              checked={showHidden}
              onCheckedChange={setShowHidden}
            >
              Show hidden files
              <DropdownMenuItemIndicator className="menu-indicator">✓</DropdownMenuItemIndicator>
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator className="menu-separator" />
            <DropdownMenuLabel className="menu-label">Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              {['name', 'date', 'size'].map((option) => (
                <DropdownMenuRadioItem className="menu-item" key={option} value={option}>
                  {option}
                  <DropdownMenuItemIndicator className="menu-indicator">•</DropdownMenuItemIndicator>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    );
  },
};

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Dragon fruit', 'Elderberry'];

export const SelectMenu: StoryObj = {
  name: 'Select',
  render: function Render() {
    const [value, setValue] = useState<string>();
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="select-trigger" aria-label="Fruit">
          <SelectValue placeholder="Pick a fruit" />
          <SelectIcon>⌄</SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent className="menu select-content">
            <SelectViewport className="select-viewport">
              <SelectGroup>
                <SelectLabel className="menu-label">Fruit</SelectLabel>
                {FRUITS.map((fruit) => (
                  <SelectItem className="menu-item" key={fruit} value={fruit.toLowerCase()}>
                    <SelectItemText>{fruit}</SelectItemText>
                    <SelectItemIndicator className="menu-indicator">✓</SelectItemIndicator>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </Select>
    );
  },
};
