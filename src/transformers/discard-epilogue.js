/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
async function* ketu(chunks) {
  let remainingTail, foundTail;
  try {
    let { value: chunk, done } = await chunks.next();

    while (!done) {
      switch (remainingTail) {
        case 2:
          if (chunk.length === 1) {
            if (chunk[0] === 0x2d) {
              remainingTail = 1;
            } else {
              yield chunk;
              remainingTail = undefined;
            }
          } else {
            if (chunk[0] === 0x2d && chunk[1] === 0x2d) {
              foundTail = true;
              remainingTail = 0;
            } else {
              yield chunk;
              remainingTail = undefined;
            }
          }
          break;
        case 1:
          if (chunk[0] === 0x2d) {
            foundTail = true;
            remainingTail = 0;
          } else {
            yield new Uint8Array([0x2d]);
            yield chunk;
            remainingTail = undefined;
          }
          break;
        case 0:
          break;
        default:
          if (!chunk) {
            remainingTail = 2;
          }
          yield chunk;
      }
      ({ value: chunk, done } = await chunks.next(foundTail));
    }
  } finally {
    await chunks.return?.();
  }
}

export default ketu;
