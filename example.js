
cache.addAll([
  "/api/weather?city=dubai",
  "/api/weather?city=karachi",
  "/api/weather?city=london",
  "/api/weather?city=tokyo"
]);

Because we don't know what the user will request.

Instead:

User requests Dubai weather
             ↓
Service Worker sees request
             ↓
Network request
             ↓
Response arrives
             ↓
Service Worker stores response
             ↓
Return response to browser


const cache = await caches.open("dynamic-cache");

const response = await fetch(event.request);

await cache.put(event.request, response.clone());

return response;

//
Why do we need response.clone()?

This is one of the most important things to understand deeply.

A response contains a body stream.

Conceptually:

Response
├── status
├── headers
└── body → stream

When you do:
return response;

you can run into a problem because you're attempting 
  to consume the same response body for two purposes.
We want:
Network Response
       │
       ▼
   clone()
    /   \
   /     \
  ▼       ▼
Cache    Browser

         
const networkResponse = await fetch(event.request);

const cacheResponse = networkResponse.clone();

await cache.put(
  event.request,
  cacheResponse
);

return networkResponse;



  // let's implement the actual service workers 
const DYNAMIC_CACHE = "dynamic-v1";

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);

  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    console.log("CACHE HIT:", request.url);
    return cachedResponse;
  }

console.log("CACHE MISS:", request.url);

  const networkResponse = await fetch(request);

  await cache.put(request, networkResponse.clone());

  return networkResponse;
}

Then test one new resource that wasn't in your install-time cache.
