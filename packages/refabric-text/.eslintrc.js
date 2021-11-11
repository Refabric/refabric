module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:unicorn/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-null': 'off',
    'unicorn/catch-error-name': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-console-spaces': 'warn',
    'unicorn/explicit-length-check': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-object-from-entries': 'off',
  },
  ignorePatterns: ['dist/*', '.eslintrc.js'],
};
