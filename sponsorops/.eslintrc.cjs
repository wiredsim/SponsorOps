module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '18.2',
    },
  },
  plugins: ['react-refresh'],
  rules: {
    // React Refresh
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // React
    'react/prop-types': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/display-name': 'off',
    'react/jsx-no-target-blank': 'error',

    // Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Code quality
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'prefer-const': 'warn',
    'eqeqeq': ['warn', 'always'],
    'no-eval': 'error',
    'no-implied-eval': 'error',

    // Security
    'no-script-url': 'error',
  },
};
