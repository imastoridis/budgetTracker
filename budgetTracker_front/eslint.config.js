// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');

// This configuration is consolidated to ensure all plugins and rules
// are correctly loaded and scoped, addressing the "Plugin not found" error.
module.exports = defineConfig([
  // 1. Configuration for all TypeScript files (and JS, for consistency)
  {
    files: ['**/*.ts', '**/*.js'],

    // Define the Prettier plugin and rules once
    plugins: {
      prettier: eslintPluginPrettier,
    },

    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,

      // Angular TS rules
      ...angular.configs.tsRecommended,

      // MUST BE LAST: Disable all ESLint rules that conflict with Prettier
      eslintConfigPrettier,
    ],

    // Apply template processor to TS files (to lint inline HTML)
    processor: angular.processInlineTemplates,

    rules: {
      // Angular Selector Rules
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

      // ➡️ Activate the Prettier rule. Since the plugin is defined above, this should work.
      'prettier/prettier': 'error',
    },
  },

  // 2. Configuration specifically for external HTML template files
  {
    files: ['**/*.html'],

    // Define the Prettier plugin again for this context
    plugins: {
      prettier: eslintPluginPrettier,
    },

    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,

      // Disable conflicting style rules for HTML
      eslintConfigPrettier,
    ],

    rules: {
      // Run Prettier formatter on the HTML files
      'prettier/prettier': 'error',
    },
  },
]);
