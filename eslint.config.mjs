import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Astro files
  ...eslintPluginAstro.configs.recommended,

  // TypeScript / JS files
  {
    files: ['**/*.ts', '**/*.js', '**/*.mjs'],
    languageOptions: {
      parser: tsParser,
    },
  },

  // Disable formatting rules that conflict with Prettier
  eslintConfigPrettier,

  {
    ignores: ['dist/', 'node_modules/', '.astro/'],
  },
];
