/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import { configDefaults, defineConfig } from "vitest/config";
import parseGitignore from "parse-gitignore";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const gitignorePath = resolve(__dirname, ".gitignore");
const gitignorePatterns = parseGitignore(
  readFileSync(gitignorePath, "utf-8"),
).patterns.map((pattern) => `**/${pattern}`);

function resolvePath(path) {
  return resolve(__dirname, path);
}

export default defineConfig({
  resolve: {
    alias: {
      "~": resolvePath("src"),
    },
  },
  test: {
    exclude: [...configDefaults.exclude, ...gitignorePatterns],
    coverage: {
      include: ["src/"],
      exclude: [
        ...configDefaults.coverage.exclude,
        ...gitignorePatterns,
        "src/index.js",
      ],
    },
  },
});
