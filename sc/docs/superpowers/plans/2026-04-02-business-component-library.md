# Business Component Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pnpm monorepo business component library (`@sc/*`) with shared theme, hooks, utils, and components packages — ready for enterprise consumption.

**Architecture:** pnpm workspaces monorepo with 4 packages (`@sc/utils`, `@sc/hooks`, `@sc/theme`, `@sc/components`). Each package builds independently via tsdown (ESM+CJS+DTS). Storybook 10 for documentation, Vitest 4 for testing, Changesets for versioning.

**Tech Stack:** React 18+, TypeScript, Ant Design 6, @ant-design/x 2, tsdown, Vitest 4, Storybook 10 (Vite), Changesets, pnpm workspaces

**Version Notes (deviations from design doc):**

- tsdown replaces tsup (tsup is no longer maintained, tsdown is its official successor)
- Storybook 10 replaces Storybook 8 (latest stable)
- Vitest 4 (latest stable)

---

## File Structure

```
sc/
├── package.json                    # Root: workspaces, scripts, devDeps
├── pnpm-workspace.yaml             # Workspace definition
├── tsconfig.base.json              # Shared TS config
├── tsdown.base.ts                  # Shared tsdown config (new)
├── .eslintrc.cjs                   # ESLint config
├── .prettierrc                     # Prettier config
├── .editorconfig                   # Editor config
├── .gitignore                      # Git ignore
├── .changeset/
│   └── config.json                 # Changesets independent mode
├── .husky/
│   └── pre-commit                  # Lint-staged hook
├── packages/
│   ├── utils/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsdown.config.ts
│   │   └── src/
│   │       ├── index.ts
│   │       ├── formatDate.ts
│   │       └── __tests__/
│   │           └── formatDate.test.ts
│   ├── hooks/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsdown.config.ts
│   │   └── src/
│   │       ├── index.ts
│   │       ├── useMount/
│   │       │   ├── index.ts
│   │       │   ├── useMount.ts
│   │       │   └── __tests__/
│   │       │       └── useMount.test.ts
│   │       └── usePagination/
│   │           ├── index.ts
│   │           ├── usePagination.ts
│   │           └── __tests__/
│   │               └── usePagination.test.ts
│   ├── theme/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsdown.config.ts
│   │   └── src/
│   │       ├── index.ts
│   │       ├── token.ts
│   │       ├── ScConfigProvider.tsx
│   │       ├── useScToken.ts
│   │       └── __tests__/
│   │           └── ScConfigProvider.test.tsx
│   └── components/
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsdown.config.ts
│       └── src/
│           ├── index.ts
│           ├── ProTable/
│           │   ├── index.ts
│           │   ├── ProTable.tsx
│           │   ├── ProTable.types.ts
│           │   ├── ProTable.stories.tsx
│           │   └── __tests__/
│           │       └── ProTable.test.tsx
│           └── SearchForm/
│               ├── index.ts
│               ├── SearchForm.tsx
│               ├── SearchForm.types.ts
│               ├── SearchForm.stories.tsx
│               └── __tests__/
│                   └── SearchForm.test.tsx
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
└── vitest.workspace.ts
```

---

## Task 1: Initialize Git and Root package.json

**Files:**

- Create: `.gitignore`
- Create: `package.json`
- Create: `pnpm-workspace.yaml`

- [ ] **Step 1: Initialize git repository**

```bash
cd D:/project/sc
git init
```

- [ ] **Step 2: Create .gitignore**

Create `.gitignore`:

```gitignore
node_modules/
dist/
*.tsbuildinfo
.turbo/
storybook-static/
coverage/
*.local
.DS_Store
```

- [ ] **Step 3: Create root package.json**

Create `package.json`:

```json
{
  "name": "sc",
  "private": true,
  "packageManager": "pnpm@10.8.0",
  "engines": {
    "node": ">=20.19.0"
  },
  "scripts": {
    "build": "pnpm -r run build",
    "dev": "storybook dev -p 6006",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint 'packages/*/src/**/*.{ts,tsx}'",
    "lint:fix": "eslint 'packages/*/src/**/*.{ts,tsx}' --fix",
    "format": "prettier --write 'packages/*/src/**/*.{ts,tsx}'",
    "typecheck": "tsc -b packages/*/tsconfig.json",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "publish-packages": "pnpm build && changeset publish",
    "prepare": "husky"
  },
  "devDependencies": {
    "@changesets/cli": "^2.30.0",
    "@storybook/addon-essentials": "^10.1.0",
    "@storybook/react": "^10.3.0",
    "@storybook/react-vite": "^10.1.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.3.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "husky": "^9.1.0",
    "jsdom": "^26.0.0",
    "lint-staged": "^15.4.0",
    "prettier": "^3.5.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "storybook": "^10.1.0",
    "tsdown": "^0.20.0",
    "typescript": "^5.8.0",
    "vitest": "^4.1.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

- [ ] **Step 4: Create pnpm-workspace.yaml**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore package.json pnpm-workspace.yaml
git commit -m "chore: initialize monorepo root with pnpm workspaces"
```

---

## Task 2: TypeScript Base Configuration

**Files:**

- Create: `tsconfig.base.json`

- [ ] **Step 1: Create shared tsconfig.base.json**

Create `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tsconfig.base.json
git commit -m "chore: add shared TypeScript base configuration"
```

---

## Task 3: ESLint + Prettier + EditorConfig

**Files:**

- Create: `.eslintrc.cjs`
- Create: `.prettierrc`
- Create: `.editorconfig`

- [ ] **Step 1: Create .eslintrc.cjs**

Create `.eslintrc.cjs`:

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.config.*'],
};
```

- [ ] **Step 2: Create .prettierrc**

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

- [ ] **Step 3: Create .editorconfig**

Create `.editorconfig`:

```editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
```

- [ ] **Step 4: Commit**

```bash
git add .eslintrc.cjs .prettierrc .editorconfig
git commit -m "chore: add ESLint, Prettier, and EditorConfig configuration"
```

---

## Task 4: @sc/utils Package — Scaffold + First Utility

**Files:**

- Create: `packages/utils/package.json`
- Create: `packages/utils/tsconfig.json`
- Create: `packages/utils/tsdown.config.ts`
- Create: `packages/utils/src/index.ts`
- Create: `packages/utils/src/formatDate.ts`
- Create: `packages/utils/src/__tests__/formatDate.test.ts`

- [ ] **Step 1: Create packages/utils/package.json**

```json
{
  "name": "@sc/utils",
  "version": "0.1.0",
  "description": "Shared utility functions for SC component library",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "sideEffects": false
}
```

- [ ] **Step 2: Create packages/utils/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/utils/tsdown.config.ts**

```ts
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
});
```

- [ ] **Step 4: Write the failing test for formatDate**

Create `packages/utils/src/__tests__/formatDate.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '../formatDate';

describe('formatDate', () => {
  it('formats a Date object to YYYY-MM-DD by default', () => {
    const date = new Date(2026, 3, 2); // April 2, 2026
    expect(formatDate(date)).toBe('2026-04-02');
  });

  it('formats a Date object with custom format YYYY/MM/DD', () => {
    const date = new Date(2026, 0, 15);
    expect(formatDate(date, 'YYYY/MM/DD')).toBe('2026/01/15');
  });

  it('formats a timestamp number', () => {
    const date = new Date(2026, 3, 2);
    expect(formatDate(date.getTime())).toBe('2026-04-02');
  });

  it('formats a date string', () => {
    expect(formatDate('2026-04-02')).toBe('2026-04-02');
  });

  it('returns empty string for invalid input', () => {
    expect(formatDate(null as unknown as Date)).toBe('');
    expect(formatDate(undefined as unknown as Date)).toBe('');
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

```bash
cd D:/project/sc
pnpm vitest run packages/utils/src/__tests__/formatDate.test.ts
```

Expected: FAIL — `formatDate` is not defined.

- [ ] **Step 6: Implement formatDate**

Create `packages/utils/src/formatDate.ts`:

```ts
type DateInput = Date | number | string;

export function formatDate(input: DateInput, format: string = 'YYYY-MM-DD'): string {
  if (input == null) return '';

  let date: Date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === 'number') {
    date = new Date(input);
  } else if (typeof input === 'string') {
    date = new Date(input);
  } else {
    return '';
  }

  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return format.replace('YYYY', String(year)).replace('MM', month).replace('DD', day);
}
```

- [ ] **Step 7: Create index.ts barrel export**

Create `packages/utils/src/index.ts`:

```ts
export { formatDate } from './formatDate';
```

- [ ] **Step 8: Run test to verify it passes**

```bash
pnpm vitest run packages/utils/src/__tests__/formatDate.test.ts
```

Expected: ALL PASS

- [ ] **Step 9: Commit**

```bash
git add packages/utils/
git commit -m "feat(utils): scaffold @sc/utils package with formatDate utility"
```

---

## Task 5: Vitest Workspace Configuration

**Files:**

- Create: `vitest.workspace.ts`

- [ ] **Step 1: Create vitest.workspace.ts**

```ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'utils',
      root: './packages/utils',
      environment: 'node',
    },
  },
  {
    test: {
      name: 'hooks',
      root: './packages/hooks',
      environment: 'jsdom',
    },
  },
  {
    test: {
      name: 'theme',
      root: './packages/theme',
      environment: 'jsdom',
    },
  },
  {
    test: {
      name: 'components',
      root: './packages/components',
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
    },
  },
]);
```

- [ ] **Step 2: Create vitest setup for components**

Create `packages/components/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Run full test suite**

```bash
pnpm vitest run
```

Expected: utils tests pass, other workspaces have no tests yet.

- [ ] **Step 4: Commit**

```bash
git add vitest.workspace.ts packages/components/vitest.setup.ts
git commit -m "chore: add Vitest workspace configuration"
```

---

## Task 6: @sc/hooks Package — Scaffold + useMount

**Files:**

- Create: `packages/hooks/package.json`
- Create: `packages/hooks/tsconfig.json`
- Create: `packages/hooks/tsdown.config.ts`
- Create: `packages/hooks/src/index.ts`
- Create: `packages/hooks/src/useMount/index.ts`
- Create: `packages/hooks/src/useMount/useMount.ts`
- Create: `packages/hooks/src/useMount/__tests__/useMount.test.ts`

- [ ] **Step 1: Create packages/hooks/package.json**

```json
{
  "name": "@sc/hooks",
  "version": "0.1.0",
  "description": "Shared React hooks for SC component library",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "peerDependencies": {
    "react": ">=18"
  },
  "dependencies": {
    "@sc/utils": "workspace:*"
  },
  "sideEffects": false
}
```

- [ ] **Step 2: Create packages/hooks/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/hooks/tsdown.config.ts**

```ts
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
});
```

- [ ] **Step 4: Write the failing test for useMount**

Create `packages/hooks/src/useMount/__tests__/useMount.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMount } from '../useMount';

describe('useMount', () => {
  it('calls the callback on mount', () => {
    const fn = vi.fn();
    renderHook(() => useMount(fn));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not call the callback on rerender', () => {
    const fn = vi.fn();
    const { rerender } = renderHook(() => useMount(fn));
    rerender();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

```bash
pnpm vitest run packages/hooks/src/useMount/__tests__/useMount.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 6: Implement useMount**

Create `packages/hooks/src/useMount/useMount.ts`:

```ts
import { useEffect } from 'react';

export function useMount(fn: () => void): void {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
```

Create `packages/hooks/src/useMount/index.ts`:

```ts
export { useMount } from './useMount';
```

- [ ] **Step 7: Create hooks barrel export**

Create `packages/hooks/src/index.ts`:

```ts
export { useMount } from './useMount';
```

- [ ] **Step 8: Run test to verify it passes**

```bash
pnpm vitest run packages/hooks/src/useMount/__tests__/useMount.test.ts
```

Expected: ALL PASS

- [ ] **Step 9: Commit**

```bash
git add packages/hooks/
git commit -m "feat(hooks): scaffold @sc/hooks package with useMount hook"
```

---

## Task 7: @sc/hooks — usePagination Hook

**Files:**

- Create: `packages/hooks/src/usePagination/index.ts`
- Create: `packages/hooks/src/usePagination/usePagination.ts`
- Create: `packages/hooks/src/usePagination/__tests__/usePagination.test.ts`
- Modify: `packages/hooks/src/index.ts`

- [ ] **Step 1: Write the failing test for usePagination**

Create `packages/hooks/src/usePagination/__tests__/usePagination.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.current).toBe(1);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.total).toBe(0);
  });

  it('accepts custom initial values', () => {
    const { result } = renderHook(() => usePagination({ defaultCurrent: 2, defaultPageSize: 10 }));
    expect(result.current.current).toBe(2);
    expect(result.current.pageSize).toBe(10);
  });

  it('changes page via onChange', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.onChange(3, 20);
    });
    expect(result.current.current).toBe(3);
  });

  it('resets to page 1 when pageSize changes', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.onChange(3, 20);
    });
    expect(result.current.current).toBe(3);
    act(() => {
      result.current.onChange(3, 10);
    });
    expect(result.current.current).toBe(1);
  });

  it('updates total via setTotal', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setTotal(100);
    });
    expect(result.current.total).toBe(100);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm vitest run packages/hooks/src/usePagination/__tests__/usePagination.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement usePagination**

Create `packages/hooks/src/usePagination/usePagination.ts`:

```ts
import { useState, useCallback } from 'react';

export interface UsePaginationOptions {
  defaultCurrent?: number;
  defaultPageSize?: number;
}

export interface UsePaginationResult {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  setTotal: (total: number) => void;
}

export function usePagination(options?: UsePaginationOptions): UsePaginationResult {
  const { defaultCurrent = 1, defaultPageSize = 20 } = options ?? {};

  const [current, setCurrent] = useState(defaultCurrent);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [total, setTotal] = useState(0);

  const onChange = useCallback(
    (page: number, newPageSize: number) => {
      if (newPageSize !== pageSize) {
        setCurrent(1);
        setPageSize(newPageSize);
      } else {
        setCurrent(page);
      }
    },
    [pageSize],
  );

  return { current, pageSize, total, onChange, setTotal };
}
```

Create `packages/hooks/src/usePagination/index.ts`:

```ts
export { usePagination } from './usePagination';
export type { UsePaginationOptions, UsePaginationResult } from './usePagination';
```

- [ ] **Step 4: Update hooks barrel export**

Modify `packages/hooks/src/index.ts` to become:

```ts
export { useMount } from './useMount';
export { usePagination } from './usePagination';
export type { UsePaginationOptions, UsePaginationResult } from './usePagination';
```

- [ ] **Step 5: Run test to verify it passes**

```bash
pnpm vitest run packages/hooks/src/usePagination/__tests__/usePagination.test.ts
```

Expected: ALL PASS

- [ ] **Step 6: Commit**

```bash
git add packages/hooks/src/usePagination packages/hooks/src/index.ts
git commit -m "feat(hooks): add usePagination hook"
```

---

## Task 8: @sc/theme Package — Token Definition + ScConfigProvider

**Files:**

- Create: `packages/theme/package.json`
- Create: `packages/theme/tsconfig.json`
- Create: `packages/theme/tsdown.config.ts`
- Create: `packages/theme/src/token.ts`
- Create: `packages/theme/src/ScConfigProvider.tsx`
- Create: `packages/theme/src/useScToken.ts`
- Create: `packages/theme/src/index.ts`
- Create: `packages/theme/src/__tests__/ScConfigProvider.test.tsx`

- [ ] **Step 1: Create packages/theme/package.json**

```json
{
  "name": "@sc/theme",
  "version": "0.1.0",
  "description": "Theme customization and ConfigProvider for SC component library",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "antd": ">=6"
  },
  "sideEffects": false
}
```

- [ ] **Step 2: Create packages/theme/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/theme/tsdown.config.ts**

```ts
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'antd', '@ant-design/x'],
});
```

- [ ] **Step 4: Implement token.ts — custom token type definitions**

Create `packages/theme/src/token.ts`:

```ts
export interface ScToken {
  headerHeight: number;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  pageContentPadding: number;
}

export const defaultScToken: ScToken = {
  headerHeight: 56,
  sidebarWidth: 240,
  sidebarCollapsedWidth: 64,
  pageContentPadding: 24,
};
```

- [ ] **Step 5: Implement useScToken.ts**

Create `packages/theme/src/useScToken.ts`:

```ts
import { useContext } from 'react';
import { ScTokenContext } from './ScConfigProvider';
import type { ScToken } from './token';

export function useScToken(): ScToken {
  const token = useContext(ScTokenContext);
  if (!token) {
    throw new Error('useScToken must be used within a ScConfigProvider');
  }
  return token;
}
```

- [ ] **Step 6: Write the failing test for ScConfigProvider**

Create `packages/theme/src/__tests__/ScConfigProvider.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScConfigProvider } from '../ScConfigProvider';
import { useScToken } from '../useScToken';
import { defaultScToken } from '../token';

function TokenConsumer() {
  const token = useScToken();
  return <div data-testid="token">{JSON.stringify(token)}</div>;
}

describe('ScConfigProvider', () => {
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
    expect(() => {
      render(<TokenConsumer />);
    }).toThrow('useScToken must be used within a ScConfigProvider');
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

```bash
pnpm vitest run packages/theme/src/__tests__/ScConfigProvider.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 8: Implement ScConfigProvider.tsx**

Create `packages/theme/src/ScConfigProvider.tsx`:

```tsx
import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import { defaultScToken } from './token';
import type { ScToken } from './token';

export const ScTokenContext = createContext<ScToken | null>(null);

export interface ScConfigProviderProps {
  children: ReactNode;
  theme?: ThemeConfig;
  scToken?: Partial<ScToken>;
}

export function ScConfigProvider({ children, theme, scToken }: ScConfigProviderProps) {
  const mergedScToken = useMemo(() => ({ ...defaultScToken, ...scToken }), [scToken]);

  return (
    <ConfigProvider theme={theme}>
      <ScTokenContext.Provider value={mergedScToken}>{children}</ScTokenContext.Provider>
    </ConfigProvider>
  );
}
```

- [ ] **Step 9: Create theme barrel export**

Create `packages/theme/src/index.ts`:

```ts
export { ScConfigProvider } from './ScConfigProvider';
export type { ScConfigProviderProps } from './ScConfigProvider';
export { useScToken } from './useScToken';
export { defaultScToken } from './token';
export type { ScToken } from './token';
```

- [ ] **Step 10: Run test to verify it passes**

```bash
pnpm vitest run packages/theme/src/__tests__/ScConfigProvider.test.tsx
```

Expected: ALL PASS

- [ ] **Step 11: Commit**

```bash
git add packages/theme/
git commit -m "feat(theme): scaffold @sc/theme with ScConfigProvider and custom tokens"
```

---

## Task 9: @sc/components Package — Scaffold + ProTable

**Files:**

- Create: `packages/components/package.json`
- Create: `packages/components/tsconfig.json`
- Create: `packages/components/tsdown.config.ts`
- Create: `packages/components/src/index.ts`
- Create: `packages/components/src/ProTable/index.ts`
- Create: `packages/components/src/ProTable/ProTable.types.ts`
- Create: `packages/components/src/ProTable/ProTable.tsx`
- Create: `packages/components/src/ProTable/__tests__/ProTable.test.tsx`

- [ ] **Step 1: Create packages/components/package.json**

```json
{
  "name": "@sc/components",
  "version": "0.1.0",
  "description": "Business components for SC component library",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "antd": ">=6",
    "@ant-design/x": ">=2"
  },
  "dependencies": {
    "@sc/hooks": "workspace:*",
    "@sc/utils": "workspace:*",
    "@sc/theme": "workspace:*"
  },
  "sideEffects": false
}
```

- [ ] **Step 2: Create packages/components/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/components/tsdown.config.ts**

```ts
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'antd', '@ant-design/x'],
});
```

- [ ] **Step 4: Define ProTable types**

Create `packages/components/src/ProTable/ProTable.types.ts`:

```ts
import type { TableProps } from 'antd';

export interface ProTableRequest<TData = Record<string, unknown>> {
  current: number;
  pageSize: number;
  [key: string]: unknown;
}

export interface ProTableResponse<TData = Record<string, unknown>> {
  data: TData[];
  total: number;
  success: boolean;
}

export interface ProTableProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> extends Omit<TableProps<TData>, 'dataSource' | 'loading' | 'pagination'> {
  /** Async function to fetch table data */
  request?: (params: ProTableRequest<TData>) => Promise<ProTableResponse<TData>>;
  /** Default page size */
  defaultPageSize?: number;
  /** Whether to fetch data on mount */
  autoRequest?: boolean;
}
```

- [ ] **Step 5: Write the failing test for ProTable**

Create `packages/components/src/ProTable/__tests__/ProTable.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ProTable } from '../ProTable';
import type { ProTableProps } from '../ProTable.types';

// Mock antd Table to avoid full antd rendering complexity in unit tests
vi.mock('antd', () => ({
  Table: (props: Record<string, unknown>) => (
    <div data-testid="antd-table" data-loading={String(props.loading)}>
      {Array.isArray(props.dataSource) &&
        (props.dataSource as Array<Record<string, unknown>>).map((item, i) => (
          <div key={i} data-testid="table-row">
            {JSON.stringify(item)}
          </div>
        ))}
    </div>
  ),
  Spin: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ProTable', () => {
  it('renders without request', () => {
    render(<ProTable columns={[{ title: 'Name', dataIndex: 'name' }]} />);
    expect(screen.getByTestId('antd-table')).toBeInTheDocument();
  });

  it('fetches data on mount when request is provided', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [{ name: 'Alice' }],
      total: 1,
      success: true,
    });

    render(<ProTable columns={[{ title: 'Name', dataIndex: 'name' }]} request={request} />);

    await waitFor(() => {
      expect(request).toHaveBeenCalledWith({ current: 1, pageSize: 20 });
    });

    await waitFor(() => {
      expect(screen.getByTestId('table-row')).toBeInTheDocument();
    });
  });

  it('does not fetch on mount when autoRequest is false', () => {
    const request = vi.fn();
    render(
      <ProTable
        columns={[{ title: 'Name', dataIndex: 'name' }]}
        request={request}
        autoRequest={false}
      />,
    );
    expect(request).not.toHaveBeenCalled();
  });

  it('uses custom defaultPageSize', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [],
      total: 0,
      success: true,
    });

    render(
      <ProTable
        columns={[{ title: 'Name', dataIndex: 'name' }]}
        request={request}
        defaultPageSize={10}
      />,
    );

    await waitFor(() => {
      expect(request).toHaveBeenCalledWith({ current: 1, pageSize: 10 });
    });
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

```bash
pnpm vitest run packages/components/src/ProTable/__tests__/ProTable.test.tsx
```

Expected: FAIL — `ProTable` module not found.

- [ ] **Step 7: Implement ProTable.tsx**

Create `packages/components/src/ProTable/ProTable.tsx`:

```tsx
import { useState, useEffect, useCallback } from 'react';
import { Table } from 'antd';
import type { ProTableProps, ProTableRequest, ProTableResponse } from './ProTable.types';

export function ProTable<TData extends Record<string, unknown> = Record<string, unknown>>({
  request,
  defaultPageSize = 20,
  autoRequest = true,
  columns,
  ...rest
}: ProTableProps<TData>) {
  const [dataSource, setDataSource] = useState<TData[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(
    async (params: ProTableRequest<TData>) => {
      if (!request) return;
      setLoading(true);
      try {
        const response: ProTableResponse<TData> = await request(params);
        if (response.success) {
          setDataSource(response.data);
          setTotal(response.total);
        }
      } finally {
        setLoading(false);
      }
    },
    [request],
  );

  useEffect(() => {
    if (autoRequest && request) {
      fetchData({ current, pageSize });
    }
    // Only run on mount and when pagination changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize, autoRequest]);

  const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
    const nextCurrent = pagination.current ?? 1;
    const nextPageSize = pagination.pageSize ?? pageSize;

    if (nextPageSize !== pageSize) {
      setCurrent(1);
      setPageSize(nextPageSize);
    } else {
      setCurrent(nextCurrent);
    }
  };

  return (
    <Table<TData>
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={{
        current,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 条`,
      }}
      onChange={(pagination) => handleTableChange(pagination)}
      {...rest}
    />
  );
}
```

- [ ] **Step 8: Create ProTable barrel export**

Create `packages/components/src/ProTable/index.ts`:

```ts
export { ProTable } from './ProTable';
export type { ProTableProps, ProTableRequest, ProTableResponse } from './ProTable.types';
```

- [ ] **Step 9: Create components barrel export**

Create `packages/components/src/index.ts`:

```ts
export { ProTable } from './ProTable';
export type { ProTableProps, ProTableRequest, ProTableResponse } from './ProTable';
```

- [ ] **Step 10: Run test to verify it passes**

```bash
pnpm vitest run packages/components/src/ProTable/__tests__/ProTable.test.tsx
```

Expected: ALL PASS

- [ ] **Step 11: Commit**

```bash
git add packages/components/
git commit -m "feat(components): scaffold @sc/components with ProTable component"
```

---

## Task 10: @sc/components — SearchForm Component

**Files:**

- Create: `packages/components/src/SearchForm/index.ts`
- Create: `packages/components/src/SearchForm/SearchForm.types.ts`
- Create: `packages/components/src/SearchForm/SearchForm.tsx`
- Create: `packages/components/src/SearchForm/__tests__/SearchForm.test.tsx`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Define SearchForm types**

Create `packages/components/src/SearchForm/SearchForm.types.ts`:

```ts
import type { FormProps } from 'antd';

export interface SearchFormField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'datePicker' | 'rangePicker';
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
}

export interface SearchFormProps extends Omit<FormProps, 'onFinish'> {
  fields: SearchFormField[];
  onSearch: (values: Record<string, unknown>) => void;
  onReset?: () => void;
  /** Number of visible fields before collapse, default 3 */
  defaultCollapsed?: number;
  loading?: boolean;
}
```

- [ ] **Step 2: Write the failing test for SearchForm**

Create `packages/components/src/SearchForm/__tests__/SearchForm.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchForm } from '../SearchForm';
import type { SearchFormField } from '../SearchForm.types';

// Mock antd components
vi.mock('antd', () => {
  const Form = Object.assign(
    ({ children, onFinish }: { children: React.ReactNode; onFinish?: (v: unknown) => void }) => (
      <form
        data-testid="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          onFinish?.({});
        }}
      >
        {children}
      </form>
    ),
    {
      Item: ({ children, label }: { children: React.ReactNode; label?: string }) => (
        <div data-testid={`form-item-${label}`}>{children}</div>
      ),
      useForm: () => [{ resetFields: vi.fn(), submit: vi.fn() }],
    },
  );

  return {
    Form,
    Input: (props: Record<string, unknown>) => <input data-testid={`input-${props.placeholder}`} />,
    Select: (props: Record<string, unknown>) => (
      <select data-testid={`select-${props.placeholder}`} />
    ),
    Button: ({
      children,
      onClick,
      htmlType,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      htmlType?: string;
    }) => (
      <button type={htmlType === 'submit' ? 'submit' : 'button'} onClick={onClick}>
        {children}
      </button>
    ),
    Space: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Col: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

const mockFields: SearchFormField[] = [
  { name: 'name', label: 'Name', type: 'input', placeholder: 'Enter name' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Select status',
    options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 },
    ],
  },
];

describe('SearchForm', () => {
  it('renders form fields', () => {
    const onSearch = vi.fn();
    render(<SearchForm fields={mockFields} onSearch={onSearch} />);
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-item-Name')).toBeInTheDocument();
    expect(screen.getByTestId('form-item-Status')).toBeInTheDocument();
  });

  it('renders search and reset buttons', () => {
    const onSearch = vi.fn();
    render(<SearchForm fields={mockFields} onSearch={onSearch} />);
    expect(screen.getByText('搜索')).toBeInTheDocument();
    expect(screen.getByText('重置')).toBeInTheDocument();
  });

  it('calls onSearch on form submit', () => {
    const onSearch = vi.fn();
    render(<SearchForm fields={mockFields} onSearch={onSearch} />);
    fireEvent.submit(screen.getByTestId('search-form'));
    expect(onSearch).toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
pnpm vitest run packages/components/src/SearchForm/__tests__/SearchForm.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 4: Implement SearchForm.tsx**

Create `packages/components/src/SearchForm/SearchForm.tsx`:

```tsx
import { useCallback } from 'react';
import { Form, Input, Select, Button, Space, Row, Col } from 'antd';
import type { SearchFormProps, SearchFormField } from './SearchForm.types';

function renderField(field: SearchFormField) {
  switch (field.type) {
    case 'select':
      return <Select placeholder={field.placeholder} options={field.options} allowClear />;
    case 'input':
    default:
      return <Input placeholder={field.placeholder} allowClear />;
  }
}

export function SearchForm({ fields, onSearch, onReset, loading, ...rest }: SearchFormProps) {
  const [form] = Form.useForm();

  const handleReset = useCallback(() => {
    form.resetFields();
    onReset?.();
  }, [form, onReset]);

  return (
    <Form form={form} onFinish={onSearch} {...rest}>
      <Row>
        {fields.map((field) => (
          <Col key={field.name}>
            <Form.Item name={field.name} label={field.label}>
              {renderField(field)}
            </Form.Item>
          </Col>
        ))}
        <Col>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
```

- [ ] **Step 5: Create SearchForm barrel export**

Create `packages/components/src/SearchForm/index.ts`:

```ts
export { SearchForm } from './SearchForm';
export type { SearchFormProps, SearchFormField } from './SearchForm.types';
```

- [ ] **Step 6: Update components barrel export**

Modify `packages/components/src/index.ts` to become:

```ts
export { ProTable } from './ProTable';
export type { ProTableProps, ProTableRequest, ProTableResponse } from './ProTable';

export { SearchForm } from './SearchForm';
export type { SearchFormProps, SearchFormField } from './SearchForm';
```

- [ ] **Step 7: Run test to verify it passes**

```bash
pnpm vitest run packages/components/src/SearchForm/__tests__/SearchForm.test.tsx
```

Expected: ALL PASS

- [ ] **Step 8: Commit**

```bash
git add packages/components/src/SearchForm packages/components/src/index.ts
git commit -m "feat(components): add SearchForm component"
```

---

## Task 11: Storybook Configuration

**Files:**

- Create: `.storybook/main.ts`
- Create: `.storybook/preview.tsx`
- Create: `packages/components/src/ProTable/ProTable.stories.tsx`
- Create: `packages/components/src/SearchForm/SearchForm.stories.tsx`

- [ ] **Step 1: Create .storybook/main.ts**

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../packages/*/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

- [ ] **Step 2: Create .storybook/preview.tsx**

```tsx
import type { Preview } from '@storybook/react';
import React from 'react';
import { ScConfigProvider } from '../packages/theme/src';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ScConfigProvider>
        <Story />
      </ScConfigProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

- [ ] **Step 3: Create ProTable story**

Create `packages/components/src/ProTable/ProTable.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProTable } from './ProTable';

const meta: Meta<typeof ProTable> = {
  title: 'Components/ProTable',
  component: ProTable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ProTable>;

const mockColumns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '部门', dataIndex: 'department', key: 'department' },
];

const mockRequest = async (params: { current: number; pageSize: number }) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = Array.from({ length: params.pageSize }, (_, i) => ({
    key: String((params.current - 1) * params.pageSize + i),
    name: `用户 ${(params.current - 1) * params.pageSize + i + 1}`,
    age: 20 + (i % 30),
    department: ['技术部', '产品部', '设计部'][i % 3],
  }));
  return { data, total: 100, success: true };
};

export const Basic: Story = {
  args: {
    columns: mockColumns,
    request: mockRequest,
  },
};

export const NoAutoRequest: Story = {
  args: {
    columns: mockColumns,
    request: mockRequest,
    autoRequest: false,
  },
};
```

- [ ] **Step 4: Create SearchForm story**

Create `packages/components/src/SearchForm/SearchForm.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SearchForm } from './SearchForm';

const meta: Meta<typeof SearchForm> = {
  title: 'Components/SearchForm',
  component: SearchForm,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

export const Basic: Story = {
  args: {
    fields: [
      { name: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
      { name: 'department', label: '部门', type: 'input', placeholder: '请输入部门' },
    ],
    onSearch: (values) => {
      console.log('Search:', values);
    },
  },
};
```

- [ ] **Step 5: Commit**

```bash
git add .storybook/ packages/components/src/ProTable/ProTable.stories.tsx packages/components/src/SearchForm/SearchForm.stories.tsx
git commit -m "chore: add Storybook configuration and component stories"
```

---

## Task 12: Changesets Configuration

**Files:**

- Create: `.changeset/config.json`

- [ ] **Step 1: Create .changeset/config.json**

```bash
mkdir -p .changeset
```

Create `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

Note: `"access": "restricted"` for private npm registry. Independent versioning mode is the default (no `"versioning"` key needed).

- [ ] **Step 2: Commit**

```bash
git add .changeset/
git commit -m "chore: add Changesets configuration for independent versioning"
```

---

## Task 13: Husky + lint-staged Setup

**Files:**

- Create: `.husky/pre-commit`

- [ ] **Step 1: Install dependencies and initialize husky**

```bash
pnpm install
pnpm exec husky init
```

- [ ] **Step 2: Create pre-commit hook**

Create `.husky/pre-commit`:

```sh
pnpm exec lint-staged
```

- [ ] **Step 3: Commit**

```bash
git add .husky/ package.json pnpm-lock.yaml
git commit -m "chore: add Husky pre-commit hook with lint-staged"
```

---

## Task 14: Install All Dependencies and Full Verification

- [ ] **Step 1: Install all dependencies**

```bash
cd D:/project/sc
pnpm install
```

Expected: successful install with no errors.

- [ ] **Step 2: Run type check**

```bash
pnpm typecheck
```

Expected: no TypeScript errors.

- [ ] **Step 3: Run all tests**

```bash
pnpm test
```

Expected: all tests pass (utils, hooks, theme, components).

- [ ] **Step 4: Run lint**

```bash
pnpm lint
```

Expected: no lint errors.

- [ ] **Step 5: Run full build**

```bash
pnpm build
```

Expected: all 4 packages build successfully. Each produces `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`.

- [ ] **Step 6: Verify build outputs exist**

```bash
ls packages/utils/dist/
ls packages/hooks/dist/
ls packages/theme/dist/
ls packages/components/dist/
```

Expected: each directory contains `index.js`, `index.cjs`, `index.d.ts` (and potentially `.d.cts`).

- [ ] **Step 7: Commit lock file and any adjustments**

```bash
git add -A
git commit -m "chore: verify full build, test, and lint pipeline"
```

---

## Self-Review Checklist

1. **Spec coverage:**
   - [x] pnpm workspaces monorepo — Task 1
   - [x] TypeScript base config — Task 2
   - [x] ESLint + Prettier — Task 3
   - [x] @sc/utils package — Task 4
   - [x] @sc/hooks package — Tasks 6, 7
   - [x] @sc/theme (ScConfigProvider, useScToken, token) — Task 8
   - [x] @sc/components (ProTable, SearchForm) — Tasks 9, 10
   - [x] Storybook documentation — Task 11
   - [x] Changesets versioning — Task 12
   - [x] Husky + lint-staged — Task 13
   - [x] Full verification — Task 14
   - [x] tsdown (updated from deprecated tsup) — all package configs

2. **Placeholder scan:** No TBD/TODO/placeholders found. All steps include complete code.

3. **Type consistency:** ProTableProps, ProTableRequest, ProTableResponse, SearchFormProps, SearchFormField, ScToken, ScConfigProviderProps — all consistent across definitions, exports, and usage.
