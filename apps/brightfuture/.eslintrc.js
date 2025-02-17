module.exports = {
  root: true,
  extends: ['@rjh/eslint-config/next.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  ignorePatterns: ['*.config.js', '*.config.mjs'],
}
