#!/usr/bin/env node

/**
 * CI 多版本测试辅助脚本
 * 用法: node scripts/set-react-version.mjs <17|18|19>
 *
 * 功能:
 * - 设置 pnpm.overrides 将 react/react-dom 锁定到指定大版本
 * - 自动调整 @testing-library/react 版本以兼容目标 React 版本
 * - 调整 @types/react 和 @types/react-dom 版本
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(__dirname, '..', 'package.json');

const reactVersion = process.argv[2];

if (!['17', '18', '19'].includes(reactVersion)) {
  console.error('Usage: node scripts/set-react-version.mjs <17|18|19>');
  console.error('  Supported versions: 17, 18, 19');
  process.exit(1);
}

const versionMap = {
  '17': {
    react: '^17.0.2',
    reactDom: '^17.0.2',
    antd: '^5.0.0',
    testingLibraryReact: '^12.0.0',
    typesReact: '^17.0.0',
    typesReactDom: '^17.0.0',
  },
  '18': {
    react: '^18.0.0',
    reactDom: '^18.0.0',
    antd: '^5.0.0',
    testingLibraryReact: '^14.0.0',
    typesReact: '^18.0.0',
    typesReactDom: '^18.0.0',
  },
  '19': {
    react: '^19.0.0',
    reactDom: '^19.0.0',
    antd: '^5.0.0',
    testingLibraryReact: '^16.0.0',
    typesReact: '^19.0.0',
    typesReactDom: '^19.0.0',
  },
};

const versions = versionMap[reactVersion];
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

// 设置 pnpm overrides
pkg.pnpm = pkg.pnpm || {};
pkg.pnpm.overrides = {
  ...pkg.pnpm.overrides,
  react: versions.react,
  'react-dom': versions.reactDom,
  antd: versions.antd,
  '@types/react': versions.typesReact,
  '@types/react-dom': versions.typesReactDom,
};

// 调整 devDependencies 中的 testing-library 版本
if (pkg.devDependencies?.['@testing-library/react']) {
  pkg.devDependencies['@testing-library/react'] = versions.testingLibraryReact;
}

// 调整 devDependencies 中的 react 相关版本
if (pkg.devDependencies?.react) {
  pkg.devDependencies.react = versions.react;
}
if (pkg.devDependencies?.['react-dom']) {
  pkg.devDependencies['react-dom'] = versions.reactDom;
}
if (pkg.devDependencies?.['@types/react']) {
  pkg.devDependencies['@types/react'] = versions.typesReact;
}
if (pkg.devDependencies?.['@types/react-dom']) {
  pkg.devDependencies['@types/react-dom'] = versions.typesReactDom;
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`✓ Set React version to ${reactVersion}`);
console.log(`  react: ${versions.react}`);
console.log(`  react-dom: ${versions.reactDom}`);
console.log(`  antd: ${versions.antd}`);
console.log(`  @testing-library/react: ${versions.testingLibraryReact}`);
console.log(`  @types/react: ${versions.typesReact}`);
console.log(`\nRun "pnpm install" to apply changes.`);
