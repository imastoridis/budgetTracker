// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

// Import the specific Prettier plugins for flat config
import eslintConfigPrettier from 'eslint-config-prettier';
import jsoncPlugin from 'eslint-plugin-jsonc';
const { configs: jsoncConfigs } = jsoncPlugin;

export default defineConfig([
  // Base JS/TS Configuration
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    // The processor handles inline templates in Angular components
    processor: angular.processInlineTemplates,
    rules: {
      // Angular-specific rules
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },

  // HTML Template Configuration
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      eslintConfigPrettier,
    ],
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // JSON Configuration This uses the jsonc plugin for JSON-specific rules (e.g., valid keys, no trailing commas).
  {
    files: ['**/*.json'],
    extends: jsoncConfigs['flat/recommended-with-json'],
    rules: {},
  },

  // Prettier Integration 
  {
    files: [
      '**/*.ts',
      '**/*.html',
      '**/*.js',
      '**/*.json',
      '**/*.css',
      '**/*.scss',
    ],
    extends: [eslintConfigPrettier],
  },
]);
