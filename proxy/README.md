# NVIDIA 키 쓰기 위한 중계 서버 만들기 (무료, 약 5분)

NVIDIA API는 보안 정책(CORS) 때문에 웹페이지에서 바로 호출할 수 없어요.
그래서 요청을 대신 전달해 주는 작은 중계 서버가 필요해요. Cloudflare Workers 무료 플랜으로 만들 수 있어요.

1. https://dash.cloudflare.com 에 가입 / 로그인
2. 왼쪽 메뉴 **Workers & Pages** → **Create** → **Create Worker** (Hello World) → 이름 아무거나 → **Deploy**
3. **Edit code** 를 눌러 기존 코드를 전부 지우고, 이 폴더의 [`nvidia-worker.js`](nvidia-worker.js) 내용을 그대로 붙여넣기 → **Deploy**
4. 생성된 주소(예: `https://my-proxy.내아이디.workers.dev`)를 복사
5. 게임 → ⚔️ 전투 탭 → **🤖 AI 설정**
   - API 키: `nvapi-...` 붙여넣기 (자동으로 NVIDIA로 인식)
   - **중계 서버 주소**: 4번 주소 붙여넣기
6. 아무 AI 버튼이나 눌러서 확인

- 키는 Worker에 저장되지 않아요. 게임이 보낸 키를 NVIDIA로 그대로 넘기기만 해요.
- `nvidia-worker.js` 의 `ALLOWED_ORIGINS` 에 적힌 주소(내 게임 주소)에서만 중계 서버를 쓸 수 있어요.
  게임을 다른 주소에서 연다면 그 주소를 목록에 추가하세요.
