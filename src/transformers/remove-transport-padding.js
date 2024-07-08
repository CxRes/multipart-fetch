/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
async function* removeTransportPadding(chunks) {
  let remaining = 2;
  let { value: chunk, done } = await chunks.next();

  while (!done) {
    switch (remaining) {
      case 2:
        if (chunk.length === 1) {
          if (chunk[0] === 0x0d) {
            remaining = 1;
          } else {
            yield chunk;
            remaining = 0;
          }
        } else {
          if (chunk[0] === 0x0d && chunk[1] === 0x0a) {
            yield chunk.subarray(2);
            remaining = 0;
          } else {
            yield chunk;
          }
        }
        break;
      case 1:
        if (chunk[0] === 0x0a) {
          yield chunk.subarray(1);
          remaining = 0;
        } else {
          yield new Uint8Array([0x0d]);
          yield chunk;
        }
        break;
      case 0:
        yield chunk;
    }
    ({ value: chunk, done } = await chunks.next());
  }
}

export default removeTransportPadding;
