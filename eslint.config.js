{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json",
    "extraFileExtensions": [".svelte"]
  },
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:security/recommended",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
    "plugin:svelte/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "import", "jsx-a11y", "security", "sonarjs", "unicorn"],
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  },
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc" }
      }
    ],
    "import/no-duplicates": "error",
    "import/no-cycle": "error",
    "import/no-unused-modules": "error",
    "sonarjs/cognitive-complexity": ["error", 10],
    "sonarjs/no-duplicate-string": ["error", { "threshold": 3 }],
    "unicorn/prefer-node-protocol": "error",
    "unicorn/prefer-module": "error",
    "unicorn/no-null": "off",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/filename-case": [
      "error",
      {
        "cases": {
          "camelCase": true,
          "pascalCase": true,
          "kebabCase": true
        }
      }
    ],
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "error",
    "require-await": "error",
    "no-return-await": "error"
  },
  "overrides": [
    {
      "files": ["*.svelte"],
      "parser": "svelte-eslint-parser",
      "parserOptions": {
        "parser": "@typescript-eslint/parser"
      },
      "rules": {
        "svelte/no-at-html-tags": "error",
        "svelte/no-at-debug-tags": "error",
        "svelte/no-target-blank": "error",
        "svelte/button-has-type": "error",
        "svelte/no-useless-mustaches": "error",
        "svelte/require-optimized-style-attribute": "error",
        "svelte/no-reactive-reassign": "error",
        "svelte/require-each-key": "error"
      }
    },
    {
      "files": ["*.config.js", "*.config.ts"],
      "rules": {
        "unicorn/prefer-module": "off"
      }
    }
  ]
}
