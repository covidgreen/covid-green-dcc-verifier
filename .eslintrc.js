module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    '@react-native-community',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '@app/components/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@app/context/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@app/lib/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@app/types/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'no-use-before-define': ['error'],
    'react-native/no-inline-styles': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-shadow': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    // ESLint doesn't find React Native components
    // Remove this setting when this issue is fixed.
    // https://github.com/facebook/react-native/issues/28549
    'import/ignore': ['react-native'],
    'import/resolver': {
      'babel-module': {},
    },
  },
  globals: {
    crypto: true,
  },
  env: {
    'jest/globals': true,
  },
}
