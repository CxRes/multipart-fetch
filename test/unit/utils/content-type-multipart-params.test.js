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

import extractMultipartParams from "~/utils/content-type-multipart-params.js";
import { parse } from "content-type";

vi.mock("content-type", () => ({
  parse: vi.fn(),
}));

describe('Extract Multipart Parameters From "Content-Type" Header', () => {
  it("should throw an error if contentType is not provided", () => {
    expect(() => extractMultipartParams()).toThrow(
      "No Content-Type header field",
    );
  });

  it("should throw a SyntaxError if contentType cannot be parsed", () => {
    parse.mockImplementation(() => {
      throw new TypeError("invalid media type");
    });
    expect(() => extractMultipartParams("invalid-content-type")).toThrow(
      "Invalid Content-Type header field",
    );
  });

  it("should throw a TypeError if content type is not multipart", () => {
    parse.mockReturnValue({
      type: "text/plain",
      parameters: Object.create(null),
    });

    expect(() => extractMultipartParams("text/plain")).toThrow(TypeError);
    expect(() => extractMultipartParams("text/plain")).toThrow(
      "Content-Type is not multipart",
    );
  });

  it("should throw a TypeError if multipart boundary is not defined", () => {
    parse.mockReturnValue({
      type: "multipart/form-data",
      parameters: Object.create(null),
    });

    expect(() => extractMultipartParams("multipart/form-data")).toThrow(
      TypeError,
    );
    expect(() => extractMultipartParams("multipart/form-data")).toThrow(
      "No multipart boundary defined or invalid boundary",
    );
  });

  it("should return the subtype and boundary if provided correctly", () => {
    parse.mockReturnValue({
      type: "multipart/form-data",
      parameters: { boundary: "boundary" },
    });

    const result = extractMultipartParams(
      'multipart/form-data; boundary="boundary"',
    );

    expect(result).toEqual(
      Object.freeze({
        subtype: "form-data",
        boundary: "boundary",
      }),
    );
  });
});
