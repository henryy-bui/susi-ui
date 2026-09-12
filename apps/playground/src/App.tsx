import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  CheckboxIndicator,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
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
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
  Progress,
  ProgressIndicator,
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
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
  Separator,
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
  Switch,
  SwitchThumb,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toggle,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
  type CheckedState,
} from '@susi-ui/react';

export function App() {
  return (
    <TooltipProvider>
      <main className="page">
      <header>
        <h1>susi-ui</h1>
        <p>Headless React primitives. Every style on this page lives in the app, not the library.</p>
      </header>

      <ButtonsDemo />
      <ToggleDemo />
      <CheckboxDemo />
      <SwitchDemo />
      <RadioGroupDemo />
      <SliderDemo />
      <ProgressDemo />
      <AccordionDemo />
      <CollapsibleDemo />
      <TabsDemo />
      <DialogDemo />
      <PopoverDemo />
      <TooltipDemo />
      <MenuDemo />
      <SelectDemo />
      </main>
    </TooltipProvider>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ButtonsDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <Section title="Button">
      <div className="row">
        <Button className="btn" onClick={() => setLoading((l) => !l)}>
          Toggle loading
        </Button>
        <Button className="btn" loading={loading}>
          Save changes
        </Button>
        <Button className="btn" disabled>
          Disabled
        </Button>
        <Button className="btn" asChild>
          <a href="https://example.com">Rendered as an anchor</a>
        </Button>
      </div>
    </Section>
  );
}

function ToggleDemo() {
  const [pressed, setPressed] = useState(false);
  return (
    <Section title="Toggle">
      <div className="row">
        <Toggle className="btn" pressed={pressed} onPressedChange={setPressed}>
          Bold
        </Toggle>
        <Toggle className="btn" defaultPressed>
          Italic
        </Toggle>
        <span className="state">controlled: {String(pressed)}</span>
      </div>
    </Section>
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = useState<CheckedState>('indeterminate');
  return (
    <Section title="Checkbox">
      <div className="row">
        <label className="field">
          <Checkbox className="checkbox" checked={checked} onCheckedChange={setChecked} name="terms">
            <CheckboxIndicator className="checkbox-indicator">
              {checked === 'indeterminate' ? '–' : '✓'}
            </CheckboxIndicator>
          </Checkbox>
          Accept terms
        </label>
        <Button className="btn" onClick={() => setChecked('indeterminate')}>
          Set indeterminate
        </Button>
        <span className="state">state: {String(checked)}</span>
      </div>
    </Section>
  );
}

function SwitchDemo() {
  return (
    <Section title="Switch">
      <label className="field">
        <Switch className="switch" defaultChecked name="wifi">
          <SwitchThumb className="switch-thumb" />
        </Switch>
        Wi-Fi
      </label>
    </Section>
  );
}

const FAQ = [
  { value: 'what', question: 'What is this?', answer: 'Behaviour and accessibility, with no styling opinions.' },
  { value: 'why', question: 'Why headless?', answer: 'Because every project wants a different look from the same mechanics.' },
  { value: 'how', question: 'How do I style it?', answer: 'Target the data-state attributes, or pass your own class names.' },
];

function AccordionDemo() {
  return (
    <Section title="Accordion">
      <Accordion className="accordion" type="single" defaultValue="what" collapsible>
        {FAQ.map((item) => (
          <AccordionItem className="accordion-item" key={item.value} value={item.value}>
            <AccordionHeader>
              <AccordionTrigger className="accordion-trigger">{item.question}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className="accordion-content">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

function CollapsibleDemo() {
  return (
    <Section title="Collapsible">
      <Collapsible>
        <CollapsibleTrigger className="btn">Show details</CollapsibleTrigger>
        <CollapsibleContent className="accordion-content" style={{ paddingTop: 12 }}>
          The content sets <code>--susi-collapsible-content-height</code>, so you can animate to its real height.
        </CollapsibleContent>
      </Collapsible>
    </Section>
  );
}

function TabsDemo() {
  return (
    <Section title="Tabs">
      <Tabs defaultValue="account">
        <TabsList className="tabs-list">
          <TabsTrigger className="tab" value="account">
            Account
          </TabsTrigger>
          <TabsTrigger className="tab" value="password">
            Password
          </TabsTrigger>
          <TabsTrigger className="tab" value="billing" disabled>
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent className="tab-content" value="account">
          Arrow keys move between tabs and select as you go.
        </TabsContent>
        <TabsContent className="tab-content" value="password">
          Pass <code>activationMode="manual"</code> to require Enter or Space.
        </TabsContent>
        <TabsContent className="tab-content" value="billing">
          Disabled tabs are skipped.
        </TabsContent>
      </Tabs>
    </Section>
  );
}

function DialogDemo() {
  return (
    <Section title="Dialog">
      <Dialog>
        <DialogTrigger className="btn">Delete project</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="overlay" />
          <DialogContent className="dialog">
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This permanently removes the project and everything in it. Focus is trapped, scroll is
              locked, and Escape closes.
            </DialogDescription>
            <div className="dialog-actions">
              <DialogClose className="btn">Cancel</DialogClose>
              <DialogClose className="btn">Delete</DialogClose>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </Section>
  );
}

function PopoverDemo() {
  return (
    <Section title="Popover">
      <div className="row">
        <Popover>
          <PopoverTrigger className="btn">Open popover</PopoverTrigger>
          <PopoverPortal>
            <PopoverContent className="popover" sideOffset={8}>
              <PopoverArrow className="popover-arrow" />
              <p style={{ margin: '0 0 12px' }}>
                Positioned with Floating UI — it flips and shifts to stay on screen.
              </p>
              <PopoverClose className="btn">Close</PopoverClose>
            </PopoverContent>
          </PopoverPortal>
        </Popover>

        <Popover>
          <PopoverTrigger className="btn">Side: right</PopoverTrigger>
          <PopoverPortal>
            <PopoverContent className="popover" side="right" align="start" sideOffset={8}>
              <PopoverArrow className="popover-arrow" />
              Anchored to the right of the trigger.
            </PopoverContent>
          </PopoverPortal>
        </Popover>
      </div>
    </Section>
  );
}

function RadioGroupDemo() {
  return (
    <Section title="Radio group">
      <RadioGroup className="row" aria-label="Plan" defaultValue="pro" name="plan">
        {['free', 'pro', 'team'].map((plan) => (
          <label className="field" key={plan}>
            <RadioGroupItem className="radio" value={plan}>
              <RadioGroupIndicator className="radio-indicator" />
            </RadioGroupItem>
            {plan}
          </label>
        ))}
      </RadioGroup>
    </Section>
  );
}

function SliderDemo() {
  const [range, setRange] = useState([20, 70]);
  return (
    <Section title="Slider">
      <div className="row" style={{ gap: 32 }}>
        <Slider className="slider" defaultValue={[40]} aria-label="Volume">
          <SliderTrack className="slider-track">
            <SliderRange className="slider-range" />
          </SliderTrack>
          <SliderThumb className="slider-thumb" aria-label="Volume" />
        </Slider>

        <Slider className="slider" value={range} onValueChange={setRange} step={5}>
          <SliderTrack className="slider-track">
            <SliderRange className="slider-range" />
          </SliderTrack>
          <SliderThumb className="slider-thumb" index={0} aria-label="Minimum" />
          <SliderThumb className="slider-thumb" index={1} aria-label="Maximum" />
        </Slider>
        <span className="state">{range.join(' – ')}</span>
      </div>
    </Section>
  );
}

function ProgressDemo() {
  const [value, setValue] = useState<number | null>(35);
  return (
    <Section title="Progress">
      <div className="row">
        <Progress className="progress" value={value} getValueLabel={(v, max) => `${v} of ${max}`}>
          <ProgressIndicator className="progress-indicator" />
        </Progress>
        <Button className="btn" onClick={() => setValue((v) => (v === null ? 35 : v >= 100 ? 0 : v + 20))}>
          Advance
        </Button>
        <Button className="btn" onClick={() => setValue((v) => (v === null ? 35 : null))}>
          Toggle indeterminate
        </Button>
      </div>
    </Section>
  );
}

function TooltipDemo() {
  return (
    <Section title="Tooltip">
      <div className="row">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger className="btn">{side}</TooltipTrigger>
            <TooltipPortal>
              <TooltipContent className="tooltip" side={side}>
                <TooltipArrow className="tooltip-arrow" />
                Opens on hover, and on keyboard focus.
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        ))}
      </div>
    </Section>
  );
}

function MenuDemo() {
  const [showHidden, setShowHidden] = useState(true);
  const [sort, setSort] = useState('name');

  return (
    <Section title="Dropdown menu">
      <div className="row">
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
        <span className="state">
          sort: {sort} · hidden: {String(showHidden)}
        </span>
      </div>
    </Section>
  );
}

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Dragon fruit', 'Elderberry'];

function SelectDemo() {
  const [value, setValue] = useState<string>();
  return (
    <Section title="Select">
      <div className="row">
        <Select value={value} onValueChange={setValue} name="fruit">
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
        <span className="state">value: {value ?? 'none'}</span>
      </div>
    </Section>
  );
}
