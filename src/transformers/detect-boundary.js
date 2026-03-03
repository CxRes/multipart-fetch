/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import { SBMH } from "streamsearch-web";

const textEncoder = new TextEncoder();
const crlf = new Uint8Array([0x0d, 0x0a]); // '\r\n'

async function* detectBoundary(chunks, boundary) {
  const delimiter = textEncoder.encode(`\r\n--${boundary}`);
  const splitter = new SBMH(delimiter);

  let done, foundTail;
  let chunk = crlf;

  try {
    while (!done) {
      if (!foundTail) {
        const splits = splitter.push(chunk);
        for (const split of splits) {
          if (split.hasNonMatchData) {
            const { isSafe, data, begin, end } = split;
            if (end > begin) {
              foundTail = yield isSafe ?
                data.subarray(begin, end)
              : data.slice(begin, end);
            }
          }

          if (split.isMatch) {
            foundTail = yield;
          }
        }
      }
      ({ value: chunk, done } = await chunks.next());
    }
  } finally {
    await chunks.return?.();
  }
}

export default detectBoundary;
