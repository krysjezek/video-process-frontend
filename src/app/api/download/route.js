export const runtime = 'nodejs';       

export async function GET(req) {
  // Extract the ?url=… query parameter
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get('url');
  if (!rawUrl) {
    return new Response('Missing url query param', { status: 400 });
  }

  const remote = await fetch(rawUrl);

  const headers = new Headers(remote.headers);

  const filename = new URL(rawUrl).pathname.split('/').pop() || 'file.bin';

  headers.set('content-disposition', `attachment; filename="${filename}"`);

  headers.set('cache-control', 'public, max-age=31536000, immutable');

  return new Response(remote.body, {
    status: remote.status,
    statusText: remote.statusText,
    headers,
  });
}
