/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.js"],
  format: "esm",
  bundle: true,
  minify: false,
  sourcemap: true,
  outfile: "dist/browser.min.js",
  legalComments: "none",
});
