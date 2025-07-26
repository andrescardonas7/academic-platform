/**
 * ESLint Custom Rule: no-unsafe-exec
 * Prevents unsafe OS command execution (SonarQube security compliance)
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Make sure that executing OS commands is safe here (SonarQube security)',
      category: 'Security',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      unsafeExec:
        'Make sure that executing this OS command is safe here. Consider input validation and sanitization.',
      dangerousFunction:
        'Dangerous function "{{functionName}}" detected. Ensure proper security measures are in place.',
    },
  },

  create(context) {
    const dangerousFunctions = [
      'execSync',
      'exec',
      'spawn',
      'spawnSync',
      'fork',
      'execFile',
      'execFileSync',
    ];

    return {
      CallExpression(node) {
        // Check for direct function calls
        if (
          node.callee.type === 'Identifier' &&
          dangerousFunctions.includes(node.callee.name)
        ) {
          context.report({
            node,
            messageId: 'dangerousFunction',
            data: {
              functionName: node.callee.name,
            },
          });
        }

        // Check for require('child_process').execSync patterns
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property &&
          dangerousFunctions.includes(node.callee.property.name)
        ) {
          // Check if it's from child_process module
          if (
            node.callee.object.type === 'CallExpression' &&
            node.callee.object.callee.name === 'require' &&
            node.callee.object.arguments[0] &&
            node.callee.object.arguments[0].value === 'child_process'
          ) {
            context.report({
              node,
              messageId: 'unsafeExec',
            });
          }
        }

        // Check for destructured imports: const { execSync } = require('child_process')
        if (
          node.callee.type === 'Identifier' &&
          dangerousFunctions.includes(node.callee.name)
        ) {
          // Look for variable declaration in scope
          const scope = context.getScope();
          const variable = scope.variables.find(
            (v) => v.name === node.callee.name
          );

          if (variable && variable.defs.length > 0) {
            const def = variable.defs[0];
            if (
              def.type === 'Variable' &&
              def.node.init &&
              def.node.init.type === 'CallExpression' &&
              def.node.init.callee.name === 'require' &&
              def.node.init.arguments[0] &&
              def.node.init.arguments[0].value === 'child_process'
            ) {
              context.report({
                node,
                messageId: 'unsafeExec',
              });
            }
          }
        }
      },

      // Check import statements
      ImportDeclaration(node) {
        if (node.source.value === 'child_process') {
          node.specifiers.forEach((spec) => {
            if (
              spec.type === 'ImportSpecifier' &&
              dangerousFunctions.includes(spec.imported.name)
            ) {
              context.report({
                node: spec,
                messageId: 'dangerousFunction',
                data: {
                  functionName: spec.imported.name,
                },
              });
            }
          });
        }
      },
    };
  },
};
