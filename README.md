# Multipart Fetch

Split your [Fetch](https://fetch.spec.whatwg.org/) [Response](https://fetch.spec.whatwg.org/#responses) into a [Multipart](https://www.rfc-editor.org/rfc/rfc2046.html#section-5.1) Response.

## Motivation

Multipart parsing libraries typically chunk each part body when delivering it to a consumer. Not only does this force consumers to unnecessarily wait while the part is being delivered to completion, this approach is essentially useless when a message nests multipart bodies. Only when an outer part is completely delivered will the consumer get access to the parts of the nested multipart message.

Multipart Fetch solves these problems by streaming the parts of the multipart response as soon as it receives data from the HTTP stream. It splits up a Fetch Response into part Responses each of which can be serially consumed just like a Response.

## Installation

### Browser

You can use Multipart Fetch directly in the browser as shown below:

```html
<script type="module">
  import multipartFetch from "https://path/to/multipart-fetch/dist/browser.js";
</script>
```

#### CDN

Replace the dummy import path with a link to the bundle provided by your favourite CDN. Find the links/link formats at:

- [jsdelivr](https://www.jsdelivr.com/package/npm/multipart-fetch)
- [unpkg](https://www.unpkg.com/)

#### Local

Alternatively you can download the package from npm and use it locally. If you have npm installed, an easy way to do this is:

```sh
npm pack multipart-fetch
```

Unpack the downloaded `.tgz` file and point the import path to `dist/browser.min.js`.

### JavaScript Runtimes

Install Multipart Fetch using your favorite package manager:

```sh
<npm|pnpm|yarn|bun> add multipart-fetch
```

You can now `import` Multipart Fetch in your project, as usual:

```js
import multipartFetch from "multipart-fetch";
```

On Deno, you can link to the bundle directly from source, just like in the browser, or export it from `deps.ts`.

## Usage

1. `fetch()` a resource with `multipart` media-type:

   ```js
   // Request a resource for multipart media
   let response;
   try {
     response = await fetch("https://example.org/multipart", {
       headers: ["Accept", "multipart/*"],
     });
   } catch (e) {
     // Handle any network errors
   }
   ```

2. Use `multipartFetch()` to part the `response`:

   ```js
   let multipartResponse;
   try {
     multipartResponse = multipartFetch(response);
   } catch (e) {
     // Response was not multipart
     // use the `response` object as usual
   }
   ```

3. Now you can iterate over the parts of the `multipartResponse`:

   ```js
   for await (const partResponse of multipartResponse) {
     // Consume just like a fetch response, say,
     console.log(partResponse.json());
   }
   ```

   or, if you are using the `asyncIterator` protocol:

   ```js
   const partResponse = await multipartResponse.parts();
   let { value, done } = await partResponse.next();
   while (!done) {
     console.log(await value.body());
     ({ value, done } = await partResponse.next());
   }
   ```

**IMPORTANT**: Make sure you read out each part before moving to the next part. This is because the iterator is pulling data from a singular HTTP stream.

## Copyright and License

Copyright © 2024, [Rahul Gupta](https://cxres.pages.dev/profile#i) and Multipart Fetch contributors.

The source code in this repository is released under the [Mozilla Public License v2.0](./LICENSE).
