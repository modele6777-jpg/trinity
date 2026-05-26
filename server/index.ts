import "dotenv/config";
import express from "express";
import { randomInt } from "node:crypto";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotDeck } from "../src/cards.js";
import { LUCIEL_SYSTEM_PROMPT } from "./lucielPrompt.js";

const cardGuides = new Map(tarotDeck.map((card) => [card.id, card]));

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(express.json({ limit: "8kb" }));

app.post("/api/reading", async (request, response) => {
  const cardId = typeof request.body?.cardId === "string" ? request.body.cardId : "";
  const focus = typeof request.body?.focus === "string" ? request.body.focus.trim().slice(0, 160) : "";
  const reuseCard = request.body?.reuseCard === true;
  const card = reuseCard && cardGuides.has(cardId)
    ? cardGuides.get(cardId)
    : tarotDeck[randomInt(tarotDeck.length)];

  if (!card) {
    response.status(400).json({ message: "유효한 카드를 찾지 못했어요." });
    return;
  }

  if (!process.env.POE_API_KEY) {
    const preview = [
      "이곳은 당신의 마음을 안전하게 털어놓을 수 있는 공간입니다.",
      "이 카드는 사용자의 상황과 관계없이 시스템적으로 무작위 추출되었습니다.",
      `[${card.koreanName}] ${card.keyword}`,
      card.preview,
      "오늘의 작은 실천으로, 마음이 가장 편안해지는 선택 하나를 적고 가능한 첫걸음을 시작해 보세요.",
      "이 상담은 의학적 진단을 대신할 수 없지만, 당신의 마음을 들여다보는 거울이 되어줄 것입니다.",
      "오늘의 카드는 내면의 빛을 다시 바라볼 수 있다는 메시지를 전합니다.",
      "#타로는 나 자신을 알아가는 과정일 뿐입니다",
    ].join("\n\n");
    response.json({ cardId: card.id, reading: preview, source: "demo" });
    return;
  }

  const question = focus || "오늘 하루를 지혜롭게 보내기 위해 기억할 메시지는 무엇인가요?";
  const input = [
    "현재 모드: 오늘의 카드 한 장 리딩",
    "카드 추출 사실: 아래 카드는 사용자 질문의 내용과 관계없이 서버에서 무작위 추출되었으며 변경할 수 없습니다.",
    `카드: ${card.name} / ${card.koreanName} (${card.keyword})`,
    `사용자의 질문: ${question}`,
    "시스템 프롬프트에 지정된 형식과 필수 문구를 따라 한국어 리딩을 작성하세요.",
  ].join("\n");

  try {
    const apiResponse = await fetch("https://api.poe.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.POE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.POE_MODEL || "GPT-5.4",
        instructions: LUCIEL_SYSTEM_PROMPT,
        input,
        max_output_tokens: 800,
      }),
    });

    if (!apiResponse.ok) {
      const failure = await apiResponse.text();
      console.error("Poe response failed:", apiResponse.status, failure);
      response.status(502).json({ message: "AI 리딩을 받아오지 못했어요. 잠시 후 다시 시도해 주세요." });
      return;
    }

    const result = (await apiResponse.json()) as {
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
    };
    const reading = result.output
      ?.flatMap((item) => item.content ?? [])
      .find((content) => content.type === "output_text")
      ?.text?.trim();

    if (!reading) {
      response.status(502).json({ message: "AI의 메시지가 비어 있어요. 다시 시도해 주세요." });
      return;
    }

    response.json({ cardId: card.id, reading, source: "openai" });
  } catch (error) {
    console.error("Unable to request a Poe tarot reading:", error);
    response.status(502).json({ message: "Poe AI와 연결할 수 없어요. 잠시 후 다시 시도해 주세요." });
  }
});

const distDirectory = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
if (existsSync(distDirectory)) {
  app.use(express.static(distDirectory));
  app.get("*", (_request, response) => {
    response.sendFile(join(distDirectory, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`LucieL API listening at http://localhost:${port}`);
});
