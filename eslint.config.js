import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["**/node_modules/**", "**/dist/**", "**/data/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^React$" }],
      eqeqeq: ["warn", "smart"],
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
  {
    files: ["tp3-passportjs/server/**/*.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
];
