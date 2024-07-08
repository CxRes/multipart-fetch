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
import dedent from "dedent";

import detectBoundary from "~/transformers/detect-boundary.js";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function useInternetLineBreaks(str) {
  return str.replace(/\r?\n/g, "\r\n");
}

async function* generateChunks(data) {
  for (const datum of data) {
    yield textEncoder.encode(useInternetLineBreaks(datum));
  }
}

describe.concurrent("Detect Boundary", () => {
  it("should handle empty inputs", async () => {
    const chunks = generateChunks([""]);
    const boundary = "boundary";

    const output = [];
    for await (const part of detectBoundary(chunks, boundary)) {
      output.push(part && textDecoder.decode(part));
    }

    expect(output).toEqual([]);
  });

  it("should handle no boundary matches correctly", async () => {
    const chunks = generateChunks(["No boundaries in this data"]);
    const boundary = "boundary";

    const output = [];
    for await (const part of detectBoundary(chunks, boundary)) {
      output.push(part && textDecoder.decode(part));
    }

    expect(output).toEqual(["\r\n", "No boundaries in this data"]);
  });

  it("should not yield an empty preamble", async () => {
    const chunks = generateChunks([
      dedent`
        --boundary\n
      `,
      dedent`
        This is a part
        --boundary--
        This is an epilogue
      `,
    ]);
    const boundary = "boundary";

    const output = [];
    for await (const part of detectBoundary(chunks, boundary)) {
      output.push(part && textDecoder.decode(part));
    }

    expect(output).toEqual([
      ,
      "\r\n",
      "This is a part",
      ,
      "--\r\nThis is an epilogue", //
    ]);
  });

  it("should yield only tail on an empty epilogue", async () => {
    const chunks = generateChunks([
      dedent`
        --boundary\n
      `,
      dedent`
        This is a part
        --boundary--
      `,
    ]);
    const boundary = "boundary";

    const output = [];
    for await (const part of detectBoundary(chunks, boundary)) {
      output.push(part && textDecoder.decode(part));
    }

    expect(output).toEqual([
      ,
      "\r\n",
      "This is a part",
      ,
      "--", //
    ]);
  });

  it("should yield chunks separated by the boundary", async () => {
    const chunks = generateChunks([
      dedent`
        This is a preamble
        --bound
      `,
      dedent`
        ary
        This is a part
        --boundary--
        This is an epilogue
      `,
    ]);
    const boundary = "boundary";

    const output = [];
    for await (const part of detectBoundary(chunks, boundary)) {
      output.push(part && textDecoder.decode(part));
    }

    expect(output).toEqual([
      "\r\n",
      "This is a preamble",
      ,
      "\r\nThis is a part",
      ,
      "--\r\nThis is an epilogue",
    ]);
  });

  it("should properly separate multiple boundaries", async () => {
    const chunks = generateChunks([
      dedent`
        First
        --boundary
        Second
        --boundary
        Third
        --boundary--
      `,
    ]);
    const boundary = "boundary";

    const output = [];
    for await (const part of detectBoundary(chunks, boundary)) {
      output.push(part && textDecoder.decode(part));
    }

    expect(output).toEqual([
      "\r\n",
      "First",
      ,
      "\r\nSecond",
      ,
      "\r\nThird",
      ,
      "--",
    ]);
  });

  it("should not send chunks after tail detection", async () => {
    const chunks = generateChunks([
      dedent`
        --boundary--
        This is an epilogue
      `,
      dedent`
        More epilogue...
      `,
      dedent`
        Even more epilogue...
        Not done yet!
      `,
    ]);
    const boundary = "boundary";

    const parts = detectBoundary(chunks, boundary);
    await parts.next();
    await parts.next();
    await parts.next(true);

    expect((await parts.next()).done).toBe(true);
  });

  it("should read the input chunks to completion", async () => {
    const chunks = generateChunks([
      dedent`
        --boundary--
        This is an epilogue
      `,
      dedent`
        More epilogue...
        Even more epilogue...
        Not done yet!
      `,
    ]);
    const parts = detectBoundary(chunks);
    await parts.next();
    await parts.next();
    await parts.next(true);

    expect((await chunks.next()).done).toBe(true);
  });
});
