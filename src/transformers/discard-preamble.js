/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
async function* rahu(chunks) {
  try {
    let { value, done } = await chunks.next();
    while (!done) {
      if (!value) {
        yield* chunks;
        return;
      }
      ({ value, done } = await chunks.next());
    }
  } finally {
    await chunks.return?.();
  }
}

export default rahu;
