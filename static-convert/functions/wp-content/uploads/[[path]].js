/**
 * Cloudflare Pages Function: Transparent Media Reverse Proxy
 * Automatically routes all /wp-content/uploads/* requests to origin Plesk server.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Origin server hostname where your WordPress Plesk server is accessible
  const originHostname = env.ORIGIN_HOSTNAME || 'origin.nq-international.com';

  const targetUrl = new URL(request.url);
  targetUrl.hostname = originHostname;
  targetUrl.protocol = 'https:';

  // Forward request preserving Range headers (crucial for MP3 audio streaming & seeking)
  const originRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    redirect: 'follow',
  });

  const response = await fetch(originRequest, {
    cf: {
      cacheEverything: true,
      cacheTtl: 2592000, // 30 days
      cacheKey: request.url,
    },
  });

  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  headers.set('X-Proxied-By', 'Cloudflare-Pages-Function');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}
