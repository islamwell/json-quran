/**
 * Cloudflare Worker: Option C Standalone Media Reverse Proxy
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/wp-content/uploads/')) {
      const originHost = env.ORIGIN_HOSTNAME || 'origin.nq-international.com';
      const targetUrl = new URL(request.url);
      targetUrl.hostname = originHost;
      targetUrl.protocol = 'https:';

      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set('Host', 'nq-international.com');

      const originRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: forwardHeaders,
        redirect: 'follow',
      });

      const response = await fetch(originRequest, {
        cf: {
          cacheEverything: true,
          cacheTtl: 2592000,
          cacheKey: request.url,
        },
      });

      const newHeaders = new Headers(response.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      newHeaders.set('X-Proxied-By', 'NQ-Cloudflare-Media-Proxy (Option C)');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
