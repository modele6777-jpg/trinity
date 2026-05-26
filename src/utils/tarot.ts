import { TKRMAP, T78 } from '../constants';

export function tkr(n: string){return TKRMAP[n as keyof typeof TKRMAP]||n.replace("Ace","에이스").replace(" of Wands","(완드)").replace(" of Cups","(컵)").replace(" of Swords","(소드)").replace(" of Pentacles","(펜타클)");}

export function drawCards(n: number = 3, exclude: string[] = []){
  return [...T78].filter(c=>!exclude.includes(c)).sort(()=>Math.random()-.5).slice(0,n).map(name=>({name,kr:tkr(name),rev:Math.random()>.6}));
}

export async function drawCardsSecure(n: number = 3, exclude: string[] = []) {
  const response = await fetch("/api/tarot/draw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count: n, exclude }),
  });

  if (!response.ok) {
    throw new Error("TAROT_DRAW_FAILED");
  }

  const result = await response.json() as { cards: Array<{ name: string; rev: boolean }> };
  return result.cards.map((card) => ({ ...card, kr: tkr(card.name) }));
}
