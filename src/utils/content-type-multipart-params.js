/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import { parse } from "content-type";

function extractMultipartParametersFromContentTypeHeader(contentTypeHeader) {
  if (!contentTypeHeader) {
    throw new Error("No Content-Type header field");
  }

  const contentType = (() => {
    try {
      return parse(contentTypeHeader);
    } catch (contentTypeError) {
      throw new Error("Invalid Content-Type header field", {
        cause: contentTypeError,
      });
    }
  })();

  const [type, subtype] = contentType.type.split("/");

  if (type !== "multipart") {
    throw new TypeError("Content-Type is not multipart");
  }

  const { boundary } = contentType.parameters;
  if (!boundary || typeof boundary !== "string") {
    throw new TypeError("No multipart boundary defined or invalid boundary");
  }

  return Object.freeze({
    subtype,
    boundary,
  });
}

export default extractMultipartParametersFromContentTypeHeader;
