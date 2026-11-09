// 볼파이트 샌드박스용 NVIDIA API 중계 서버 (Cloudflare Workers, 무료)
// NVIDIA API(integrate.api.nvidia.com)는 브라우저에서 직접 부르는 걸 막기 때문에(CORS),
// 이 Worker가 요청을 그대로 전달하고 브라우저 허용 헤더만 붙여줍니다.
// API 키는 여기 저장하지 않습니다. 게임에서 보낸 키를 그대로 NVIDIA로 넘깁니다.

const TARGET = 'https://integrate.api.nvidia.com';

// 비워두면 어느 주소에서 연 게임이든 사용 가능.
// 내 게임에서만 쓰게 하려면 예: ['https://kangjjang150407-droid.github.io']
const ALLOWED_ORIGINS = [];

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, content-type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!allowed) return new Response('Forbidden origin: ' + origin, { status: 403, headers: cors });

    const url = new URL(request.url);
    // 주소만 열어봤을 때: 정상 작동 확인용
    if (url.pathname === '/' || url.pathname === '') {
      return new Response('ballfight-proxy-ok (볼파이트 중계 서버가 정상 작동 중이에요)', { headers: { ...cors, 'content-type': 'text/plain; charset=utf-8' } });
    }
    // /v1/v1/... 처럼 중복된 경로 정리
    const path = url.pathname.replace(/^(\/v1)+/, '/v1');
    if (!path.startsWith('/v1/')) return new Response('Not found', { status: 404, headers: cors });

    try {
      const upstream = await fetch(TARGET + path + url.search, {
        method: request.method,
        headers: {
          'authorization': request.headers.get('authorization') || '',
          'content-type': 'application/json',
          'accept': 'application/json',
        },
        body: request.method === 'POST' ? await request.text() : undefined,
      });
      const headers = new Headers(upstream.headers);
      for (const [k, v] of Object.entries(cors)) headers.set(k, v);
      return new Response(upstream.body, { status: upstream.status, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: { message: 'NVIDIA 서버 연결 실패: ' + e.message } }), { status: 502, headers: { ...cors, 'content-type': 'application/json' } });
    }
  },
};
