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

import splitParts from "~/transformers/split-parts.js";

async function* chunksGenerator(chunks) {
  for (let chunk of chunks) {
    yield chunk;
  }
}

describe("Split Parts", () => {
  it("should handle an empty sequence of chunks", async () => {
    const chunks = chunksGenerator([]);
    const output = [];
    for await (const parts of splitParts(chunks)) {
      const inner = [];
      for await (const part of parts) {
        inner.push(part);
      }
      output.push(inner);
    }

    expect(output).toEqual([]);
  });

  it("should handle sequence of chunks with no delimiters", async () => {
    const chunks = chunksGenerator([
      "part 1",
      "part 2",
      "part 3", //
    ]);
    const output = [];
    for await (const parts of splitParts(chunks)) {
      const inner = [];
      for await (const part of parts) {
        inner.push(part);
      }
      output.push(inner);
    }

    expect(output).toEqual([
      [
        "part 1",
        "part 2",
        "part 3", //
      ],
    ]);
  });

  it("should split chunks by delimiter till the end if there is no close delimiter", async () => {
    const chunks = chunksGenerator([
      "part 1a",
      "part 1b",
      ,
      "part 2a",
      "part 2b",
      ,
      "part 3",
    ]);
    const output = [];
    for await (const parts of splitParts(chunks)) {
      const inner = [];
      for await (const part of parts) {
        inner.push(part);
      }
      output.push(inner);
    }
    expect(output).toEqual([
      ["part 1a", "part 1b"],
      ["part 2a", "part 2b"],
      ["part 3"],
    ]);
  });

  it("should handle consecutive boundaries correctly", async () => {
    const chunks = chunksGenerator(["part 1", , , "part 3"]);
    const output = [];
    for await (const parts of splitParts(chunks)) {
      const inner = [];
      for await (const part of parts) {
        inner.push(part);
      }
      output.push(inner);
    }
    expect(output).toEqual([["part 1"], [], ["part 3"]]);
  });
});
