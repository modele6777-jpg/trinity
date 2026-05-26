import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Sparkles, Moon, Sun, Key, Loader2, LogOut, User as UserIcon, Lock, Download, History, Camera, Scan, X, Volume2, VolumeX, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { callGemini } from "../services/geminiService";

export const VISION_DECKS = [
  { 
    id: 'GENERAL', 
    name: '타로 분석', 
    desc: '모든 타로 카드를 인식하여 분석합니다.',
    detail: '이미지에 있는 모든 타로 카드의 상징과 의미를 분석합니다. 당신의 고민에 맞춰 카드들 사이의 관계와 흐름을 깊이 있게 통찰합니다.',
    best: '모든 고민, 심층적인 상황 분석',
    examples: [
      '오늘 나의 전반적인 운세는?', 
      '지금 나에게 가장 필요한 조언은?', 
      '내가 모르는 나의 잠재력은?',
      '오늘 하루를 관통하는 핵심 에너지는?',
      '주변 사람들과의 관계 흐름이 어때?'
    ]
  },
  { 
    id: 'CAT', 
    name: '캣 타로', 
    desc: '고양이의 직관을 담은 타로입니다.',
    detail: '고양이 특유의 영리함과 독립적인 에너지를 투영합니다. 인간관계의 미묘한 심리 변화나 본능적인 선택이 필요한 순간에 강력한 직관을 제공합니다.',
    best: '인간관계, 심리 분석, 본능적 선택',
    examples: [
      '그 사람의 속마음이 궁금해요', 
      '나의 매력 포인트는 무엇일까?', 
      '지금 내 본능이 말하는 선택은?',
      '우리의 관계가 더 깊어질 수 있을까?',
      '상대방이 나에게 숨기고 있는 마음은?'
    ]
  },
  { 
    id: 'ANTIQUE', 
    name: '앤티크 타로', 
    desc: '고전적 상징을 강조한 타로입니다.',
    detail: '역사적인 깊이와 전통적인 상징을 중시합니다. 인생의 중대한 갈림길, 도덕적 가치 판단, 혹은 장기적인 전망이 필요한 문제에 깊이 있는 통찰을 제공합니다.',
    best: '중대한 결정, 가치관 문제, 장기적 전망',
    examples: [
      '이직을 하는 게 좋을까요?', 
      '내 인생의 다음 챕터는 무엇일까?', 
      '장기적으로 보았을 때 올바른 선택은?',
      '지금 겪고 있는 시련의 의미는 무엇일까?',
      '나의 과거가 현재에 미치는 영향은?'
    ]
  },
  { 
    id: 'VISCONTI', 
    name: '비스콘티 스포르자', 
    desc: '골든 타로의 정수입니다.',
    detail: '15세기 이탈리아 귀족 가문의 화려함을 담고 있습니다. 명예, 성공, 금전적 풍요 등 세속적인 성취와 사회적 지위에 관련된 질문에 가장 강력한 해답을 제시합니다.',
    best: '성공, 명예, 금전, 사업적 성취',
    examples: [
      '사업이 번창할 수 있을까요?', 
      '금전운을 높이는 방법은?', 
      '나의 사회적 성공 가능성은?',
      '예상치 못한 재물운이 들어올까?',
      '나의 전문성을 인정받을 수 있는 시기는?'
    ]
  }
];

export function VisionPortal({ onBack, onResult, deckId, onDeckChange, concern, lucyMemory, sajuData, astroData, examples, userPreferences, hasQuotaError }: { onBack: () => void, onResult: (res: any) => void, deckId: string, onDeckChange: (id: string) => void, concern: string, lucyMemory?: string, sajuData?: string, astroData?: string, examples?: string[], userPreferences?: string, hasQuotaError?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [localConcern, setLocalConcern] = useState(concern);
  const [step, setStep] = useState<'CONCERN' | 'SPREAD' | 'DECK_SELECT' | 'SCAN'>('CONCERN');
  const [recommendedSpreads, setRecommendedSpreads] = useState<any[]>([]);
  const [isLoadingSpreads, setIsLoadingSpreads] = useState(false);
  const [activeDeckId, setActiveDeckId] = useState(deckId);

  const deckInfo = VISION_DECKS.find(d => d.id === activeDeckId);
  
  console.log("VisionPortal Examples:", examples);

  // Prioritize AI-generated personalized examples
  const personalizedExamples = examples || [];
  const genericExamples = deckInfo?.examples || [];
  const combinedExamples = [...personalizedExamples, ...genericExamples].slice(0, 10);

  const fetchSpreadRecommendations = async () => {
    setIsLoadingSpreads(true);
    setStep('SPREAD');
    try {
      const prompt = `사용자의 고민: "${localConcern}"
이 고민에 가장 적합한 타로 배열법(Spread) 3가지를 추천해주세요. 
또한 각 배열법에 가장 잘 어울리는 타로 덱을 다음 세 가지 중에서 하나 골라 추천해주세요:
1. CAT (캣 타로: 인간관계, 심리, 직관)
2. ANTIQUE (앤티크 타로: 중대한 결정, 장기적 전망)
3. VISCONTI (비스콘티 스포르자: 성공, 금전, 명예)

결과는 반드시 JSON 형식으로 반환하세요:
{
  "spreads": [
    {
      "name": "배열법 이름",
      "cardCount": 3,
      "reason": "배열법 추천 이유",
      "positions": ["1번 위치 의미", "2번 위치 의미", "3번 위치 의미"],
      "recommendedDeckId": "CAT" | "ANTIQUE" | "VISCONTI",
      "deckReason": "이 덱을 추천하는 이유"
    }
  ]
}`;
      const res = await callGemini("당신은 전문 타로 마스터입니다. 사용자의 고민에 가장 적합한 배열법과 덱을 추천해주는 전문가입니다.", prompt);
      const jsonMatch = res.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : res.replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);
      setRecommendedSpreads(data.spreads || []);
    } catch (err) {
      console.error("Spread Recommendation Error:", err);
      setRecommendedSpreads([
        { name: "3카드 배열", cardCount: 3, reason: "상황의 흐름을 파악하기 가장 기본적인 배열입니다.", positions: ["과거/원인", "현재/상황", "미래/결과"], recommendedDeckId: "CAT", deckReason: "고양이의 직관으로 상황의 미묘한 변화를 읽기에 좋습니다." },
        { name: "양자택일 배열", cardCount: 4, reason: "두 가지 선택지 사이에서 고민할 때 유용합니다.", positions: ["현재 상황", "A 선택 시", "B 선택 시", "최종 조언"], recommendedDeckId: "ANTIQUE", deckReason: "전통적인 상징을 통해 중대한 결정의 무게를 달아볼 수 있습니다." },
        { name: "성공의 계단", cardCount: 5, reason: "목표 달성을 위한 단계별 전략을 세우기에 좋습니다.", positions: ["현재 위치", "첫 번째 단계", "장애물", "조력자", "최종 성취"], recommendedDeckId: "VISCONTI", deckReason: "풍요와 성공의 에너지를 담은 골든 타로가 성취를 이끌어줄 것입니다." }
      ]);
    } finally {
      setIsLoadingSpreads(false);
    }
  };

  const selectSpreadAndDeck = (spread: any) => {
    setActiveDeckId(spread.recommendedDeckId);
    onDeckChange(spread.recommendedDeckId);
    setStep('SCAN');
  };

  const selectDeckManual = (id: string) => {
    setActiveDeckId(id);
    onDeckChange(id);
    setStep('SCAN');
  };

  useEffect(() => {
    if (step === 'SCAN') {
      async function startCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError('이 브라우저에서는 카메라 기능을 지원하지 않습니다.');
          return;
        }
        try {
          const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setStream(s);
          if (videoRef.current) videoRef.current.srcObject = s;
        } catch (err: any) {
          console.error('Camera Error:', err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError('카메라 접근 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.');
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setError('사용 가능한 카메라를 찾을 수 없습니다.');
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            setError('카메라가 이미 다른 프로그램에서 사용 중이거나 하드웨어 오류가 발생했습니다.');
          } else if (err.name === 'OverconstrainedError') {
            setError('요청한 카메라 설정을 지원하지 않습니다.');
          } else {
            setError('카메라를 시작하는 중 알 수 없는 오류가 발생했습니다.');
          }
        }
      }
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        setStream(null);
      }
    };
  }, [step]);

  const capture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64 = dataUrl.split(',')[1];
      
      const systemPrompt = `당신은 사주, 타로, 별자리의 지혜를 하나로 통합하여 통찰을 제공하는 통합 마스터 '트리니티(Trinity) AI'입니다.
사용자가 촬영한 실물 타로 카드들을 인식하고, 당신의 깊은 지혜를 바탕으로 해석을 제공해야 합니다.

[현재 선택된 덱 정보]
- 이름: ${deckInfo?.name}
- 설명: ${deckInfo?.desc}
- 상세 특성: ${deckInfo?.detail}
- 최적화된 질문 분야: ${deckInfo?.best}

[인식 가이드]
- ${activeDeckId === 'CAT' ? '이미지 속 고양이 캐릭터가 그려진 타로 카드의 상징을 정확히 읽어내세요.' : ''}
- ${activeDeckId === 'ANTIQUE' ? '고전적이고 세밀한 판화 스타일의 상징들을 역사적 맥락에서 분석하세요.' : ''}
- ${activeDeckId === 'VISCONTI' ? '화려한 금박과 중세 귀족풍의 인물 묘사를 인식하여 골든 타로의 에너지를 추출하세요.' : ''}
- 이미지의 색감, 인물의 구도, 상징물을 통해 카드의 이름과 정/역방향 여부를 판단하세요.

[사용자 정보 및 이전 상담 맥락]
- 사주 정보: ${sajuData || '정보 없음'}
- 별자리 정보: ${astroData || '정보 없음'}
- 루시와의 대화 메모리: ${lucyMemory || '아직 깊은 대화 기록이 없습니다.'}
- 사용자 선호도 및 특별 지침: ${userPreferences || '없음'}

[사용자의 고민]
${localConcern || '일반적인 운세'}

[해석 지침]
1. 이미지에서 보이는 모든 타로 카드를 정확히 식별하세요.
2. 당신은 '트리니티'로서, 단순한 타로 해석을 넘어 사용자의 사주 및 별자리 기운, 그리고 루시와 나누었던 대화의 맥락(메모리)을 고려하여 개인화된 해석을 제공하세요.
3. 말투는 깊이 있고 품격 있는 말투(~해요, ~습니다)를 사용하세요.
4. 각 카드의 의미를 위에서 설명한 덱의 고유한 에너지와 사용자의 고민에 맞춰 해석하세요.
5. 여러 장의 카드가 있다면, 카드들 사이의 관계와 흐름을 분석하여 '종합 해석'을 추가하세요.
6. 사용자의 질문과 선택된 덱의 특성을 고려하여 일상에서 시도해볼 수 있는 구체적인 활동 3가지를 제안하세요.
7. 오늘의 행운을 가져다줄 아이템과 색깔을 추천하세요.
8. 결과는 반드시 JSON 형식으로 반환하세요.`;

    try {
      const res = await callGemini(systemPrompt, `이미지에 있는 모든 카드들을 인식하고 사용자의 고민("${localConcern || '일반적인 운세'}")에 맞춰 ${deckInfo?.name}의 관점에서 해석해줘.`, false, undefined, { data: base64, mimeType: 'image/jpeg' });
      const jsonMatch = res.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : res.replace(/```json|```/g, '').trim();
      const json = JSON.parse(jsonStr);
      onResult(json);
    } catch (err: any) {
      console.error(err);
      if (err.message === "QUOTA_EXCEEDED") {
        setError('서비스 이용량이 많아 잠시 후 다시 시도해주세요. ✨');
      } else {
        setError('카드 인식에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsCapturing(false);
    }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#000', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}
    >
      {hasQuotaError && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ 
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', 
            zIndex: 1000, background: 'rgba(200, 169, 110, 0.15)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(200, 169, 110, 0.3)', borderRadius: '12px', padding: '8px 16px',
            display: 'flex', alignItems: 'center', gap: '8px', color: '#c8a96e', fontSize: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', pointerEvents: 'none', width: 'max-content'
          }}
        >
          <Sparkles size={14} />
          <span>현재 루시가 많은 대화를 나누고 있어 조금 느릴 수 있어요. ✨</span>
        </motion.div>
      )}
      {step === 'CONCERN' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px', background: '#0d0818', overflowY: 'auto' }}>
          <div className="w-full max-w-[420px] md:max-w-[800px] mx-auto flex flex-col h-full">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack} 
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>고민 입력</div>
            </div>
  
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontWeight: 500 }}>
                지금 당신의 마음속에 있는 <span style={{ color: '#c8a96e' }}>고민</span>을 적어주세요.
              </div>
  
              <div style={{ position: 'relative' }}>
                <textarea 
                  value={localConcern}
                  onChange={e => setLocalConcern(e.target.value)}
                  placeholder="예: 올해 연애운이 궁금해요. / 이직을 고민 중인데 잘 될까요?"
                  style={{ 
                    width: '100%', 
                    height: '160px',
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '24px', 
                    padding: '24px', 
                    color: '#fff', 
                    fontSize: '16px', 
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    lineHeight: 1.6
                  }}
                />
              </div>
  
              {combinedExamples.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {combinedExamples.map((ex, i) => {
                    const isPersonalized = personalizedExamples.includes(ex);
                    return (
                      <motion.button 
                        key={i}
                        whileHover={{ scale: 1.05, backgroundColor: isPersonalized ? 'rgba(200,169,110,0.25)' : 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLocalConcern(ex)}
                        style={{ 
                          padding: '10px 18px', 
                          borderRadius: '20px', 
                          background: isPersonalized ? 'rgba(200,169,110,0.15)' : 'rgba(255,255,255,0.05)', 
                          border: isPersonalized ? '1px solid rgba(200,169,110,0.4)' : '1px solid rgba(255,255,255,0.1)', 
                          color: isPersonalized ? '#fff' : 'rgba(255,255,255,0.6)', 
                          fontSize: '13px', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {isPersonalized && <Sparkles size={12} color="#c8a96e" />}
                        {ex}
                      </motion.button>
                    );
                  })}
                </div>
              ) : sajuData ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                  <Loader2 size={14} className="animate-spin" />
                  맞춤 고민을 불러오는 중...
                </div>
              ) : null}
            </div>
  
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#d4b982' }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchSpreadRecommendations}
                disabled={!localConcern.trim()}
                style={{ 
                  flex: 1,
                  padding: '20px', 
                  borderRadius: '20px', 
                  background: localConcern.trim() ? '#c8a96e' : 'rgba(255,255,255,0.05)', 
                  color: localConcern.trim() ? '#000' : 'rgba(255,255,255,0.2)', 
                  fontSize: '15px', 
                  fontWeight: 700, 
                  cursor: localConcern.trim() ? 'pointer' : 'default',
                  border: 'none',
                }}
              >
                배열법 추천받기
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('DECK_SELECT')}
                disabled={!localConcern.trim()}
                style={{ 
                  flex: 1,
                  padding: '20px', 
                  borderRadius: '20px', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: localConcern.trim() ? '#fff' : 'rgba(255,255,255,0.2)', 
                  fontSize: '15px', 
                  fontWeight: 700, 
                  cursor: localConcern.trim() ? 'pointer' : 'default',
                }}
              >
                덱 직접 선택하기
              </motion.button>
            </div>
          </div>
        </div>
      ) : step === 'DECK_SELECT' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px', background: '#0d0818', overflowY: 'auto' }}>
          <div className="w-full max-w-[420px] md:max-w-[800px] mx-auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setStep('CONCERN')} 
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>덱 직접 선택</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '8px' }}>
                사용하실 <span style={{ color: '#c8a96e' }}>타로 덱</span>을 선택해 주세요.<br/>
                덱마나 고유한 에너지와 해석의 관점이 달라집니다.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VISION_DECKS.map((deck) => (
                  <motion.button
                    key={deck.id}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectDeckManual(deck.id)}
                    style={{
                      padding: '24px',
                      borderRadius: '24px',
                      background: activeDeckId === deck.id ? 'rgba(200,169,110,0.15)' : 'rgba(255,255,255,0.03)',
                      border: activeDeckId === deck.id ? '2px solid #c8a96e' : '1px solid rgba(255,255,255,0.1)',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: activeDeckId === deck.id ? '#c8a96e' : '#fff' }}>{deck.name}</div>
                      {activeDeckId === deck.id && <Sparkles size={16} color="#c8a96e" />}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{deck.desc}</div>
                    <div style={{ fontSize: '11px', color: '#c8a96e', fontWeight: 600, marginTop: '4px', letterSpacing: '0.02em' }}>BEST: {deck.best}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : step === 'SPREAD' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px', background: '#0d0818', overflowY: 'auto' }}>
          <div className="w-full max-w-[420px] md:max-w-[800px] mx-auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setStep('CONCERN')} 
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>배열법 추천</div>
            </div>
  
            {isLoadingSpreads ? (
              <div style={{ padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <Loader2 size={40} className="animate-spin" color="#c8a96e" />
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>고민에 맞는 최적의 배열법을 찾는 중...</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                  "{localConcern}" 고민에 대해<br/>
                  트리니티가 추천하는 <span style={{ color: '#c8a96e' }}>배열법</span>입니다.
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedSpreads.map((spread, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ 
                        padding: '24px', 
                        borderRadius: '24px', 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(200,169,110,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#c8a96e' }}>{spread.name}</div>
                        <div style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '10px', background: 'rgba(200,169,110,0.15)', color: '#c8a96e' }}>{spread.cardCount}장</div>
                      </div>
                      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{spread.reason}</div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                        {spread.positions.map((pos: string, j: number) => (
                          <div key={j} style={{ padding: '6px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', fontSize: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {j+1}. {pos}
                          </div>
                        ))}
                      </div>
    
                      <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                        <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(200,169,110,0.05)', border: '1px solid rgba(200,169,110,0.1)', marginBottom: '16px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#c8a96e', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={14} /> 추천 덱: {VISION_DECKS.find(d => d.id === spread.recommendedDeckId)?.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{spread.deckReason}</div>
                        </div>
    
                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: '#d4b982' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectSpreadAndDeck(spread)}
                          style={{ 
                            width: '100%', 
                            padding: '14px', 
                            borderRadius: '16px', 
                            background: '#c8a96e', 
                            color: '#000', 
                            fontSize: '14px', 
                            fontWeight: 700, 
                            cursor: 'pointer',
                            border: 'none'
                          }}
                        >
                          이 배열법과 덱으로 시작하기
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ 
              padding: '24px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 100%)', 
              backdropFilter: 'blur(20px)', 
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              zIndex: 10
            }}
          >
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStep('CONCERN')} 
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
                {VISION_DECKS.find(d => d.id === activeDeckId)?.name} <span style={{ color: '#c8a96e', marginLeft: '4px' }}>스캔</span>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>실물 타로 카드를 카메라에 비춰주세요.</div>
            </div>
          </motion.div>
          
          {/* Camera Viewport */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
            {error ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ color: '#ff4d4d', textAlign: 'center', padding: '40px', background: 'rgba(255,77,77,0.1)', borderRadius: '20px', border: '1px solid rgba(255,77,77,0.2)' }}
              >
                <div style={{ marginBottom: '12px' }}><X size={32} /></div>
                <div style={{ fontSize: '15px', lineHeight: 1.6 }}>{error}</div>
              </motion.div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Scanning Overlay */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '95%', height: '85%', maxWidth: '500px', maxHeight: '800px' }}>
                    {/* The "Hole" in the overlay */}
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '32px', boxShadow: '0 0 0 2000px rgba(0,0,0,0.7)', pointerEvents: 'none' }} />
                    
                    {/* Animated Corner Guides */}
                    <motion.div 
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                    >
                      <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '40px', height: '40px', borderTop: '5px solid #c8a96e', borderLeft: '5px solid #c8a96e', borderTopLeftRadius: '32px' }} />
                      <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '40px', height: '40px', borderTop: '5px solid #c8a96e', borderRight: '5px solid #c8a96e', borderTopRightRadius: '32px' }} />
                      <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '40px', height: '40px', borderBottom: '5px solid #c8a96e', borderLeft: '5px solid #c8a96e', borderBottomLeftRadius: '32px' }} />
                      <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '40px', height: '40px', borderBottom: '5px solid #c8a96e', borderRight: '5px solid #c8a96e', borderBottomRightRadius: '32px' }} />
                    </motion.div>

                    {/* Labeling */}
                    <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: '#c8a96e', color: '#000', padding: '6px 20px', borderRadius: '24px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.15em', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      SCANNING AREA
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      style={{ position: 'absolute', bottom: '-40px', left: 0, right: 0, textAlign: 'center' }}
                    >
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 500, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        카드들을 영역 안에 선명하게 배치해주세요
                      </div>
                    </motion.div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer / Capture Button */}
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            style={{ 
              padding: '40px 20px 60px', 
              background: 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', 
              display: 'flex', 
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={capture}
              disabled={isCapturing}
              style={{ 
                width: '84px', 
                height: '84px', 
                borderRadius: '50%', 
                border: '4px solid #fff', 
                background: isCapturing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 30px rgba(0,0,0,0.5)'
              }}
            >
              {isCapturing ? (
                <Loader2 className="animate-spin" size={32} color="#fff" />
              ) : (
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fff', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)' }} 
                />
              )}
            </motion.button>
          </motion.div>
        </>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </motion.div>
  );
}
