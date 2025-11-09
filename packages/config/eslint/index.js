/**
 * Shared ESLint configuration for Sunup monorepo
 */
module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  // Story 1.4 RLS Linting Note:
  // Custom ESLint rule for enforcing tenantId checks in Convex queries
  // is documented in docs/multi-tenant-rls.md. Implementation of automated
  // linting rule deferred to future story due to complexity of AST parsing
  // for Convex-specific patterns. For now, rely on:
  // 1. Code review process
  // 2. TypeScript type checking (schema enforces tenantId)
  // 3. Runtime errors from getAuthUserWithTenant if not called
  // 4. Documentation and developer education
};
