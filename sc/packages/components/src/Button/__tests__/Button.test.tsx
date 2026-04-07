import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Button } from '../Button';

afterEach(cleanup);

// Track Modal.confirm calls
const mockConfirm = vi.fn((config: Record<string, unknown>) => {
  // Auto-trigger onOk for testing
  if (typeof config.onOk === 'function') {
    (config.onOk as () => void)();
  }
});

vi.mock('antd', () => ({
  Button: (props: Record<string, unknown>) => {
    const { loading, disabled, onClick, children, ...rest } = props;
    return (
      <button
        data-testid="antd-button"
        data-loading={String(!!loading)}
        disabled={!!disabled}
        onClick={onClick as React.MouseEventHandler}
        {...rest}
      >
        {children as React.ReactNode}
      </button>
    );
  },
  Modal: {
    confirm: (config: Record<string, unknown>) => mockConfirm(config),
  },
}));

vi.mock('@test111190909222/hooks', () => ({
  useAuth: (authCode?: string) => {
    // Simulate: 'admin' permission exists, 'super-admin' does not
    if (!authCode) return true;
    return authCode === 'admin';
  },
}));

describe('Button', () => {
  it('renders basic button', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByTestId('antd-button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByTestId('antd-button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe('confirmConfig', () => {
    it('shows confirm modal before executing onClick', () => {
      const onClick = vi.fn();
      render(
        <Button
          confirmConfig={{ title: '删除确认', content: '确定删除？' }}
          onClick={onClick}
        >
          删除
        </Button>,
      );
      fireEvent.click(screen.getByTestId('antd-button'));
      expect(mockConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '删除确认',
          content: '确定删除？',
        }),
      );
      expect(onClick).toHaveBeenCalled();
    });

    it('uses default title and content', () => {
      render(
        <Button confirmConfig={{}} onClick={vi.fn()}>
          确认
        </Button>,
      );
      fireEvent.click(screen.getByTestId('antd-button'));
      expect(mockConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '确认',
          content: '确认执行此操作？',
        }),
      );
    });
  });

  describe('authCode', () => {
    it('disables button when auth check fails (default mode)', () => {
      render(<Button authCode="super-admin">操作</Button>);
      expect(screen.getByTestId('antd-button')).toBeDisabled();
    });

    it('hides button when auth check fails with hidden mode', () => {
      const { container } = render(
        <Button authCode="super-admin" authFailMode="hidden">
          操作
        </Button>,
      );
      expect(container.innerHTML).toBe('');
    });

    it('renders normally when auth check passes', () => {
      render(<Button authCode="admin">操作</Button>);
      const btn = screen.getByTestId('antd-button');
      expect(btn).not.toBeDisabled();
      expect(btn).toHaveTextContent('操作');
    });
  });

  describe('autoLoading', () => {
    it('manages loading state for async onClick', async () => {
      let resolve: () => void;
      const asyncClick = vi.fn(
        () => new Promise<void>((r) => (resolve = r)),
      );

      render(
        <Button autoLoading onClick={asyncClick}>
          提交
        </Button>,
      );

      const btn = screen.getByTestId('antd-button');
      expect(btn.dataset.loading).toBe('false');

      fireEvent.click(btn);

      await waitFor(() => {
        expect(btn.dataset.loading).toBe('true');
      });

      resolve!();

      await waitFor(() => {
        expect(btn.dataset.loading).toBe('false');
      });
    });
  });
});
