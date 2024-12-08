module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import', 'react', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "prefer-const": "error",
    "react/react-in-jsx-scope": "off",
    "prettier/prettier": [
      "warn",
      {
        "printWidth": 100,
        "trailingComma": "all",
        "tabWidth": 2,
        "semi": true,
        "singleQuote": false,
        "bracketSpacing": true,
        "arrowParens": "always",
        "endOfLine": "auto"
      }
    ],
    "import/order": [
      "warn",
      {
        "groups": ["builtin", "object", "external", "internal", "parent", "sibling", "index", "type"],
        "pathGroups": [
          {
            "pattern": "~/**",
            "group": "external",
            "position": "after"
          }
        ],
      }
    ],
    "react/self-closing-comp": "warn",
    "react/jsx-sort-props": [
      "warn",
      {
        "callbacksLast": true,
        "shorthandFirst": true,
        "noSortAlphabetically": false,
        "reservedFirst": true
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "padding-line-between-statements": [
      "warn",
      {"blankLine": "always", "prev": "*", "next": "return"},
      {"blankLine": "always", "prev": ["const", "let", "var"], "next": "*"},
      {"blankLine": "any", "prev": ["const", "let", "var"], "next": ["const", "let", "var"]}
    ]
  },
}