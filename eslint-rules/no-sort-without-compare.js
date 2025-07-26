/**
 * ESLint Custom Rule: no-sort-without-compare
 * Prevents using Array.sort() without a compare function (SonarQube compliance)
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require compare function for Array.sort() to avoid alphabetical sorting (SonarQube compliance)',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingCompareFunction:
        "Array.sort() must include a compare function. Use .sort((a, b) => a.localeCompare(b, 'es')) for strings.",
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        // Check if this is a .sort() call
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'sort' &&
          node.arguments.length === 0
        ) {
          context.report({
            node,
            messageId: 'missingCompareFunction',
            fix(fixer) {
              // Auto-fix: Add Spanish locale compare function for strings
              return fixer.replaceText(
                node,
                `${context.getSourceCode().getText(node.callee)}((a, b) => a.localeCompare(b, 'es'))`
              );
            },
          });
        }
      },
    };
  },
};
