import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
    
    // 1. Establish session by visiting root and following redirects
    console.log('[Proxy] Establishing session...');
    const initRes = await fetch('https://cdn.qrofertas.com/', {
      headers: { 'User-Agent': userAgent },
      redirect: 'follow'
    });
    
    // Get all cookies from the response chain
    const cookies = initRes.headers.getSetCookie();
    const cookieString = cookies.map(c => c.split(';')[0]).join('; ');
    console.log(`[Proxy] Session established with cookies: ${cookieString.length} chars`);

    // 2. Fetch API with established session
    console.log(`[Proxy] Fetching images for query: ${query}`);
    const apiRes = await fetch(`https://cdn.qrofertas.com/services/api-produtos/?query=${query}`, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'https://cdn.qrofertas.com/criar-jornal/builder-v2/',
        'Cookie': cookieString,
      },
      cache: 'no-store'
    });
    
    const data = await apiRes.text();
    console.log(`[Proxy] Received ${data.length} bytes from external API`);
    
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      },
    });
  } catch (error) {
    console.error('[Proxy] Error in multi-step fetch:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
