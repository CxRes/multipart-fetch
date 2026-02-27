/*!
 *  Copyright (c) 2026, Timothy Wong and Multipart Fetch contributors.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *  SPDX-License-Identifier: MPL-2.0
 */
import { describe, it, expect, vi } from "vitest";
import MultipartResponse from "~/multipart-response.js";

describe("Early Termination", () => {
  it("should cancel the underlying stream when the consumer breaks early", async () => {
    const cancelSpy = vi.fn();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("--boundary\r\n"));
        controller.enqueue(encoder.encode("Content-Type: text/plain\r\n\r\n"));
        controller.enqueue(encoder.encode("Part 1\r\n"));
        controller.enqueue(encoder.encode("--boundary\r\n"));
        controller.enqueue(encoder.encode("Content-Type: text/plain\r\n\r\n"));
        controller.enqueue(encoder.encode("Part 2\r\n"));
        // Stream remains open to allow cancellation
      },
      cancel: cancelSpy,
    });

    const response = new Response(stream, {
      headers: [["Content-Type", 'multipart/mixed; boundary="boundary"']],
    });

    const multipartResponse = MultipartResponse(response);

    for await (const part of multipartResponse) {
      await part.text(); // Consume the first part
      break; // Stop iteration
    }

    expect(cancelSpy).toHaveBeenCalled();
  });
});