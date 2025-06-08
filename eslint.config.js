import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node, // <-- add node globally (helps puppeteer tests too)
        global: 'writable',
      },
      sourceType: 'module',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['warn', 2],
      '@stylistic/js/linebreak-style': ['warn', 'unix'],
      '@stylistic/js/quotes': ['warn', 'single'],
      '@stylistic/js/semi': ['warn', 'always'],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    }
  },
  {
    ignores: ['docs/**'],
  },
]);
