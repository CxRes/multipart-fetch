/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import "@sec-ant/readable-stream/polyfill";
import extractHeaders from "./utils/extract-headers.js";

async function parseBody(streamish) {
  async function* streamRemainingChunks({ buffer, remainder, chunks }) {
    if (buffer) {
      yield buffer;
    }
    if (remainder) {
      yield remainder;
    }
    yield* chunks;
  }

  const chunks = streamish[Symbol.asyncIterator]();
  const { headers, buffer, remainder } = await extractHeaders(chunks);

  return new Response(
    ReadableStream.from(streamRemainingChunks({ buffer, remainder, chunks })),
    { headers },
  );
}

export default parseBody;
