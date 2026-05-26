export type TarotCard = {
  id: string;
  number: string;
  name: string;
  koreanName: string;
  keyword: string;
  symbol: string;
  preview: string;
  arcana: "major" | "minor";
};

const majorArcana: TarotCard[] = [
  { id: "fool", number: "0", name: "THE FOOL", koreanName: "바보", keyword: "새로운 시작", symbol: "✦", preview: "익숙한 답보다 작은 호기심을 따라가 보세요. 오늘의 첫걸음은 완벽함보다 가벼운 용기에서 시작됩니다.", arcana: "major" },
  { id: "magician", number: "I", name: "THE MAGICIAN", koreanName: "마법사", keyword: "창조와 실행", symbol: "∞", preview: "이미 손에 쥔 능력과 자원이 충분합니다. 미뤄둔 일 하나를 구체적인 행동으로 바꾸면 흐름이 열립니다.", arcana: "major" },
  { id: "priestess", number: "II", name: "THE HIGH PRIESTESS", koreanName: "여사제", keyword: "직관과 고요", symbol: "☽", preview: "답을 재촉하기보다 마음이 조용해지는 쪽을 살펴보세요. 오늘은 말보다 관찰이 더 많은 것을 알려줍니다.", arcana: "major" },
  { id: "empress", number: "III", name: "THE EMPRESS", koreanName: "여황제", keyword: "풍요와 돌봄", symbol: "❀", preview: "스스로를 다정히 보살필수록 좋은 에너지가 번집니다. 쉬어 가는 시간도 충분히 생산적인 선택입니다.", arcana: "major" },
  { id: "emperor", number: "IV", name: "THE EMPEROR", koreanName: "황제", keyword: "질서와 기반", symbol: "△", preview: "흔들리는 마음에는 명확한 경계와 순서가 도움이 됩니다. 오늘 할 일의 우선순위를 하나만 분명히 정해 보세요.", arcana: "major" },
  { id: "hierophant", number: "V", name: "THE HIEROPHANT", koreanName: "교황", keyword: "배움과 믿음", symbol: "☉", preview: "혼자 모든 것을 풀 필요는 없습니다. 신뢰하는 조언이나 오래 지켜온 가치에서 안정적인 길을 찾을 수 있습니다.", arcana: "major" },
  { id: "lovers", number: "VI", name: "THE LOVERS", koreanName: "연인", keyword: "선택과 연결", symbol: "♡", preview: "진짜 원하는 것과 타협하는 것을 구분할 때입니다. 진심 어린 대화가 마음의 선택을 선명하게 합니다.", arcana: "major" },
  { id: "chariot", number: "VII", name: "THE CHARIOT", koreanName: "전차", keyword: "전진과 의지", symbol: "➶", preview: "방향을 정했다면 흔들리는 감정도 함께 데리고 나아갈 수 있습니다. 작지만 확실한 진전을 만들어 보세요.", arcana: "major" },
  { id: "strength", number: "VIII", name: "STRENGTH", koreanName: "힘", keyword: "부드러운 용기", symbol: "∞", preview: "강함은 밀어붙이는 힘보다 자신을 다독이며 버티는 마음에 있습니다. 오늘은 부드럽게 말하는 것이 가장 강한 행동입니다.", arcana: "major" },
  { id: "hermit", number: "IX", name: "THE HERMIT", koreanName: "은둔자", keyword: "성찰과 등불", symbol: "✧", preview: "잠시 소음에서 벗어나야 내 빛이 보입니다. 다른 사람의 속도 대신 당신만의 질문에 집중해 보세요.", arcana: "major" },
  { id: "wheel", number: "X", name: "WHEEL OF FORTUNE", koreanName: "운명의 수레바퀴", keyword: "전환과 흐름", symbol: "◎", preview: "예상하지 못한 변화가 새로운 문을 엽니다. 통제할 수 없는 흐름과 싸우기보다 기회를 발견해 보세요.", arcana: "major" },
  { id: "justice", number: "XI", name: "JUSTICE", koreanName: "정의", keyword: "균형과 진실", symbol: "⚖", preview: "감정과 사실을 모두 정직하게 바라볼 때 균형이 돌아옵니다. 오늘의 선택은 미래의 당신도 납득할 수 있게 하세요.", arcana: "major" },
  { id: "hanged", number: "XII", name: "THE HANGED MAN", koreanName: "매달린 사람", keyword: "새로운 시선", symbol: "▽", preview: "잠시 멈춘 듯한 시간은 낭비가 아닙니다. 관점을 바꾸면 막혀 있던 문제의 의미가 달라질 수 있습니다.", arcana: "major" },
  { id: "death", number: "XIII", name: "DEATH", koreanName: "죽음", keyword: "끝과 변화", symbol: "✺", preview: "끝내야 새로 시작할 수 있는 것이 있습니다. 놓아주는 일은 상실만이 아니라 더 가벼운 내일을 위한 공간입니다.", arcana: "major" },
  { id: "temperance", number: "XIV", name: "TEMPERANCE", koreanName: "절제", keyword: "조화와 회복", symbol: "♢", preview: "극단보다 알맞은 속도가 당신을 회복시킵니다. 마음과 일상 사이에 작은 균형을 만들어 보세요.", arcana: "major" },
  { id: "devil", number: "XV", name: "THE DEVIL", koreanName: "악마", keyword: "집착의 인식", symbol: "♄", preview: "나를 붙드는 생각이나 습관을 솔직히 알아차리는 날입니다. 인식하는 순간부터 선택권은 다시 당신에게 돌아옵니다.", arcana: "major" },
  { id: "tower", number: "XVI", name: "THE TOWER", koreanName: "탑", keyword: "깨달음과 해방", symbol: "⚡", preview: "갑작스러운 진실은 불편하지만 오래된 틀에서 벗어날 기회입니다. 무너진 자리에서 더 진실한 기반을 세울 수 있습니다.", arcana: "major" },
  { id: "star", number: "XVII", name: "THE STAR", koreanName: "별", keyword: "희망과 치유", symbol: "★", preview: "작은 희망을 가볍게 여기지 마세요. 당신이 다시 믿어 보고 싶은 마음이 오늘의 회복을 이끕니다.", arcana: "major" },
  { id: "moon", number: "XVIII", name: "THE MOON", koreanName: "달", keyword: "감정과 꿈", symbol: "☾", preview: "불확실함 속에서는 모든 감정이 크게 보일 수 있습니다. 결론을 서두르지 말고 오늘은 마음의 물결을 지켜봐 주세요.", arcana: "major" },
  { id: "sun", number: "XIX", name: "THE SUN", koreanName: "태양", keyword: "기쁨과 명료함", symbol: "☼", preview: "숨기지 않은 당신의 빛이 주변까지 따뜻하게 합니다. 즐거움과 솔직함을 선택할수록 길이 분명해집니다.", arcana: "major" },
  { id: "judgement", number: "XX", name: "JUDGEMENT", koreanName: "심판", keyword: "깨어남과 응답", symbol: "❈", preview: "오래 마음속에서 울리던 부름에 답할 순간입니다. 지난 경험을 탓하기보다 새 선택의 근거로 삼아 보세요.", arcana: "major" },
  { id: "world", number: "XXI", name: "THE WORLD", koreanName: "세계", keyword: "완성과 확장", symbol: "◯", preview: "여기까지 온 여정을 인정할 때 다음 단계가 열립니다. 마무리를 기쁘게 받아들이고 더 넓은 세계를 바라보세요.", arcana: "major" },
];

type Suit = {
  id: string;
  english: string;
  korean: string;
  topic: string;
  symbol: string;
  theme: string;
};

type MinorMeaning = {
  id: string;
  number: string;
  english: string;
  korean: string;
  keyword: string;
  message: string;
};

const suits: Suit[] = [
  { id: "wands", english: "WANDS", korean: "완드", topic: "완드는", symbol: "♧", theme: "열정과 행동" },
  { id: "cups", english: "CUPS", korean: "컵", topic: "컵은", symbol: "♒", theme: "감정과 관계" },
  { id: "swords", english: "SWORDS", korean: "소드", topic: "소드는", symbol: "♤", theme: "생각과 결단" },
  { id: "pentacles", english: "PENTACLES", korean: "펜타클", topic: "펜타클은", symbol: "☆", theme: "현실과 기반" },
];

const minorMeanings: MinorMeaning[] = [
  { id: "ace", number: "A", english: "ACE", korean: "에이스", keyword: "새 씨앗", message: "새로운 기회가 조용히 손에 들어옵니다. 작더라도 마음이 움직이는 첫 선택을 놓치지 마세요." },
  { id: "two", number: "II", english: "TWO", korean: "2", keyword: "균형과 선택", message: "두 가능성 사이에서 서두르지 않아도 됩니다. 무엇을 지킬지 정하면 다음 걸음이 선명해집니다." },
  { id: "three", number: "III", english: "THREE", korean: "3", keyword: "성장과 협력", message: "혼자 준비해 온 일이 연결을 통해 자랍니다. 도움을 나누고 결과를 함께 그려 보세요." },
  { id: "four", number: "IV", english: "FOUR", korean: "4", keyword: "안정과 멈춤", message: "지금 가진 것을 점검하며 숨을 고를 시간입니다. 안정은 멈춤이 아니라 다음 움직임을 위한 바탕입니다." },
  { id: "five", number: "V", english: "FIVE", korean: "5", keyword: "마찰과 배움", message: "불편한 긴장은 무엇이 중요한지 드러냅니다. 승부보다 오늘 배울 수 있는 진실을 먼저 보세요." },
  { id: "six", number: "VI", english: "SIX", korean: "6", keyword: "회복과 나눔", message: "기울었던 흐름이 조금씩 제자리를 찾습니다. 받는 일과 건네는 일 사이의 균형을 돌아보세요." },
  { id: "seven", number: "VII", english: "SEVEN", korean: "7", keyword: "점검과 인내", message: "금방 답이 나오지 않는다고 길을 의심할 필요는 없습니다. 현재의 노력을 살피고 필요한 조정만 해보세요." },
  { id: "eight", number: "VIII", english: "EIGHT", korean: "8", keyword: "움직임과 숙련", message: "반복해 온 작은 행동이 힘을 얻는 날입니다. 집중력을 흩뜨리지 않으면 분명한 진전이 보입니다." },
  { id: "nine", number: "IX", english: "NINE", korean: "9", keyword: "성취와 경계", message: "여기까지 온 자신을 인정해 주세요. 동시에 에너지를 지킬 경계를 세우는 일도 중요합니다." },
  { id: "ten", number: "X", english: "TEN", korean: "10", keyword: "완성과 전환", message: "한 흐름이 충분히 채워져 다음 장으로 넘어갈 준비를 합니다. 짐이 된 것은 정리해도 괜찮습니다." },
  { id: "page", number: "PAGE", english: "PAGE", korean: "페이지", keyword: "호기심과 소식", message: "낯선 소식이나 배움이 새로운 감각을 깨웁니다. 능숙하지 않아도 열린 마음으로 시도해 보세요." },
  { id: "knight", number: "KNIGHT", english: "KNIGHT", korean: "나이트", keyword: "추진과 여정", message: "움직일 준비가 된 에너지가 도착했습니다. 속도에 끌려가기보다 방향을 기억하며 나아가세요." },
  { id: "queen", number: "QUEEN", english: "QUEEN", korean: "퀸", keyword: "성숙한 돌봄", message: "내면의 지혜를 신뢰할수록 주변에도 안정이 전해집니다. 나를 돌보는 선택에서 힘이 시작됩니다." },
  { id: "king", number: "KING", english: "KING", korean: "킹", keyword: "책임과 주도", message: "상황을 이끌 수 있는 차분한 힘이 있습니다. 분명한 원칙과 너그러운 태도를 함께 가져가세요." },
];

const minorArcana: TarotCard[] = suits.flatMap((suit) =>
  minorMeanings.map((meaning) => ({
    id: `${suit.id}-${meaning.id}`,
    number: meaning.number,
    name: `${meaning.english} OF ${suit.english}`,
    koreanName: `${suit.korean} ${meaning.korean}`,
    keyword: `${suit.theme} · ${meaning.keyword}`,
    symbol: suit.symbol,
    preview: `${suit.topic} ${suit.theme}의 흐름을 비춥니다. ${meaning.message}`,
    arcana: "minor",
  })),
);

export const tarotDeck: TarotCard[] = [...majorArcana, ...minorArcana];
