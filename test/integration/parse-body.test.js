/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";

import parseBody from "~/parse-body.js";

describe("Parse Body", () => {
  const file = fs.createReadStream("./test/samples/part-response.txt");

  let stream = ReadableStream.from(file);

  it("should create a Response object from a raw stream", async () => {
    const partResponse = await parseBody(stream);

    expect(partResponse.headers.get("content-type")).toBe("text/plain");
    expect(await partResponse.text()).toBe(
      "The quick brown fox jumps over the lazy dog.\r\n",
    );
  });
});
