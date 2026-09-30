
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
