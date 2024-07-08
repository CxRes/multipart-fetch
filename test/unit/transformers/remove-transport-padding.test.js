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

import removeTransportPadding from "~/transformers/remove-transport-padding.js";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

async function* generateChunks(chunks) {
  for (const chunk of chunks) {
    yield textEncoder.encode(chunk);
  }
}

describe.concurrent("Barely Sufficient Transport Padding Remover", () => {
  async function collectResults(values) {
    const results = [];
    for await (const value of values) {
      results.push(textDecoder.decode(value));
    }
    return results;
  }

  it("input with empty chunks should result in no output", async () => {
    const chunks = generateChunks([]);
    const results = await collectResults(removeTransportPadding(chunks));

    expect(results).toEqual([]);
  });

  it('should correctly remove transport padding with "\\r\\n" sequence at the beginning of the first chunk', async () => {
    const chunks = generateChunks([
      "\r\nHello",
      "World", //
    ]);
    const results = await collectResults(removeTransportPadding(chunks));

    expect(results).toEqual(["Hello", "World"]);
  });

  it('single yield a chunk with no leading "\\r\\n" sequence', async () => {
    const chunks = generateChunks([
      "Hi", //
    ]);
    const results = await collectResults(removeTransportPadding(chunks));

    expect(results).toEqual([
      "Hi", //
    ]);
  });

  it('should yield the all chunks when leading "\\r\\n" sequence is not present', async () => {
    const chunks = generateChunks([
      "123",
      "456", //
    ]);
    const results = await collectResults(removeTransportPadding(chunks));

    expect(results).toEqual([
      "123",
      "456", //
    ]);
  });

  it('should emit all chunks when isolated "\\r" is not followed by chunk starting with "\\n"', async () => {
    const chunks = generateChunks([
      "\r",
      "Bye", //
    ]);
    const results = await collectResults(removeTransportPadding(chunks));

    expect(results).toEqual([
      "\r",
      "Bye", //
    ]);
  });

  it('should emit all chunks when first isolated chunk is not "\\r"', async () => {
    const chunks = generateChunks([
      "$",
      "\r\n", //
    ]);
    const results = await collectResults(removeTransportPadding(chunks));

    expect(results).toEqual([
      "$",
      "\r\n", //
    ]);
  });

  it('should handle isolated "\\r" followed by chunk starting with "\\n"', async () => {
    const chunks = generateChunks([
      "\r",
      "\nBye", //
    ]);
    const results = await collectResults(removeTransportPadding(chunks));

    expect(results).toEqual([
      "Bye", //
    ]);
  });
});
