/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import js from "@eslint/js";
import { includeIgnoreFile } from "@eslint/compat";
import globals from "globals";
import prettier from "eslint-config-prettier";
import vitest from "eslint-plugin-vitest";
import markdown from "eslint-plugin-markdown";
import * as regexpPlugin from "eslint-plugin-regexp";
import noOnlyTests from "eslint-plugin-no-only-tests";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  includeIgnoreFile(gitignorePath),
  {
    ignores: ["docs/**"],
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: [".husky/*.js", "scripts/**/*.js", "*.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  prettier,
  regexpPlugin.configs["flat/recommended"],
  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      vitest,
      noOnlyTests,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "no-sparse-arrays": "off",
      "noOnlyTests/no-only-tests": ["error", { fix: true }],
    },
  },
  ...markdown.configs.recommended,
];
