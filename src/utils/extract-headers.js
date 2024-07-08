/*!
 *  Copyright (c) 2024, Rahul Gupta and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
const MAX_BYTE_LENGTH = 1024 ** 2;
const textDecoder = new TextDecoder();

function findInternetLineBreak(buffer, cursor) {
  let index = buffer.indexOf(0x0d, cursor);
  while (index >= 0) {
    if (buffer?.[index + 1] === 0x0a) {
      return index;
    } else {
      index = buffer.indexOf(0x0d, index + 1);
    }
  }
  return -1;
}

function parseHeaders(headerBuffers) {
  const headers = [];
  for (const buffer of headerBuffers) {
    const headerText = textDecoder.decode(buffer).replace(/\r(?!\n)/g, " ");
    if (!headerText.startsWith(" ") && !headerText.startsWith("\t")) {
      const header = headerText.trim().match(/(.*?):(.*)/);
      if (header !== null) {
        headers.push([header[1].trim(), header[2].trim()]);
        continue;
      }
    }
    headers[headers.length - 1][1] += " " + headerText.trim();
  }
  return headers;
}

async function extractHeaders(chunks) {
  const headers = [];
  let buffer = new Uint8Array(
    new ArrayBuffer(0, { maxByteLength: MAX_BYTE_LENGTH }),
  );
  let { done, value: chunk } = await chunks.next();
  let cursor = 0;
  while (!done) {
    const bufferLength = buffer.length;
    try {
      buffer.buffer.resize(buffer.length + chunk.length);
      buffer.set(chunk, bufferLength);
    } catch {
      return {
        buffer,
        remainder: chunk,
      };
    }
    while (true) {
      const index = findInternetLineBreak(
        buffer,
        bufferLength > cursor ? bufferLength : cursor,
      );
      if (index === cursor) {
        return {
          headers: parseHeaders(headers),
          remainder: buffer.slice(index + 2),
        };
      } else if (index >= cursor) {
        headers.push(buffer.slice(cursor, index));
        cursor = index + 2;
      } else {
        // cursor = buffer.length - 1;
        break;
      }
    }
    ({ done, value: chunk } = await chunks.next());
  }
  // Failed to exit cleanly, everything is body.
  return { buffer };
}

export default extractHeaders;
