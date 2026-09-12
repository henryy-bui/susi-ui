import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '../Accordion';

function Items() {
  return (
    <>
      {['a', 'b', 'c'].map((value) => (
        <AccordionItem key={value} value={value}>
          <AccordionHeader>
            <AccordionTrigger>Trigger {value}</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>Content {value}</AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
}

describe('Accordion', () => {
  it('opens one item at a time in single mode', async () => {
    render(
      <Accordion type="single">
        <Items />
      </Accordion>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Trigger a' }));
    expect(screen.getByRole('region', { name: 'Trigger a' })).toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: 'Trigger b' }));
    expect(screen.getByRole('button', { name: 'Trigger a' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Trigger b' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('only closes the open item when collapsible', async () => {
    const { rerender } = render(
      <Accordion type="single" defaultValue="a">
        <Items />
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger a' });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    rerender(
      <Accordion type="single" defaultValue="a" collapsible>
        <Items />
      </Accordion>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Trigger a' }));
    expect(screen.getByRole('button', { name: 'Trigger a' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps several items open in multiple mode', async () => {
    const onValueChange = vi.fn();
    render(
      <Accordion type="multiple" onValueChange={onValueChange}>
        <Items />
      </Accordion>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Trigger a' }));
    await userEvent.click(screen.getByRole('button', { name: 'Trigger c' }));

    expect(screen.getByRole('button', { name: 'Trigger a' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Trigger c' })).toHaveAttribute('aria-expanded', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'c']);
  });

  it('moves focus between triggers with arrow keys', async () => {
    render(
      <Accordion type="single">
        <Items />
      </Accordion>,
    );

    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Trigger a' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Trigger b' })).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByRole('button', { name: 'Trigger c' })).toHaveFocus();

    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('button', { name: 'Trigger a' })).toHaveFocus();
  });

  it('hides content of closed items', () => {
    render(
      <Accordion type="single" defaultValue="a">
        <Items />
      </Accordion>,
    );

    expect(screen.getByText('Content a')).toBeVisible();
    expect(screen.queryByText('Content b')).not.toBeInTheDocument();
  });
});
