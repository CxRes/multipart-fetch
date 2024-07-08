/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
async function* splitParts(chunks) {
  let { value, done } = await chunks.next();
  if (done) {
    return;
  }
  yield gatherPart({ value, done });
  yield* splitParts(chunks);

  async function* gatherPart({ value, done }) {
    if (done || !value) {
      return;
    }
    yield value;
    yield* gatherPart(await chunks.next());
  }
}

export default splitParts;
