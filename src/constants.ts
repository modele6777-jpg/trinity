export const STAGES = { LANDING:'LANDING', INPUT:'INPUT', DAILY:'DAILY', VISION:'VISION', VISION_PORTAL: 'VISION_PORTAL', STAT: 'STAT', LUCY_CHAT:'LUCY_CHAT', RESONANCE:'RESONANCE', LUCKY:'LUCKY', DEEP_PORTAL:'DEEP_PORTAL', SIMPLE_PORTAL:'SIMPLE_PORTAL', FRIEND_CHAT:'FRIEND_CHAT' };

export const CHAR = {
  LUCY:    { name:'Lucy',    role:'[Shadow & Light]', sym:'✦', color:'#f8f9fa', bg:'rgba(255,255,255,0.03)', border:'rgba(255,255,255,0.1)', glow:'rgba(255,255,255,0.05)' },
  TRINITY: { name:'Lucy',    role:'[The Unified Master]', sym:'◎', color:'#c8a96e', bg:'rgba(200,169,110,0.05)', border:'rgba(200,169,110,0.2)', glow:'rgba(200,169,110,0.1)' },
};

export const HS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
export const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
export const DM = {
  '甲':'갑목(甲木) — 큰 나무, 강인한 리더십',
  '乙':'을목(乙木) — 풀꽃, 유연한 적응력',
  '丙':'병화(丙火) — 태양, 밝고 열정적인 카리스마',
  '丁':'정화(丁火) — 촛불, 집중력과 예술적 감각',
  '戊':'무토(戊土) — 큰 산, 묵직한 신뢰와 포용력',
  '己':'기토(己土) — 정원의 흙, 섬세한 배려와 실용적 지혜',
  '庚':'경금(庚金) — 강한 쇠, 결단력과 원칙주의',
  '辛':'신금(辛金) — 보석, 완벽주의와 예리한 심미안',
  '壬':'임수(壬水) — 큰 강, 지혜와 자유로운 흐름',
  '癸':'계수(癸水) — 빗물, 직관력과 깊은 감수성',
};
export const EL = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水','子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'};

export const SIGNS=['양자리','황소자리','쌍둥이자리','게자리','사자자리','처녀자리','천칭자리','전갈자리','사수자리','염소자리','물병자리','물고기자리'];
export const SEMOJI={'양자리':'♈','황소자리':'♉','쌍둥이자리':'♊','게자리':'♋','사자자리':'♌','처녀자리':'♍','천칭자리':'♎','전갈자리':'♏','사수자리':'♐','염소자리':'♑','물병자리':'♒','물고기자리':'♓'};
export const CITIES={'서울':[37.57,126.98,9],'부산':[35.18,129.08,9],'도쿄':[35.68,139.65,9],'뉴욕':[40.71,-74.01,-5],'런던':[51.51,-0.13,0],'파리':[48.86,2.35,1]};

export const TKRMAP={"The Fool":"바보","The Magician":"마법사","The High Priestess":"여교황","The Empress":"여황제","The Emperor":"황제","The Hierophant":"교황","The Lovers":"연인","The Chariot":"전차","Strength":"힘","The Hermit":"은둔자","Wheel of Fortune":"운명의 수레바퀴","Justice":"정의","The Hanged Man":"매달린 남자","Death":"죽음","Temperance":"절제","The Devil":"악마","The Tower":"탑","The Star":"별","The Moon":"달","The Sun":"태양","Judgement":"심판","The World":"세계"};
export const T78=["The Fool","The Magician","The High Priestess","The Empress","The Emperor","The Hierophant","The Lovers","The Chariot","Strength","The Hermit","Wheel of Fortune","Justice","The Hanged Man","Death","Temperance","The Devil","The Tower","The Star","The Moon","The Sun","Judgement","The World",...["Wands","Cups","Swords","Pentacles"].flatMap(s=>["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Page","Knight","Queen","King"].map(n=>`${n} of ${s}`))];

export const LUCKY_EXAMPLES = [
  "오늘 면접 잘 볼까?",
  "인간관계 스트레스 대처법",
  "지금 이직해도 될까?",
  "시련의 철학적 의미",
  "타인의 시선에서 자유로워지기"
];

export const VISION_EXAMPLES = [
  "오늘 면접 결과는?",
  "우리 둘의 궁합은?",
  "이직하면 운이 좋아질까?",
  "금전운 높이는 법",
  "지금 나에게 필요한 조언"
];
