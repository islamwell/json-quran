/**
 * Cloudflare Pages _worker.js (Option C: Zero Plesk Changes)
 * 
 * Intercepts /wp-content/uploads/* and proxies to origin.nq-international.com,
 * forcing Host: nq-international.com so Plesk serves files without requiring any alias!
 * 
 * All other routes are served directly from Cloudflare Pages edge at 0ms latency.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only intercept /wp-content/uploads/ requests (MP3s, PPTs, images, PDFs)
    if (url.pathname.startsWith('/wp-content/uploads/')) {
      const originHost = env.ORIGIN_HOSTNAME || 'origin.nq-international.com';
      const targetUrl = new URL(request.url);
      targetUrl.hostname = originHost;
      targetUrl.protocol = 'https:';

      // Clone headers and force Host: nq-international.com (Option C - Zero Plesk Changes)
      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set('Host', 'nq-international.com');

      const originRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: forwardHeaders,
        redirect: 'follow',
      });

      // Fetch from origin with Cloudflare Edge Caching and Range support
      const response = await fetch(originRequest, {
        cf: {
          cacheEverything: true,
          cacheTtl: 2592000, // 30 days edge cache
          cacheKey: request.url,
        },
      });

      // Pass through response with CORS headers for audio streaming
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      responseHeaders.set('X-Proxied-By', 'NQ-Cloudflare-Media-Proxy (Option C)');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    }

    // Serve static files from Cloudflare Pages with resilient fallback for Urdu/encoded URLs
    let response = await env.ASSETS.fetch(request);
    if (response.status === 404) {
      // 1. Try uppercase percent-encoding (RFC 3986 canonical)
      const upperPath = url.pathname.replace(/%[0-9a-f]{2}/gi, (m) => m.toUpperCase());
      if (upperPath !== url.pathname) {
        const retryUrl = new URL(request.url);
        retryUrl.pathname = upperPath;
        const retryRes = await env.ASSETS.fetch(new Request(retryUrl.toString(), request));
        if (retryRes.status !== 404) return retryRes;
      }

      // 2. Try decoded UTF-8 path (for raw Arabic/Urdu unicode routes)
      try {
        const decodedPath = decodeURIComponent(url.pathname);
        if (decodedPath !== url.pathname) {
          const retryUrl = new URL(request.url);
          retryUrl.pathname = decodedPath;
          const retryRes = await env.ASSETS.fetch(new Request(retryUrl.toString(), request));
          if (retryRes.status !== 404) return retryRes;
        }
      } catch (e) {
        // URI malformed, continue
      }
    }

    return response;
  },
};
