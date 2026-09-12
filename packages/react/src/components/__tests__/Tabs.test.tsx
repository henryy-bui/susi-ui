import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs';

function Example(props: React.ComponentProps<typeof Tabs>) {
  return (
    <Tabs defaultValue="one" {...props}>
      <TabsList>
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Panel one</TabsContent>
      <TabsContent value="two">Panel two</TabsContent>
      <TabsContent value="three">Panel three</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('wires up the ARIA tabs pattern', () => {
    render(<Example />);

    const selected = screen.getByRole('tab', { selected: true });
    expect(selected).toHaveTextContent('One');
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveTextContent('Panel one');
    expect(panel).toHaveAttribute('aria-labelledby', selected.id);
    expect(selected).toHaveAttribute('aria-controls', panel.id);
  });

  it('keeps only the selected tab in the tab sequence', () => {
    render(<Example />);
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('tabindex', '-1');
  });

  it('selects on arrow keys in automatic mode and wraps around', async () => {
    render(<Example />);
    await userEvent.tab();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two');

    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel one');

    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel three');
  });

  it('waits for Enter in manual mode', async () => {
    render(<Example activationMode="manual" />);
    await userEvent.tab();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel one');
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two');
  });

  it('supports controlled usage', async () => {
    const onValueChange = vi.fn();
    render(<Example value="two" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Three' }));
    expect(onValueChange).toHaveBeenCalledWith('three');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two');
  });
});
