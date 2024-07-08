/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
const configuration = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [2, "always", Number.POSITIVE_INFINITY],
    "footer-leading-blank": [2, "always"],
    "footer-max-line-length": [1, "always", 100],
    "header-max-length": [1, "always", 100],
    "signed-off-by": [2, "always", "Signed-off-by:"],
    "subject-case": [
      2,
      "never",
      [
        "camel-case",
        "kebab-case",
        "lower-case",
        "pascal-case",
        "snake-case",
        "upper-case",
      ],
    ],
    "trailer-exists": [2, "always", "Signed-off-by:"],
  },
};

export default configuration;
