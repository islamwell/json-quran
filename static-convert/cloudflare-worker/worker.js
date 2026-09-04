/**
 * Cloudflare Worker: Scenario B Reverse Proxy for WordPress Media
 * 
 * Proxies /wp-content/uploads/* requests back to your origin Plesk server
 * while serving HTML, CSS, JS, and UI fonts from Cloudflare Pages.
 * 
 * Supports:
 * - Full audio range requests (seeking in MP3 players)
 * - 30-day edge caching on Cloudflare CDN
 * - High-speed global delivery without 25MB file limits
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only intercept /wp-content/uploads/ media requests
    if (url.pathname.startsWith('/wp-content/uploads/')) {
      // Destination origin hostname (configured via env var or defaults to origin.nq-international.com)
      const originHostname = env.ORIGIN_HOSTNAME || 'origin.nq-international.com';

      // Reconstruct target URL pointing to origin server
      const originUrl = new URL(request.url);
      originUrl.hostname = originHostname;
      originUrl.protocol = 'https:';

      // Forward request preserving Range headers (essential for audio/video streaming)
      const originRequest = new Request(originUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow',
      });

      // Fetch from origin with Cloudflare Edge Caching enabled
      const response = await fetch(originRequest, {
        cf: {
          cacheEverything: true,
          cacheTtl: 2592000, // Cache for 30 days on edge
          cacheKey: request.url,
        },
      });

      // Clone response to add CORS headers if needed for audio/font loading
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      newHeaders.set('X-Proxied-By', 'NQ-Cloudflare-Media-Proxy');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    // Pass through to next handler or static assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
