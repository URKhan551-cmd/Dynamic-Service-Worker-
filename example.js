const cache = await caches.open("dynamic-cache");

const response = await fetch(event.request);

await cache.put(event.request, response.clone());

return response;
