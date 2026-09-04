/**
 * Cloudflare Pages Function: Option C Media Reverse Proxy
 * Automatically forces Host: nq-international.com so Plesk serves files with zero changes.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const originHost = env.ORIGIN_HOSTNAME || 'origin.nq-international.com';

  const targetUrl = new URL(request.url);
  targetUrl.hostname = originHost;
  targetUrl.protocol = 'https:';

  // Option C: Force Host header so Plesk recognizes the virtual host
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

  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  headers.set('X-Proxied-By', 'Cloudflare-Pages-Function (Option C)');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}
