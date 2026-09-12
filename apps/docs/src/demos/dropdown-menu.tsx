import { useState } from 'react';
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
} from '@susi-ui/react';

export default function DropdownMenuDemo() {
  // The content unmounts when closed, so this state lives outside the menu
  const [showHidden, setShowHidden] = useState(true);
  const [sort, setSort] = useState('name');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="susi-btn">Actions</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="susi-menu">
            <DropdownMenuItem className="susi-menu-item">New file</DropdownMenuItem>
            <DropdownMenuItem className="susi-menu-item">Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="susi-menu-item" disabled>
              Archive
            </DropdownMenuItem>

            <DropdownMenuSeparator className="susi-menu-separator" />

            <DropdownMenuCheckboxItem
              className="susi-menu-item"
              checked={showHidden}
              onCheckedChange={setShowHidden}
            >
              Show hidden files
              <DropdownMenuItemIndicator className="susi-menu-indicator">✓</DropdownMenuItemIndicator>
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator className="susi-menu-separator" />

            <DropdownMenuLabel className="susi-menu-label">Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              {['name', 'date', 'size'].map((option) => (
                <DropdownMenuRadioItem className="susi-menu-item" key={option} value={option}>
                  {option}
                  <DropdownMenuItemIndicator className="susi-menu-indicator">•</DropdownMenuItemIndicator>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <span className="state">
        sort: {sort} · hidden: {String(showHidden)}
      </span>
    </>
  );
}
