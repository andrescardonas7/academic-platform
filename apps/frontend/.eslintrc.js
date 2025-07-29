module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // Temporarily disable for tests
    'react/no-unescaped-entities': 'off', // Allow quotes in JSX
    'jsx-a11y/role-supports-aria-props': 'warn', // Downgrade to warning
    'import/no-anonymous-default-export': 'warn', // Downgrade to warning
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
