require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:@typescript-eslint/recommended' // Add this line
  ],
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser' // Add this line to use the TypeScript parser
  },
  plugins: [
    '@typescript-eslint' // Add this line to include the plugin
  ],
  rules: {
    'vue/no-mutating-props': 'error',
    '@typescript-eslint/no-unused-vars': 'error' // You can configure more TypeScript-specific rules here
  }
}
