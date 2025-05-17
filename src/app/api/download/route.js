import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return new Response('Missing url query param', { status: 400 });
  }

  const remote = await fetch(url);

  const headers = new Headers(remote.headers);

  const filename = new URL(url).pathname.split('/').pop() || 'file.bin';

  headers.set('content-disposition', `attachment; filename="${filename}"`);

  headers.set('cache-control', 'public, max-age=31536000, immutable');

  return new Response(remote.body, {
    status: remote.status,
    statusText: remote.statusText,
    headers,
  });
}
