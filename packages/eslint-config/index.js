module.exports = {
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
    // Relaxed rules for development
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-unused-vars': 'off', // Use TypeScript version instead
    'no-undef': 'error',
  },
  overrides: [
    // Test files configuration
    {
      files: ['**/*.test.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}'],
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
        // Mock functions
        mockFetch: 'readonly',
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-undef': 'off', // Jest globals are handled above
      },
    },
    // React files configuration
    {
      files: ['**/*.{tsx,jsx}'],
      extends: ['plugin:react/recommended'],
      plugins: ['react'],
      env: {
        browser: true,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
      },
    },
  ],
};
