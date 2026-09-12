import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../components/Button';
import { Slot } from '../Slot';

describe('Slot / asChild', () => {
  it('renders the child element and merges props onto it', () => {
    render(
      <Button asChild className="btn" data-testid="target">
        <a href="/docs">Docs</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveClass('btn');
    expect(link.tagName).toBe('A');
  });

  it('merges className and style rather than overwriting them', () => {
    render(
      <Slot className="from-slot" style={{ color: 'red', margin: 0 }}>
        <span className="from-child" style={{ color: 'blue' }} data-testid="el" />
      </Slot>,
    );

    const el = screen.getByTestId('el');
    expect(el).toHaveClass('from-slot', 'from-child');
    expect(el).toHaveStyle({ color: 'rgb(0, 0, 255)', margin: '0px' });
  });

  it('calls both handlers, child first', async () => {
    const calls: string[] = [];
    render(
      <Slot onClick={() => calls.push('slot')}>
        <button onClick={() => calls.push('child')}>go</button>
      </Slot>,
    );

    await userEvent.click(screen.getByRole('button'));
    expect(calls).toEqual(['child', 'slot']);
  });

  it('forwards refs to the child element', () => {
    const ref = vi.fn();
    render(
      <Slot ref={ref}>
        <span />
      </Slot>,
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
  });
});
