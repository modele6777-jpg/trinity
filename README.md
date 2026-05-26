# LucieL

오로라 분위기의 오늘의 타로 카드 웹사이트 MVP입니다. 사용자는 메이저 아르카나 22장과 마이너 아르카나 56장으로 이루어진 78장 덱에서 하루 한 장을 펼치고, 질문에 맞춘 짧은 리딩을 받습니다.

## 시작하기

```bash
npm install
copy .env.example .env
npm run dev
```

브라우저에서 `http://localhost:5173`을 엽니다. `POE_API_KEY`를 설정하지 않아도 미리보기 리딩으로 UI를 확인할 수 있습니다.

## Poe AI 리딩 연결

`.env` 파일에 [Poe API 키](https://poe.com/api/keys)를 서버 전용 값으로 설정합니다. `VITE_` 접두사가 붙은 변수에는 API 키를 넣지 마세요. 대화나 공개 저장소에 노출된 키는 폐기하고 새 키를 사용하세요.

```env
POE_API_KEY=your_poe_api_key_here
POE_MODEL=GPT-5.4
PORT=8787
```

서버의 `/api/reading` 엔드포인트가 질문 내용과 독립적으로 78장 중 카드를 무작위 추출한 뒤 Poe의 OpenAI-compatible Responses API를 호출합니다. 기본 bot/model은 Poe 문서에 예시로 안내된 `GPT-5.4`이며, 다른 공개 Poe bot을 사용하려면 `POE_MODEL`을 해당 bot 이름으로 바꾸면 됩니다.

루시엘의 상담 페르소나와 리딩 지침은 `server/lucielPrompt.ts`에 설정되어 있습니다. 현재 화면은 오늘의 카드 한 장 모드이므로, 프롬프트의 타로 철학과 응답 규칙은 한 장 리딩 형식으로 적용됩니다.

## 명령어

```bash
npm run dev
npm run build
npm start
```

`npm run build` 이후 `npm start`는 정적 사이트와 API 서버를 함께 제공합니다.
