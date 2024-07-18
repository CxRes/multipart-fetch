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

import ketu from "~/transformers/discard-epilogue.js";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

async function* chunksGenerator(chunks) {
  for (const chunk of chunks) {
    yield typeof chunk === "string" ? textEncoder.encode(chunk) : chunk;
  }
}

describe.concurrent("Discard Epilogue", () => {
  it("should handle an empty sequence of chunks", async () => {
    const chunks = chunksGenerator([]);
    const output = [];

    for await (const part of ketu(chunks)) {
      output.push(part);
    }

    expect(output).toEqual([]);
  });

  it("should emit chunks when there is no tail", async () => {
    const chunks = chunksGenerator([
      "",
      ,
      "This is a part with --", //
    ]);
    const output = [];
    for await (const part of ketu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect(output).toEqual([
      "",
      ,
      "This is a part with --", //
    ]);
  });

  it("should handle just tail", async () => {
    const chunks = chunksGenerator([
      ,
      "--", //
    ]);
    const output = [];
    for await (const part of ketu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect(output).toEqual([]);
  });

  it("should detect tail after and discard all subsequent chunks", async () => {
    const chunks = chunksGenerator([
      ,
      "--\r\nThis is an epilogue", //
    ]);
    const output = [];
    for await (const part of ketu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect(output).toEqual([]);
  });

  it("should detect a split tail", async () => {
    const chunks = chunksGenerator([
      ,
      "-",
      "-\r\nThis is an epilogue", //
    ]);
    const output = [];
    for await (const part of ketu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect(output).toEqual([]);
  });

  it("should fail on a partial tail", async () => {
    const chunks = chunksGenerator([
      ,
      "-",
      "\r\nThis is not an epilogue", //
    ]);
    const output = [];
    for await (const part of ketu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect(output).toEqual([
      ,
      "-",
      "\r\nThis is not an epilogue", //
    ]);
  });

  it("should fail tail detection quickly on a single character chunk", async () => {
    const chunks = chunksGenerator([
      ,
      "\r",
      "\nThis is not an epilogue", //
    ]);
    const output = [];
    for await (const part of ketu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect(output).toEqual([
      ,
      "\r",
      "\nThis is not an epilogue", //
    ]);
  });

  it("should read the input chunks to completion", async () => {
    const chunks = chunksGenerator([
      ,
      "--",
      "\r\nThis is an epilogue",
      "\r\nMore epilogue...",
      "\r\nEven more epilogue...",
      "\r\nNot done yet!",
    ]);
    const output = [];
    for await (const part of ketu(chunks)) {
      output.push(part && textDecoder.decode(part));
    }
    expect((await chunks.next()).done).toBe(true);
  });
});
