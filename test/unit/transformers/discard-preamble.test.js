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

import rahu from "~/transformers/discard-preamble.js";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

async function* chunksGenerator(chunks) {
  for (const chunk of chunks) {
    yield typeof chunk === "string" ? textEncoder.encode(chunk) : chunk;
  }
}

describe.concurrent("Discard Preamble", () => {
  it("should handle an empty sequence of chunks", async () => {
    const chunks = chunksGenerator([]);
    const output = [];

    for await (const part of rahu(chunks)) {
      output.push(part);
    }

    expect(output).toEqual([]);
  });

  it("should not emit chunks if there is no delimiter", async () => {
    const chunks = chunksGenerator([
      "part 1",
      "part 2", //
    ]);
    const output = [];
    for await (const part of rahu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect(output).toEqual([]);
  });

  it("should remove a leading delimiter when preamble is empty", async () => {
    const chunks = chunksGenerator([
      ,
      "part 1", //
    ]);
    const output = [];
    for await (const part of rahu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect(output).toEqual([
      "part 1", //
    ]);
  });

  it("should not emit chunks until the first delimiter", async () => {
    const chunks = chunksGenerator([
      "part 1",
      ,
      "part 2", //
    ]);
    const output = [];
    for await (const part of rahu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect(output).toEqual([
      "part 2", //
    ]);
  });

  it("should emit all chunks after first delimiter even when there are multiple delimiters", async () => {
    const chunks = chunksGenerator([
      "part 1",
      ,
      "part 2",
      ,
      "part 3", //
    ]);
    const output = [];
    for await (const part of rahu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect(output).toEqual([
      "part 2",
      ,
      "part 3", //
    ]);
  });
});
