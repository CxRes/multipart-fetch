/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
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

export default {
  dictionaries: ["typescript", "node", "en-gb"],
  ignorePaths: [".git", ".*ignore", ...gitignorePatterns, "pnpm-lock.yaml"],
  words: [
    "commitlint",
    "packagejson",
    "streamsearch",
    "SBMH",
    "knip",
    "rahu",
    "ketu",
    "streamish",
    "headerish",
    "headright",
    "roff",
    "signoff",
    "dedupe",
  ],
  ignoreRegExpList: [/(Dependencies|dependencies|scripts)": \{.*?\}/gs],
};
