# Copilot Instructions

1. Introduction

- 1.1 Actors:
- User: Defines requirements, prioritizes, approves, accountable for code.
- AI_Agent: Executes User instructions per PBIs and tasks.
- 1.2 Architectural Compliance: This document is the AI Coding Agent Policy.

2. Fundamental Principles
1. Task-Driven Development: All code changes require an agreed-upon authorizing task.
1. PBI Association: Tasks MUST be associated with an agreed-upon PBI.
1. PRD Alignment: If PRD exists, PBI features MUST align with PRD scope. Report discrepancies.
1. User Authority: User is sole decider for scope and design.
1. User Responsibility: User is responsible for all code changes.
1. No Unapproved Changes: Changes outside explicit task scope are PROHIBITED.
1. Status Synchronisation: Task status in index (1-tasks.md or docs/delivery/<PBI-ID>/tasks.md) MUST match individual task file. Update both immediately on change.
1. Controlled File Creation: AI_Agent shall not create files outside defined PBI/task/source structures without explicit User pre-approval for each file.
1. External Package Research & Docs:

- For tasks with external packages: Research official docs first.
- Create <task_id>-<package>-guide.md (e.g., tasks/2-1-pg-boss-guide.md or per PBI: docs/delivery/<PBI-ID>/guides/<task_id>-<package>-guide.md) with API usage, date-stamp, and source links.

10. Task Granularity: Tasks MUST be minimal, cohesive, testable units.
11. DRY (Don't Repeat Yourself): Define information once; reference elsewhere.

- Task details: In task files, referenced elsewhere.
- PBI docs: Reference task list.
- Exception: Titles/names in lists.

12. Constants for Repeated/Special Values: Values used >1 (esp. "magic numbers") MUST be named constants.
13. API/Interface Technical Documentation: For PBIs creating/modifying APIs/interfaces, create/update technical documentation (usage, contracts, integration, config, errors) in docs/technical/ or inline, linked from PBI detail.
14. Scope Adherence: No gold plating. Propose improvements as new tasks.
15. Change Management:

- Confirm PBI/Task association before discussing/making changes.
- If User requests unassociated change, AI MUST discuss task creation/association first.

16. Fast-Track for Minor Changes (Hotfixes)

For small, critical bug fixes (hotfixes), a lightweight process can be followed:
- An authorizing GitHub Issue is sufficient instead of a full PBI/Task structure.
- The branch name should follow the `hotfix/<issue-description>` convention defined in `copilot.json`.
- The fix must include a failing test that demonstrates the bug, which then passes after the fix.
- The commit message and PR title must reference the issue number (e.g., `fix: resolve login issue (#123)`).

3. Product Backlog Item (PBI) Management

- 3.1 General: All PBI status transitions MUST be logged in PBI history (timestamp, PBI_ID, event, details, user).
- 3.2 Backlog Document (docs/delivery/backlog.md):
- Single source of truth for PBIs, ordered by priority.
- Table: | ID | Actor | User Story | Status | Conditions of Satisfaction (CoS) |
- 3.3 PBI Workflow Statuses: The official list of PBI statuses is defined in `copilot.json` under the `statusManagement.pbiStatuses` key. This file is the single source of truth.
- 3.4 PBI Event Transitions (Summary - full details from original apply):
- create_pbi -> Proposed
- propose_for_backlog (Proposed -> Agreed): Verify PRD alignment.
- start_implementation (Agreed -> InProgress): Create tasks.
- ... (etc. for all transitions, keeping key actions)
- 3.5 PBI Detail Docs (docs/delivery/<PBI-ID>/prd.md):
- Mini-PRD created when PBI -> Agreed.
- Sections: # PBI-<ID>: <Title>, ## Overview, ## Problem Statement, ## User Stories, ## Technical Approach, ## UX/UI Considerations, ## Acceptance Criteria, ## Dependencies, ## Open Questions, ## Related Tasks.
- Links: To backlog.md entry, and backlog.md links here.

4. Task Management

- 4.1 General: All Task status transitions MUST be logged in the task's "Status History" section (Timestamp, Event, From_Status, To_Status, Details, User). Only one task per PBI InProgress unless User approves more.
- 4.2 Task Index File (docs/delivery/<PBI-ID>/tasks.md):
- Title: # Tasks for PBI <PBI-ID>: <PBI Title>
- Intro: This document lists all tasks associated with PBI <PBI-ID>.
- Parent Link: **Parent PBI**: [PBI <PBI-ID>: <PBI Title>](./prd.md)
- Header: ## Task Summary
- Table: | Task ID | Name | Status | Description |
- Name format: [<Task Name>](./<PBI-ID>-<TaskNum>.md)
- 4.3 Individual Task Files (docs/delivery/<PBI-ID>/<PBI-ID>-<TASK-ID>.md):
- Created immediately when added to index, linked from index. Links back to index.
- Sections: # [Task-ID] [Task-Name], ## Description, ## Status History, ## Requirements, ## Implementation Plan, ## Test Plan (see Sec 5.3), ## Verification, ## Files Modified.
- 4.4 Task Workflow Statuses: The official list of Task statuses is defined in `copilot.json` under the `statusManagement.taskStatuses` key. This file is the single source of truth.
- 4.5 Task Event Transitions (Summary - full details from original apply):
- user_approves (Proposed -> Agreed): Create task file. Perform analysis/design.
- start_work (Agreed -> InProgress): Create branch if applicable.
- submit_for_review (InProgress -> Review): Run tests. PR if applicable.
- approve (Review -> Done): Merge. Review next tasks for relevance with User.
- ... (etc.)
- 4.6 Version Control for Task Completion:
- Commit message: <task_id> <task_description> (e.g., 1-7 Add pino logging...)
- PR Title: [<task_id>] <task_description> (link to task in PR body).
- On Done: git acp "<task_id> <task_description>" (stages all, commits, pushes).

5. Testing Strategy and Documentation

- 5.1 Principles: Risk-based, Test Pyramid, Clear/Maintainable, Automated.
- 5.2 Scoping:
- Unit: Isolate functions/classes; mock externals. No direct package API tests. Location: test/unit/.
- Integration: Multiple components. Mock 3rd-party externals; use real internal infra (DBs, queues) in test env. Location: test/integration/ or test/<module>/.
- E2E: Critical user paths.
- 5.3 Test Plan Documentation:
- PBI-Level: CoS in PBI detail (.../prd.md) define high-level scope. PBI task list (.../tasks.md) MUST include one "E2E CoS Test" task (e.g., <PBI-ID>-E2E-CoS-Test.md) for holistic PBI verification.
- Task-Level: Every code task needs "## Test Plan" section in its detail file. Plan detail proportional to task complexity/risk.
- Simple tasks: Compilation, basic integration (e.g., "TS compiles").
- Complex tasks: Objectives, scope, env, mocks, key scenarios, success criteria.
- No "Done" without passing tests from its plan.
- Concentrate detailed edge cases in E2E CoS Test task; individual tasks focus on their specific functionality.

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

## Principles
## Principles
- SOLID
- DRY (Don't Repeat Yourself): Avoid unnecessary code repetition
- KISS (Keep It Simple, Stupid): Keep code as simple as possible
- YAGNI (You Aren't Gonna Need It): Don't implement features until they're actually needed
---

# 📌 Rule: Strict Version Control When Installing Dependencies

## 🧩 Description

When installing dependencies, always ensure that **all packages belonging to the same family or ecosystem** (such as Prisma, Next.js, Tailwind, etc.) use **exactly the same version**.
**Never mix major or minor versions** between packages that are tightly coupled or interdependent.

---

## ✅ Examples

- If you install `@prisma/client@5.22.0`, then you must also install `@prisma/engines@5.22.0` (or any other Prisma-related package) using **the exact same version**.

- Use the `--exact` flag when installing, or pin the versions directly in your `package.json` to avoid version mismatch errors.

---

## ⚠️ Additional Notes

- **DO NOT upgrade or install secondary packages** unless you have verified they are compatible with the main package version.

- This rule must be enforced in **every context where dependencies are managed**:
  - Using `npm`, `pnpm`, `yarn`, `npx`
  - CLI tools and scripting environments
  - `Dockerfile` configurations
  - Build and deployment scripts

---

By following this rule, you prevent critical version mismatches that can lead to build failures, runtime errors, or inconsistent development environments.










**Note**: These rules are designed to be automatically applied by Cursor during development. They ensure consistent quality, proper documentation, and effective collaboration across all development tasks.
