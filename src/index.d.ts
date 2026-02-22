/*!
 *  Copyright (c) 2026, Timothy Wong and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */

export function parseBody(streamish: AsyncIterable<Uint8Array>): Promise<Response>;

export default function multipartFetch(
  response: Response | { body: AsyncIterable<Uint8Array>; headers?: HeadersInit }
): Response & AsyncIterable<Response> & {
  readonly subtype: string;
  parts(): AsyncGenerator<Response>;
};
