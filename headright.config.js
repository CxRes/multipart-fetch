/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import { EOL } from "os";
import dedent from "dedent";

const settings = Object.freeze({
  notice: {
    /* Header Format
       Properties not used need not be specified in these settings */
    template:
      "Copyright (c) $<year>, $<author> and Multipart Fetch contributors." +
      EOL +
      EOL +
      "$<license>" +
      EOL +
      EOL +
      "SPDX-License-Identifier: $<spdx>",

    /* Query pattern for template string
       Since we do not use a templating engine */
    queryPattern: /\$<.*?>/g,

    /* Author of commit files
       (If not specifies will be queried directly from local git configuration) */
    // author: '',

    /* Contact Information of Commit File Author
       (If not specified will be queried directly from local git configuration) */
    // contact: '',

    /* Custom strings
       Properties starting with pkg are retrieved from package.json at cwd */
    custom: {
      /* Add your own custom property */
      // property1: '',
    },

    /* License */
    license: {
      /* License Header
         (Preferred over header file) */
      notice: dedent`
        This Source Code Form is subject to the terms of the Mozilla Public
        License, v. 2.0. If a copy of the MPL was not distributed with this
        file, You can obtain one at http://mozilla.org/MPL/2.0/.
      `,
      /* Location of the License header file
         (relative to cwd) */
      // location: '',
    },

    /* License SPDX identifier
       (If not specified will be obtained from package.json file at cwd) */
    // spdx: '',
  },

  add: {
    /* Regex to detect template */
    detect: /Copyright \(c\) (?:\d{4}|-|, )*/g,

    /* Regex for File Prefixes to preserve */
    filePrefix: {
      js: [
        "#!.*?",
        "#\\s*.*?coding=.*?",
        "\\/\\/\\s*@flow.*?",
        "\\/\\*\\s*@flow\\s*\\*\\/",
      ],
    },

    /* Comment style wrapping the header */
    commentStyles: {
      code: {
        blockStart: "/*!\n",
        blockEnd: "\n */",
        lineStart: " *  ",
      },
      markup: {
        blockStart: "<!--\n",
        blockEnd: "\n-->",
        lineStart: "  ",
      },
      none: {
        blockStart: "",
        blockEnd: "",
        lineStart: "",
      },
    },

    /* Mapping file type to comment style */
    extensionStyleMap: {
      js: "code",
    },
  },

  update: {
    /* Regex to Update */
    match: /Copyright \(c\) (\d{4}|-|, )*(\d{4}), /,
  },

  /* Files to ignore in Globstar format */
  ignore: [
    "{**,.}/[.]*/**",
    "{**,.}/node_modules/**",
    "{**,.}/coverage/**",
    "{**,.}/dist/**",
    "{**,.}/_*/**",
  ],
});

export default settings;
