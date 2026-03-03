/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import { describe, it, expect, vi } from "vitest";

import extractHeaders from "~/utils/extract-headers.js";

describe("Extract Headers", () => {
  const textEncoder = new TextEncoder();

  function useInternetLineBreaks(str) {
    return str.replace(/\r?\n/g, "\r\n");
  }

  async function* generateChunks(data) {
    for (const datum of data) {
      yield textEncoder.encode(useInternetLineBreaks(datum));
    }
  }

  it("should properly extract headers and return the remainder when stream ends after complete headers", async () => {
    const input = [
      "Header1: Test1\r\n",
      "Header2: Test2\r\n",
      "\r\nremainder", //
    ];
    const expected = {
      headers: [
        ["Header1", "Test1"],
        ["Header2", "Test2"],
      ],
      remainder: textEncoder.encode("remainder"),
    };

    expect(await extractHeaders(generateChunks(input))).toEqual(expected);
  });

  it("should properly handle a split header in the stream", async () => {
    const input = [
      "Header1:",
      " Test\r\nHead",
      "er2: Test2\r\n",
      "\r\n", //
    ];
    const expected = {
      headers: [
        ["Header1", "Test"],
        ["Header2", "Test2"],
      ],
      remainder: new Uint8Array([]),
    };

    expect(await extractHeaders(generateChunks(input))).toEqual(expected);
  });

  it("should properly handle a obs headers", async () => {
    const input = [
      "Header1:",
      " Test\r\n  Space\r\nHead",
      "er2: Test2\r\n",
      "\r\n",
    ];

    const expected = {
      headers: [
        ["Header1", "Test Space"],
        ["Header2", "Test2"],
      ],
      remainder: new Uint8Array([]),
    };

    expect(await extractHeaders(generateChunks(input))).toEqual(expected);
  });

  it("should properly handle a obs headers in a new chunk", async () => {
    const input = [
      "Header1:",
      " Test\r\n",
      " Space\r\nHead",
      "er2: Test2\r\n",
      "\r\n",
    ];

    const expected = {
      headers: [
        ["Header1", "Test Space"],
        ["Header2", "Test2"],
      ],
      remainder: new Uint8Array([]),
    };

    expect(await extractHeaders(generateChunks(input))).toEqual(expected);
  });

  it("should properly handle a lines without a colon", async () => {
    const input = [
      "Header1: Test1\r\n",
      "Header2 Test2\r\n",
      "\r\n", //
    ];

    const expected = {
      headers: [
        ["Header1", "Test1 Header2 Test2"], //
      ],
      remainder: new Uint8Array([]),
    };

    expect(await extractHeaders(generateChunks(input))).toEqual(expected);
  });

  it("should return incomplete header data as buffer when no proper line endings", async () => {
    const input = [
      "Header1: End", //
    ];

    const expected = {
      buffer: textEncoder.encode("Header1: End"),
    };

    expect(await extractHeaders(generateChunks(input))).toEqual(expected);
  });

  it("should ignore isolated control feeds and replaced by a space", async () => {
    const input = ["Header1:\rEn\rd\r\n\r\n"];

    const expected = {
      headers: [
        ["Header1", "En d"], //
      ],
      remainder: new Uint8Array([]),
    };

    expect(await extractHeaders(generateChunks(input))).toEqual(expected);
  });

  it("should handle buffer overflow by returning the current buffer and the remainder of the chunk", async () => {
    const maxByteLength = 1024 ** 2;
    const input = new Uint8Array(maxByteLength); // Simulate large data buffer
    const excess = new Uint8Array([0x20, 0x20]);
    const mockStream = {
      next: vi
        .fn()
        .mockResolvedValueOnce({ done: false, value: input })
        .mockResolvedValueOnce({ done: false, value: excess })
        .mockResolvedValueOnce({ done: true }),
    };

    const result = await extractHeaders(mockStream);

    // Verify the result structure
    expect(result.buffer.length).toBe(maxByteLength);
    expect(result.remainder).toEqual(excess);
  });
});
