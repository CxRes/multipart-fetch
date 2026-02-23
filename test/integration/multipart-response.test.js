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
import { readFileSync } from "node:fs";
import dedent from "dedent";

import MultipartResponse from "~/multipart-response.js";

describe("Multipart Response", () => {
  describe.concurrent("should fail", () => {
    it("when no stream is provided", () => {
      expect(() => MultipartResponse()).toThrowError(/No .* provided/);
    });

    it("when stream provided is not iterable", () => {
      expect(() => MultipartResponse({ body: "foo" })).toThrowError(/not a .*/);
    });

    it("when no boundary is provided", () => {
      const stream = ReadableStream.from("foo");
      const response = new Response(stream, {
        headers: [["Content-Type", "multipart/digest"]],
      });

      expect(() => MultipartResponse(response)).toThrowError(/No .* boundary/);
    });
  });

  describe("with Simple Multipart Message", () => {
    const file = readFileSync("./test/samples/multipart-response.txt", "utf8");
    const chunks = file.split("\r\n--boundary\r\n");
    let chunkCount = 0;

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const te = new TextEncoder();
    function write(str) {
      writer.write(te.encode(`${str}\r\n--boundary\r\n`));
    }

    const response = new Response(readable, {
      headers: [["Content-Type", 'multipart/digest; boundary="boundary"']],
    });
    const multipartResponse = MultipartResponse(response);

    const parts = multipartResponse.parts();
    let part;

    it('should auto generate "Content-Type" header in the first part based on the "digest" subtype', async () => {
      write(chunks[chunkCount++]); // Preamble
      write(chunks[chunkCount++]); // First Part
      ({ value: part } = await parts.next());
      expect(part.headers.get("content-type").toString()).toBe(
        "message/rfc822",
      );
    });

    it("should output body in the first part", async () => {
      expect(await part.text()).toBe(
        dedent`
          Method: PATCH
          Date: Sat, 08 Jun 2024 00:11:22 GMT\n\n
        `.replace(/\r?\n/g, "\r\n"),
      );
    });

    it("should output headers in the second part", async () => {
      write(chunks[chunkCount++]); // Second Part
      ({ value: part } = await parts.next());
      expect(part.headers.get("content-type")).toBe("message/rfc822");
      expect(part.headers.get("content-language")).toBe("en");
    });

    it("should output body in the second part", async () => {
      expect(await part.text()).toBe(
        dedent`
          Method: DELETE
          Date: Sat, 08 Jun 2024 00:22:33 GMT\n\n
        `.replace(/\r?\n/g, "\r\n"),
      );
    });

    it("should output an empty multipart", async () => {
      write(chunks[chunkCount++]); // Final Boundary + Epilogue
      ({ value: part } = await parts.next());
      expect(part.headers.get("content-type")).toBe("message/rfc822");
    });
  });
});
