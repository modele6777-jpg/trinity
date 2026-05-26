import { config } from "dotenv";
import express from "express";
import { randomInt } from "node:crypto";
import path from "path";
import { createServer as createViteServer } from "vite";
import { T78 } from "./src/constants";
import { LUCIEL_SYSTEM_PROMPT } from "./server/lucielPrompt";

config({ path: ".env.local" });
config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/tarot/draw", (req, res) => {
    const requestedCount = Number(req.body?.count || 1);
    const count = Math.max(1, Math.min(3, requestedCount));
    const excluded = new Set(Array.isArray(req.body?.exclude) ? req.body.exclude : []);
    const available = T78.filter((card) => !excluded.has(card));
    const cards: Array<{ name: string; rev: boolean }> = [];

    while (cards.length < count && available.length > 0) {
      const index = randomInt(available.length);
      const [name] = available.splice(index, 1);
      cards.push({ name, rev: randomInt(10) >= 6 });
    }

    return res.status(200).json({ cards });
  });

  app.post("/api/ai", async (req, res) => {
    const apiKey = process.env.POE_API_KEY;
    const { prompt, system, luciel } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "POE_API_KEY is missing/invalid." });
    }

    try {
      const instructions = luciel
        ? `${LUCIEL_SYSTEM_PROMPT}\n\n## Current Screen Context\n${system || ""}`
        : system;
      const apiResponse = await fetch("https://api.poe.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.POE_MODEL || "GPT-5.4",
          instructions,
          input: prompt,
          max_output_tokens: 1200,
        }),
      });

      if (!apiResponse.ok) {
        const failure = await apiResponse.text();
        console.error("Poe API Error:", apiResponse.status, failure);
        return res.status(502).json({ error: "Poe AI request failed." });
      }

      const result = await apiResponse.json() as {
        output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
      };
      const text = result.output
        ?.flatMap((item) => item.content || [])
        .find((content) => content.type === "output_text")
        ?.text?.trim();

      if (!text) {
        return res.status(502).json({ error: "Poe AI returned an empty response." });
      }

      return res.status(200).json({ text });
    } catch (error: any) {
      console.error("AI API Error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
