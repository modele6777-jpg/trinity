import { useMemo, useState } from "react";
import { tarotDeck, type TarotCard } from "./cards";

type ReadingSource = "openai" | "demo";

type DailyDraw = {
  date: string;
  cardId?: string;
  focus: string;
  reading?: string;
  source?: ReadingSource;
};

const STORAGE_KEY = "luciel.daily-card";

function todayKey() {
  return new Date().toLocaleDateString("sv-SE");
}

function readSavedDraw(): DailyDraw | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const saved = JSON.parse(value) as DailyDraw;
    const cardExists = tarotDeck.some((card) => card.id === saved.cardId);
    return saved.date === todayKey() && cardExists ? saved : null;
  } catch {
    return null;
  }
}

function dateLabel() {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
}

function TarotCardFace({ card }: { card: TarotCard }) {
  return (
    <div className="tarot-card revealed" aria-label={`${card.koreanName} 카드`}>
      <div className="card-frame">
        <span className="card-number">{card.number}</span>
        <div className="card-constellation">
          <span className="halo" />
          <span className="symbol">{card.symbol}</span>
          <span className="spark spark-one" />
          <span className="spark spark-two" />
          <span className="spark spark-three" />
        </div>
        <p className="card-name">{card.name}</p>
        <p className="card-korean">{card.koreanName}</p>
      </div>
    </div>
  );
}

function TarotCardBack() {
  return (
    <div className="tarot-card waiting" aria-hidden="true">
      <div className="card-frame back">
        <span className="back-star">✦</span>
        <span className="back-ring" />
        <p>LUCIEL</p>
      </div>
    </div>
  );
}

export default function App() {
  const initialDraw = useMemo(() => readSavedDraw(), []);
  const [focus, setFocus] = useState(initialDraw?.focus ?? "");
  const [dailyDraw, setDailyDraw] = useState<DailyDraw | null>(initialDraw);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const card = dailyDraw
    ? tarotDeck.find((entry) => entry.id === dailyDraw.cardId) ?? null
    : null;

  async function requestReading(draw: DailyDraw) {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: draw.cardId,
          focus: draw.focus,
          reuseCard: Boolean(draw.cardId),
        }),
      });
      const result = (await response.json()) as {
        cardId?: string;
        reading?: string;
        source?: ReadingSource;
        message?: string;
      };

      if (!response.ok || !result.cardId || !result.reading || !result.source) {
        throw new Error(result.message || "리딩을 불러오지 못했어요.");
      }

      const completeDraw = {
        ...draw,
        cardId: result.cardId,
        reading: result.reading,
        source: result.source,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completeDraw));
      setDailyDraw(completeDraw);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDraw() {
    if (dailyDraw) return;
    const draw = {
      date: todayKey(),
      focus: focus.trim().slice(0, 160),
    };
    await requestReading(draw);
  }

  return (
    <main className="page">
      <div className="aurora aurora-green" />
      <div className="aurora aurora-purple" />
      <div className="stars" />

      <header className="nav">
        <a className="brand" href="/" aria-label="LucieL 홈">
          LucieL
        </a>
        <span className="nav-label">DAILY TAROT</span>
      </header>

      <section className="hero">
        <div className="intro">
          <p className="eyebrow">{dateLabel()}</p>
          <h1>
            오로라가 건네는
            <br />
            <span>오늘의 카드</span>
          </h1>
          <p className="description">
            잠시 숨을 고르고, 오늘 마음에 머무는 질문을 떠올려 보세요.
            한 장의 카드가 당신의 하루를 위한 작은 빛을 전합니다.
          </p>

          {!dailyDraw ? (
            <div className="question-box">
              <label htmlFor="focus">오늘 묻고 싶은 것</label>
              <textarea
                id="focus"
                value={focus}
                onChange={(event) => setFocus(event.target.value)}
                maxLength={160}
                placeholder="예: 오늘 내가 가장 마음 써야 할 것은 무엇일까?"
                rows={3}
              />
              <button className="draw-button" type="button" onClick={handleDraw} disabled={isLoading}>
                {isLoading ? "카드를 펼치는 중입니다" : "오늘의 카드 뽑기"}
              </button>
              <p className="once">78장의 타로 덱에서 오늘의 카드 한 장이 펼쳐집니다.</p>
              {error && <p className="error">{error}</p>}
            </div>
          ) : (
            <div className="saved-note">
              <p>오늘 당신에게 도착한 카드</p>
              <strong>{card?.koreanName}</strong>
              <span>내일 새로운 오로라가 열립니다.</span>
            </div>
          )}
        </div>

        <div className="reading-stage">
          <div className="card-area">{card ? <TarotCardFace card={card} /> : <TarotCardBack />}</div>

          {card && dailyDraw && (
            <article className="reading" aria-live="polite">
              <div className="reading-title">
                <div>
                  <p>{card.keyword}</p>
                  <h2>{card.koreanName}</h2>
                </div>
                {dailyDraw?.source && (
                  <span className="source">
                    {dailyDraw.source === "openai" ? "AI READING" : "PREVIEW"}
                  </span>
                )}
              </div>
              {dailyDraw.focus && <p className="asked">"{dailyDraw.focus}"</p>}
              {isLoading ? (
                <div className="loading">
                  <span />
                  오로라의 메시지를 읽고 있어요
                </div>
              ) : dailyDraw.reading ? (
                <p className="reading-text">{dailyDraw.reading}</p>
              ) : (
                <button className="retry" type="button" onClick={() => requestReading(dailyDraw)}>
                  리딩 다시 불러오기
                </button>
              )}
              {error && <p className="error">{error}</p>}
            </article>
          )}
        </div>
      </section>

      <footer className="footer">
        <span>LucieL Tarot</span>
        <p>카드 리딩은 자기 성찰을 위한 안내이며 중요한 결정을 대신하지 않습니다.</p>
      </footer>
    </main>
  );
}
