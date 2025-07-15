# Cursor Rules - Comprehensive Development Guidelines

## Overview

This file integrates all development rules and workflows from the RULES directory. Cursor will automatically apply these guidelines during development tasks.

## Core Principles

### 1. Task-Driven Development

- All code changes require an agreed-upon authorizing task
- Tasks MUST be associated with an agreed-upon PBI (Product Backlog Item)
- No unapproved changes outside explicit task scope
- User is sole decider for scope and design

### 2. Code Quality Standards

- Follow DRY principle: Define information once, reference elsewhere
- Use named constants for repeated/special values
- Maintain 300-line file limit where applicable
- Write clean, maintainable, and testable code

### 3. Documentation Requirements

- Create comprehensive technical documentation for APIs/interfaces
- Update documentation immediately when code changes
- Use LLM-optimized format with concrete file references
- Include timestamps and avoid duplication

## Development Workflows

### Commit Guidelines

- Use conventional commit format with descriptive emojis
- Run pre-commit checks by default (lint, build, generate docs)
- Commit types: ✨ feat, 🐛 fix, 📝 docs, ♻️ refactor, 🎨 style, ⚡️ perf, ✅ test, 🧑‍💻 chore
- Keep commits atomic and focused
- Write in imperative mood ("Add feature" not "Added feature")

### Pull Request Review Process

Review from multiple perspectives:

1. **Product Manager**: Business value, user experience, strategic alignment
2. **Developer**: Code quality, standards, performance, scalability
3. **Quality Engineer**: Test coverage, edge cases, regression risk
4. **Security Engineer**: Vulnerabilities, data handling, authentication
5. **DevOps**: CI/CD integration, configuration, infrastructure
6. **UI/UX Designer**: Visual consistency, usability, accessibility

**Key Principle**: Improvements scheduled for "later" must be addressed NOW!

### Bug Fix Workflow

1. Create GitHub issue with descriptive title
2. Create feature branch: `git checkout -b fix/<issue-description>`
3. Write failing test that demonstrates the bug
4. Implement the fix
5. Verify test passes and run full test suite
6. Commit with format: `fix: <description> (#<issue-number>)`
7. Create PR linking the issue with "Fixes #<issue-number>"

## Code Quality & Analysis

### Check Process

- Run `npm run check` (or project-specific check command)
- DO NOT commit during check process
- Focus only on fixing identified issues
- Priority order: Build-breaking errors → Test failures → Linting errors → Warnings

### Code Analysis Areas

1. **Knowledge Graph Generation**: Map component relationships
2. **Code Quality Evaluation**: Complexity metrics, maintainability index
3. **Performance Analysis**: Bottlenecks, memory usage, algorithm complexity
4. **Security Review**: Vulnerability scanning, input validation
5. **Architecture Review**: Design patterns, SOLID principles
6. **Test Coverage Analysis**: Coverage percentages, untested paths

## Problem Solving & Implementation

### Issue Analysis Template

1. **Issue Summary**: Brief overview
2. **Problem Statement**: Clear definition of what needs solving
3. **Technical Approach**: High-level solution and architecture
4. **Implementation Plan**: Step-by-step breakdown
5. **Test Plan**: Testing strategy and test cases
6. **Files to Modify**: Existing files needing changes
7. **Files to Create**: New files needed
8. **Success Criteria**: Measurable completion criteria

### Five Whys Analysis

Use root cause analysis technique:

1. Define the problem clearly
2. Ask "Why?" five times to reach root cause
3. Validate the logical chain
4. Develop solutions addressing root cause, not symptoms
5. Focus on process, not people

## Documentation & Visualization

### Documentation Standards

- Create comprehensive docs for components/features
- Include: Overview, Usage, API/Props, Component Hierarchy, State Management
- Add: Behavior, Error Handling, Performance, Accessibility, Testing
- Use concrete file references and code examples
- Follow project documentation standards

### Mermaid Diagram Generation

Generate diagrams for:

- **Entity Relationship**: Database schemas and data models
- **Flow Charts**: Process and logic flow
- **Sequence Diagrams**: Interaction flows
- **Class Diagrams**: Object-oriented design

Validation: `npx -p @mermaid-js/mermaid-cli mmdc -i <input>.md -o test.md`

## Automation & Integration

### Screenshot Automation

- Use AppleScript patterns for automated screenshot capture
- Identify applications by Bundle ID, Process Name, or Absolute Path
- Include error handling and timing considerations
- Support multiple window screenshots and specific window states
- Integrate with CI/CD systems and testing frameworks

### Best Practices

- Wrap operations in try blocks with proper error handling
- Allow appropriate timing for app launch and window focus
- Use robust process identification strategies
- Verify screenshot creation and file integrity

## Testing Strategy

### Test Types

- **Unit Tests**: Isolate functions/classes, mock externals
- **Integration Tests**: Multiple components, real internal infrastructure
- **E2E Tests**: Critical user paths

### Test Plan Requirements

- PBI-level: CoS in PBI detail, include E2E CoS Test task
- Task-level: Every code task needs Test Plan section
- Simple tasks: Compilation, basic integration
- Complex tasks: Objectives, scope, environment, mocks, scenarios
- No "Done" without passing tests from plan

## File Organization

### Documentation Structure

- `docs/project-overview.md`: Project purpose and key files
- `docs/architecture.md`: System organization and component map
- `docs/build-system.md`: Build workflows and platform setup
- `docs/testing.md`: Testing approach and test file locations
- `docs/development.md`: Development environment and patterns
- `docs/deployment.md`: Packaging and distribution
- `docs/files.md`: Comprehensive file catalog

### Timestamp Format

All generated files must start with:

```
<!-- Generated: YYYY-MM-DD HH:MM:SS UTC -->
```

## Status Management

### PBI Workflow Statuses

- Proposed → Agreed → InProgress → InReview → Done → Rejected
- All status transitions must be logged with timestamp, PBI_ID, event, details, user

### Task Workflow Statuses

- Proposed → Agreed → InProgress → Review → Done → Blocked
- Only one task per PBI InProgress unless User approves more
- All status transitions must be logged in task's Status History section

## Version Control

### Commit Messages

- Format: `<task_id> <task_description>` (e.g., "1-7 Add pino logging...")
- PR Title: `[<task_id>] <task_description>` with link to task in PR body
- On Done: `git acp "<task_id> <task_description>"` (stages all, commits, pushes)

## External Package Integration

### Research Requirements

- For tasks with external packages: Research official docs first
- Create `<task_id>-<package>-guide.md` with API usage, date-stamp, and source links
- Location: `tasks/` or `docs/delivery/<PBI-ID>/guides/`

## Security & Compliance

### Security Review Checklist

- Vulnerability scanning and input validation
- Authentication and authorization review
- Sensitive data handling and compliance
- Security standards adherence

### Data Protection

- Validate user input thoroughly
- Protect sensitive data appropriately
- Follow security best practices
- Document security considerations

## Performance Considerations

### Optimization Guidelines

- Identify and address bottlenecks
- Monitor memory usage patterns
- Optimize algorithm complexity
- Review database query performance
- Consider scalability implications

## Accessibility Standards

### Accessibility Requirements

- Ensure features are accessible to all users
- Follow WCAG guidelines
- Test with assistive technologies
- Document accessibility features

## Integration Points

### CI/CD Integration

- Ensure builds succeed in CI/CD pipeline
- Proper configuration management
- Infrastructure and deployment considerations
- Monitoring and rollback capabilities

### External Systems

- Document integration points clearly
- Handle external API failures gracefully
- Monitor external dependencies
- Plan for system outages

## Maintenance & Support

### Code Maintenance

- Keep code clean and well-documented
- Regular refactoring to reduce technical debt
- Update dependencies regularly
- Monitor for security vulnerabilities

### Support Documentation

- Create troubleshooting guides
- Document common issues and solutions
- Provide clear error messages
- Maintain up-to-date user documentation

## Front-End Implementation Standards

These rules apply to ReactJS, NextJS, JavaScript/TypeScript, TailwindCSS, HTML and CSS projects.

### General Coding Practices

- Think step-by-step: write detailed pseudocode before actual implementation and confirm the plan.
- Prefer early returns to reduce nesting and improve readability.
- Follow the **DRY** principle at all times—extract reusable logic and constants.
- Use descriptive names for variables, functions and components. Event handlers are prefixed with `handle`, e.g. `handleClick`.
- Use **const** arrow functions for component logic and utilities (`const toggle = () => { … }`).
- Remove ALL `TODO`/placeholder comments before committing; shipped code must be complete and compile without errors.

### TailwindCSS & Mark-up

- Style exclusively with Tailwind utility classes; avoid inline `style` attributes or separate CSS files unless explicitly required.
- When conditionally composing class names prefer helper utilities (`clsx`, `classnames`) or logical object syntax over ternary operators.
- Ensure accessibility: add `tabIndex`, `aria-*` attributes, and keyboard handlers (`onKeyDown`) to interactive elements.

### Completeness Checklist

1. All required imports included and paths resolved.
2. Components are exported with correct names.
3. No ESLint/TypeScript errors.
4. Unit/Integration tests added or updated as part of the task.

---

## Tooling & Automation (Formatting & Linting)

To guarantee consistent code style and prevent regressions the following toolchain **MUST** be configured and pass on every commit:

1. **Prettier** – default formatter for all supported file types (`.ts, .tsx, .js, .jsx, .json, .md`, etc.).
2. **ESLint** with TypeScript support and recommended plugins:
   - `@typescript-eslint` – TypeScript lint rules.
   - `eslint-plugin-react` – React best-practices.
   - `eslint-plugin-tailwindcss` – Tailwind utility validation (where applicable).
3. **Husky** Git hooks + **lint-staged** to run Prettier and ESLint on staged files _before_ each commit:

```json
"lint-staged": {
  "**/*.{ts,tsx,js,jsx,json,md}": [
    "prettier --write"
  ],
  "**/*.{ts,tsx,js,jsx}": [
    "eslint --fix"
  ]
}
```

If any of these checks fail the commit **MUST** be aborted and issues fixed before retrying.

---

## Spelling & Grammar

All comments, documentation, variable names, commit messages and user-visible text **MUST** be free of spelling or grammatical errors. Project-specific technical terms can be added to a custom dictionary when necessary.

---

## Specialized Rule Sets

The following domain-specific rule sets are defined under `Rules revision/` and include `alwaysApply: true` front-matter, so Cursor loads them automatically:

- `front-end.mdc` – Front-end implementation standards (React/Next/Tailwind)
- `formatting-linting.mdc` – Prettier / ESLint / Husky & lint-staged automation
- `spelling-grammar.mdc` – Spelling & grammar enforcement
- `backend-api-standards.mdc` – Backend & API standards
- `observability.mdc` – Logging, tracing, metrics
- `security.mdc` – Security deep-dive
- `performance-profiling.mdc` – Performance & profiling guidelines
- `i18n.mdc` – Internationalization rules
- `adr.mdc` – Architecture Decision Records
- `mobile.mdc` – Mobile / React Native standards

---

**Note**: These rules are designed to be automatically applied by Cursor during development. They ensure consistent quality, proper documentation, and effective collaboration across all development tasks.

---

## Diagnóstico

- **Muchos archivos `.mdc` en subcarpetas tienen el front-matter `alwaysApply: false` o no lo tienen.**
- Solo algunos (como `front-end.mdc`) ya tienen `alwaysApply: true`.
- Para que Cursor aplique siempre estas reglas, **debes cambiar (o agregar) en el front-matter de cada archivo** la línea:
  ```yaml
  alwaysApply: true
  ```

---

## Plan de acción

Voy a modificar todos los archivos `.mdc` en las subcarpetas de `.cursor` para que tengan en su front-matter:

```yaml
alwaysApply: true
```

Esto se hará:

- Si ya existe la línea `alwaysApply: false`, se cambiará a `alwaysApply: true`.
- Si no existe la línea, se agregará después de las líneas de front-matter (o se creará el bloque si no existe).

¿Quieres que realice este cambio en todos los archivos `.mdc` detectados? (Esto incluye los de las rutas:

- `.cursor/Problem Solving & Implementation/`
- `.cursor/Documentation & Visualization/`
- `.cursor/Development Workflows/`
- `.cursor/Code Quality & Analysis/`
- `.cursor/Automation & Integration/`
- `.cursor/rules/`
- `.cursor/specialized-rules/quality/`
- `.cursor/specialized-rules/governance/`
- `.cursor/specialized-rules/domain/`
- `.cursor/specialized-rules/devops/`
  )

**Confírmame si quieres que lo aplique a todos o solo a una selección específica.**
