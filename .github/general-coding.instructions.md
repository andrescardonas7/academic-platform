---
applyTo: '**'
---

# General Coding Standards

## Naming Conventions

- Use PascalCase for component names, interfaces, and type aliases.
- Use camelCase for variables, functions, and methods.
- Prefix private class members with underscore (\_).
- Use ALL_CAPS for constants.

### Examples

```typescript
// Component name
function UserProfile() {
  /* ... */
}

// Function name
async function fetchData() {
  /* ... */
}

// Constant
const MAX_RETRIES = 3;

// Private member
class Cache {
  private _store: Record<string, any> = {};
}
```

## Error Handling

- Use try/catch blocks for async operations.
- Implement proper error boundaries in React components.
- Always log errors with contextual information.

### Examples

```javascript
try {
  const response = await api.get('/data');
} catch (error) {
  console.error('Error fetching data:', error);
  // handle fallback
}
```

## Accessibility Validation

In addition to WCAG guidelines, automate accessibility checks using tools like axe and Lighthouse.

### Examples

```bash
# Run axe accessibility scan on a built HTML file
npx axe ./build/index.html

# Run Lighthouse CI for automated audits
npx lhci autorun
```

Include accessibility reports in CI pipelines and fail builds on aXe violations.

## Check Process

Perform comprehensive code quality and security checks.

### Primary Task:

Run `npm run check` (or project-specific check command) and resolve any resulting errors.

### Important:

- DO NOT commit any code during this process.
- DO NOT change version numbers.
- Focus only on fixing issues identified by checks.

### Common Checks Include:

1. **Linting**: Code style and syntax errors.
2. **Type Checking**: TypeScript/Flow type errors.
3. **Unit Tests**: Failing test cases.
4. **Security Scan**: Vulnerability detection.
5. **Code Formatting**: Style consistency.
6. **Build Verification**: Compilation errors.

### Process:

1. Run the check command.
2. Analyze output for errors and warnings.
3. Fix issues in priority order:
   - Build-breaking errors first.
   - Test failures.
   - Linting errors.
   - Warnings.
4. Re-run checks after each fix.
5. Continue until all checks pass.

### For Different Project Types:

- **JavaScript/TypeScript**: `npm run check` or `yarn check`.
- **Python**: `black`, `isort`, `flake8`, `mypy`.
- **Rust**: `cargo check`, `cargo clippy`.
- **Go**: `go vet`, `golint`.
- **Swift**: `swift-format`, `swiftlint`.

## Rules Review Cadence

To keep guidelines up to date, perform a periodic review of instruction files:

- Schedule reviews at least quarterly to adapt to new tools and best practices.
- Assign a maintainer to evaluate and update rules based on team feedback and emerging standards.
- Document changes with timestamps and version notes in each instruction file.
