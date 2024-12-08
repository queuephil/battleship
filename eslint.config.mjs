import globals from 'globals'
import pluginJs from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        jest: true,
        test: true,
        expect: true,
        describe: true,
      },
    },
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
]
