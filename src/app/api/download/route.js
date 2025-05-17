export const runtime = 'nodejs'; 

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response('Missing url query param', { status: 400 });
  }

  try {
    // Download the file inside Vercel (plain HTTP is fine here)
    const remote = await fetch(url);

    // Copy most headers; tweak as needed
    const headers = new Headers(remote.headers);
    headers.set('cache-control', 'public, max-age=31536000, immutable');

    return new Response(remote.body, {
      status: remote.status,
      statusText: remote.statusText,
      headers,
    });
  } catch (err) {
    console.error('Proxy download failed:', err);
    return new Response('Error fetching file', { status: 502 });
  }
}
