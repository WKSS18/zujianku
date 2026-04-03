import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ScConfigProvider } from '../ScConfigProvider';
import { useScToken } from '../useScToken';
import { defaultScToken } from '../token';

function TokenConsumer() {
  const token = useScToken();
  return <div data-testid="token">{JSON.stringify(token)}</div>;
}

describe('ScConfigProvider', () => {
  afterEach(() => {
    cleanup();
  });

  it('provides default sc tokens', () => {
    render(
      <ScConfigProvider>
        <TokenConsumer />
      </ScConfigProvider>,
    );
    const el = screen.getByTestId('token');
    expect(JSON.parse(el.textContent!)).toEqual(defaultScToken);
  });

  it('merges custom sc tokens with defaults', () => {
    render(
      <ScConfigProvider scToken={{ headerHeight: 64 }}>
        <TokenConsumer />
      </ScConfigProvider>,
    );
    const el = screen.getByTestId('token');
    const token = JSON.parse(el.textContent!);
    expect(token.headerHeight).toBe(64);
    expect(token.sidebarWidth).toBe(240); // default preserved
  });

  it('throws when useScToken is used outside provider', () => {
    // Suppress React error boundary console output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(<TokenConsumer />);
    }).toThrow('useScToken must be used within a ScConfigProvider');
    spy.mockRestore();
  });
});
