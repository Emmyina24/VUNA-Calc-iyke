import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["assets/js/script.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        module: "writable"
      }
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "error",
      "no-redeclare": "off",
      "semi": ["error", "always"],
      "no-eval": "off"
    }
  }
];
