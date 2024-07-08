/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import detectBoundary from "./transformers/detect-boundary.js";
import rahu from "./transformers/discard-preamble.js";
import ketu from "./transformers/discard-epilogue.js";
import splitParts from "./transformers/split-parts.js";
import removeTransportPadding from "./transformers/remove-transport-padding.js";

import parseBody from "./parse-body.js";
import extractMultipartParams from "./utils/content-type-multipart-params.js";

function MultipartResponse(response = {}) {
  const streamish = response.body;

  if (streamish === null || streamish === undefined) {
    throw new SyntaxError("No stream or asyncIterable provided");
  }

  if (typeof streamish[Symbol.asyncIterator] !== "function") {
    throw new TypeError("Body not a stream or an asyncIterable");
  }

  const headerish = response.headers;
  const headers = new Headers(headerish);
  const { boundary, subtype } = extractMultipartParams(
    headers?.get("content-type"),
  );

  async function* parts() {
    const splits = splitParts(
      rahu(ketu(detectBoundary(streamish[Symbol.asyncIterator](), boundary))),
    );

    for await (const split of splits) {
      const part = await parseBody(removeTransportPadding(split));
      if (!part.headers.get("content-type")) {
        part.headers.set(
          "content-type",
          subtype !== "digest" ? "text/plain" : "message/rfc822",
        );
      }
      yield part;
    }
  }

  const multipartResponse = new Response(streamish, response);

  return Object.assign(multipartResponse, {
    get subtype() {
      return subtype;
    },

    parts,

    /* v8 ignore next */
    [Symbol.asyncIterator]: parts,
  });
}

export default MultipartResponse;
