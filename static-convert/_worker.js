/**
 * Cloudflare Pages _worker.js (Scenario B Media Proxy)
 * 
 * Intercepts /wp-content/uploads/* and streams media from the origin Plesk server.
 * All other routes are served directly from Cloudflare Pages static edge.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // If request is for media / uploads, proxy to origin server
    if (url.pathname.startsWith('/wp-content/uploads/')) {
      const originHostname = env.ORIGIN_HOSTNAME || 'origin.nq-international.com';

      const originUrl = new URL(request.url);
      originUrl.hostname = originHostname;
      originUrl.protocol = 'https:';

      const originRequest = new Request(originUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow',
      });

      const response = await fetch(originRequest, {
        cf: {
          cacheEverything: true,
          cacheTtl: 2592000, // 30 days edge cache
          cacheKey: request.url,
        },
      });

      const headers = new Headers(response.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('X-Proxied-By', 'NQ-Pages-Worker');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers,
      });
    }

    // Default: serve static assets from Cloudflare Pages
    return env.ASSETS.fetch(request);
  },
};
