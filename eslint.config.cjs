const js = require('@eslint/js')
const globals = require('globals')
const prettierPlugin = require('eslint-plugin-prettier')

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': ['error'],
      semi: ['error', 'never'],
      'no-underscore-dangle': 'off',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
        },
      ],
      'max-len': ['error', { code: 100 }],
      quotes: [2, 'single', { avoidEscape: true }],
      'no-shadow': 0,
      'no-plusplus': 0,
      'no-param-reassign': ['error', { ignorePropertyModificationsFor: ['draft'] }],
    },
  },
]
