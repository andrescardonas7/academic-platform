module.exports = {
  root: true,
  extends: ['eslint:recommended', '@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  globals: {
    // Browser APIs
    fetch: 'readonly',
    Request: 'readonly',
    Response: 'readonly',
    Headers: 'readonly',
    AbortController: 'readonly',
    AbortSignal: 'readonly',
    URLSearchParams: 'readonly',
    // Node.js globals
    global: 'readonly',
    process: 'readonly',
    Buffer: 'readonly',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-unused-vars': 'off',
    'no-undef': 'error',
  },
  overrides: [
    {
      files: ['src/index.test.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts'],
      env: {
        jest: true,
        node: true,
      },
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        test: 'readonly',
        global: 'readonly',
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-undef': 'off',
      },
    },
  ],
};
