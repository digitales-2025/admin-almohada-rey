/* eslint-disable import/no-anonymous-default-export */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("next", "next/core-web-vitals", "prettier"),
  {
    plugins: {
      prettier,
      import: importPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      camelcase: "off",
      "import/prefer-default-export": "off",
      "react/jsx-filename-extension": "off",
      "react/jsx-props-no-spreading": "off",
      "react/no-unused-prop-types": "off",
      "react/require-default-props": "off",
      "react/no-unescaped-entities": "off",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
        },
      ],
      "no-unused-vars": "error", // Para detectar variables no usadas en JS
      "import/no-unused-modules": "error", // Para detectar importaciones no usadas
    },
  },
  ...compat.extends("plugin:@typescript-eslint/recommended", "prettier").map((config) => ({
    ...config,
    files: ["**/*.+(ts|tsx)"],
  })),
  {
    files: ["**/*.+(ts|tsx)"],
    plugins: {
      "@typescript-eslint": typescriptEslintEslintPlugin,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "prettier/prettier": "error",
      camelcase: "off",
      "import/prefer-default-export": "off",
      "react/jsx-filename-extension": "off",
      "react/jsx-props-no-spreading": "off",
      "react/no-unused-prop-types": "off",
      "react/require-default-props": "off",
      "react/no-unescaped-entities": "off",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          "": "never",
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
        },
      ],
      "@typescript-eslint/no-unused-vars": "error", // Para detectar variables no usadas en TS
      "import/no-unused-modules": "error", // Para detectar importaciones no usadas
    },
  },
];
