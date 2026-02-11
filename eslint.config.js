import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import boundaries from 'eslint-plugin-boundaries'
import importPlugin from 'eslint-plugin-import'

export default defineConfig([
  globalIgnores(['dist', '*.config.*', 'src/main.tsx']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      boundaries,
      import: importPlugin,
    },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**/*' },
        { type: 'pages', pattern: 'src/pages/**/*' },
        { type: 'widgets', pattern: 'src/widgets/**/*' },
        { type: 'features', pattern: 'src/features/**/*' },
        { type: 'entities', pattern: 'src/entities/**/*' },
        { type: 'shared', pattern: 'src/shared/**/*' },
      ],
      'boundaries/ignore': ['**/*.test.*', '**/*.spec.*', 'src/app/**/*'],
    },
    rules: {
      // FSD 레이어 간 의존성 규칙
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: ['app'],
              allow: ['pages', 'widgets', 'features', 'entities', 'shared'],
            },
            {
              from: ['pages'],
              allow: ['widgets', 'features', 'entities', 'shared'],
            },
            {
              from: ['widgets'],
              allow: ['features', 'entities', 'shared'],
            },
            {
              from: ['features'],
              allow: ['entities', 'shared'],
            },
            {
              from: ['entities'],
              allow: ['shared'],
            },
            {
              from: ['shared'],
              allow: ['shared'],
            },
          ],
        },
      ],
      // Public API를 통한 import 강제 (index.ts만 허용)
      'boundaries/entry-point': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              target: ['app', 'pages', 'widgets', 'features', 'entities'],
              allow: ['index.ts', 'index.tsx'],
            },
            {
              target: ['shared'],
              allow: '**',
            },
          ],
        },
      ],
      // 같은 레이어 내 다른 슬라이스 import 금지
      'boundaries/no-unknown': ['error'],
      'boundaries/no-unknown-files': ['error'],
    },
  },
])
