export function parseBody(streamish: AsyncIterable<Uint8Array>): Promise<Response>;

export default function multipartFetch(
  response: Response | { body: AsyncIterable<Uint8Array>; headers?: HeadersInit }
): Response & AsyncIterable<Response> & {
  readonly subtype: string;
  parts(): AsyncGenerator<Response>;
};