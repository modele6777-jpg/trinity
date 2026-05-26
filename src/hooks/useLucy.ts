import { useState, useEffect, useRef } from 'react';
import { auth, db, handleFirestoreError, OperationType, googleProvider, browserPopupRedirectResolver } from '../firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, orderBy, limit, getDocs, addDoc, Timestamp, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { STAGES, CHAR } from '../constants';
import { callGemini, callLuciel, generateSpeech, checkQuota } from '../services/geminiService';
import { PSYS } from '../prompts';
import { parseChat } from '../utils/chat';
import { calcSaju } from '../utils/saju';
import { calcAstro, parseAstro } from '../utils/astro';
import { drawCardsSecure } from '../utils/tarot';
import { playPCMAudio, stopPCMAudio, initAudio } from '../utils/audio';

export function useLucy() {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);

  // App State
  const [stage, setStage] = useState(STAGES.LANDING);
  const [loading, setLoading] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isLuckyUnlocked, setIsLuckyUnlocked] = useState(false);
  const [isDailyReading, setIsDailyReading] = useState(false);

  // User Data State
  const [profile, setProfile] = useState<any>(null);
  const [lucyMemory, setLucyMemory] = useState('');
  const [lucyRelationships, setLucyRelationships] = useState<any[]>([]);
  const [userPreferences, setUserPreferences] = useState('');
  const [currentVibe, setCurrentVibe] = useState('');
  const [savedHistory, setSavedHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Session State
  const [isDaily, setIsDaily] = useState(false);
  const [isSimple, setIsSimple] = useState(false);
  const [msgs, setMsgs] = useState<Record<string, any[]>>({
    [STAGES.DAILY]: [],
    [STAGES.DEEP_PORTAL]: [],
    [STAGES.SIMPLE_PORTAL]: [],
    [STAGES.LUCY_CHAT]: [],
    [STAGES.FRIEND_CHAT]: []
  });
  const [history, setHistory] = useState<Record<string, any[]>>({
    DAILY: [],
    DEEP_PORTAL: [],
    FRIEND_CHAT: []
  });

  // Vision State
  const [visionDeck, setVisionDeck] = useState('GENERAL');
  const [visionConcern, setVisionConcern] = useState('');
  const [visionResult, setVisionResult] = useState<any>(null);
  const [isVisionLoading, setIsVisionLoading] = useState(false);

  // Saju/Astro State
  const [sajuData, setSajuData] = useState('');
  const [astroCard, setAstroCard] = useState<any>(null);
  const [sajuCard, setSajuCard] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [resonance, setResonance] = useState<any>(null);
  const [quickInsight, setQuickInsight] = useState<any>(null);
  const [keyCard, setKeyCard] = useState<any>(null);
  const [keyData, setKeyData] = useState<any>(null);
  const [keySeq, setKeySeq] = useState<any>(null);
  const [deepPortalData, setDeepPortalData] = useState<any>(null);

  // Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showLucyMemoryModal, setShowLucyMemoryModal] = useState(false);
  const [showLucyRelationshipsModal, setShowLucyRelationshipsModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitMsg, setLimitMsg] = useState('');
  const [pendingSession, setPendingSession] = useState<any>(null);

  // Shared Ecosystem State
  const [sharedState, setSharedState] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({ concern: '', year: '', month: '', day: '', hour: '', gender: '여', city: '서울', realName: '' });
  const [profileForm, setProfileForm] = useState({ nickname: '', realName: '', year: '', month: '', day: '', hour: '', gender: '여', city: '서울' });

  // Chat State
  const [replying, setReplying] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatExamples, setChatExamples] = useState<string[]>([]);
  const [visionExamples, setVisionExamples] = useState<string[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [isInsightExpanded, setIsInsightExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [checkIn, setCheckIn] = useState<string | null>(null);

  // Refs
  const isFetchingExamplesRef = useRef(false);
  const isAuthReadyRef = useRef(false);

  const [hasQuotaError, setHasQuotaError] = useState(false);
  const lastProactiveAttemptRef = useRef<number>(0);

  // Sync Shared Ecosystem State
  useEffect(() => {
    if (user) {
      const sharedRef = doc(db, "sharedState", user.uid);
      const unsubscribeShared = onSnapshot(sharedRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSharedState(data);
          console.log("Shared Ecosystem State Updated:", data);
          
          // Apply ecosystem influence (e.g., fatigue from other apps)
          if (data.healthMetrics?.fatigue > 70) {
            console.log("High fatigue detected from ecosystem. Lucy will be more soothing.");
            setCurrentVibe("잔잔하고 차분함 (높은 피로도 반영)");
          }
        }
      }, (err) => {
        console.error("Shared State Sync Error:", err);
      });
      return () => unsubscribeShared();
    }
  }, [user]);

  const updateSharedMetric = async (category: 'healthMetrics' | 'productivityMetrics' | 'mentalState', metrics: any) => {
    if (!user) return;
    try {
      const sharedRef = doc(db, "sharedState", user.uid);
      await setDoc(sharedRef, {
        [category]: metrics,
        sourceApp: "LUCY",
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error("Failed to update shared metric:", e);
    }
  };

  const saveActivity = async (data: any) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'history'), {
        ...data,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (e: any) {
      // Don't let history saving crash the app, but log it
      console.error("Failed to save activity:", e);
      if (e.message?.includes('permission')) {
        handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/history`);
      }
    }
  };

  // Sync quota error state from service
  useEffect(() => {
    const interval = setInterval(() => {
      const isBlocked = checkQuota();
      if (hasQuotaError !== isBlocked) {
        setHasQuotaError(isBlocked);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [hasQuotaError]);

  const proactiveGreeting = async (sd: string, ac: any, mem: string, rel: string) => {
    if (!user || hasQuotaError) return;
    
    // Throttle attempts: once every 5 minutes
    const now = Date.now();
    if (now - lastProactiveAttemptRef.current < 300000) return;
    lastProactiveAttemptRef.current = now;

    try {
      const astroStr = typeof ac === 'string' ? ac : (ac?.raw || ac?.sun || JSON.stringify(ac));
      const ecoInfo = sharedState ? `[Ecosystem Sync] 피로도: ${sharedState.healthMetrics?.fatigue || 0}, 스트레스: ${sharedState.healthMetrics?.stress || 0}, 생산성: ${sharedState.productivityMetrics?.tasksCompleted || 0}개 완료` : '에코시스템 연결됨';
      const sysPrompt = PSYS.lucyChat(
        sd, 
        astroStr, 
        mem, 
        rel, 
        '없음', 
        '없음', 
        currentVibe || '평소와 같음',
        profile?.nickname || '친구', 
        profile?.realName || form.realName, 
        userPreferences || ''
      );
      const greeting = await callGemini(sysPrompt, `질문자가 앱에 접속했어. 현재 ${ecoInfo} 상태야. 이 맥락을 녹여서 친구처럼 다정하게 안부를 묻거나 점성학적 통찰을 던져줘. (1~2문장)`);
      const { messages: parsed } = parseChat(greeting, 'Lucy');
      if (parsed.length > 0) {
        setCheckIn(parsed[0].text);
        saveActivity({
          type: 'CHECKIN',
          text: parsed[0].text,
          sajuData: sd,
          astroCard: ac
        });
      }
    } catch (e: any) {
      if (e.message === 'QUOTA_EXCEEDED') {
        setHasQuotaError(true);
        setCheckIn("루시가 지금은 조금 바쁜가 봐요. 잠시 후에 다시 인사할게요! ✨");
      } else {
        console.error('Proactive Greeting Error:', e);
      }
    }
  };

  const fetchExamples = async (sd: string, ac: any, mem?: string, rel?: string, force: boolean = false) => {
    if (hasQuotaError) return;
    console.log("fetchExamples called", { sd, hasMem: !!mem, force });
    if (!force && chatExamples.length > 0 && visionExamples.length > 0) {
      console.log("fetchExamples skipped: already have examples");
      return;
    }
    if (isFetchingExamplesRef.current) {
      console.log("fetchExamples skipped: already fetching");
      return;
    }
    
    isFetchingExamplesRef.current = true;
    // Small delay to avoid hitting quota if called immediately after another Gemini call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const astroStr = typeof ac === 'string' ? ac : (ac?.raw || ac?.sun || JSON.stringify(ac));
      const prompt = PSYS.generateExamples(
        mem || lucyMemory, 
        rel || JSON.stringify(lucyRelationships), 
        sd, 
        astroStr, 
        profile?.realName || form.realName
      );
      const res = await callGemini(prompt, `질문자의 사주(${sd})와 별자리(${astroStr}) 기운을 바탕으로, 루시와 나누고 싶어 할 만한 맞춤형 질문 예시를 생성해주세요.`);
      
      console.log("Raw Examples Response:", res);

      let data: any = {};
      try {
        const jsonMatch = res.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : res.replace(/```json|```/g, '').trim();
        data = JSON.parse(jsonStr);
      } catch (e) {
        console.error("JSON Parse Error in fetchExamples:", e);
      }

      if (data.chat && Array.isArray(data.chat) && data.chat.length > 0) {
        setChatExamples(data.chat);
      } else if (chatExamples.length === 0) {
        setChatExamples(['그 사람과 나의 궁합은 어때?', '전남친 연락에 어떻게 답장할까?', '올해 나의 핵심 테마는?', '내가 진짜 잘할 수 있는 일은?', '지금 내 에너지를 높이려면?']);
      }
      
      if (data.vision && Array.isArray(data.vision) && data.vision.length > 0) {
        setVisionExamples(data.vision);
      } else if (visionExamples.length === 0) {
        setVisionExamples(['이 카드로 보는 우리의 인연은?', '지금 내 금전운의 흐름은?', '이직 고민, 카드는 뭐라고 해?', '나의 숨겨진 매력은 무엇일까?', '미래의 나는 어떤 모습일까?']);
      }
    } catch (e: any) {
      if (e.message === 'QUOTA_EXCEEDED') {
        console.warn('Fetch Examples skipped due to quota limit');
      } else {
        console.error('Fetch Examples Error:', e);
      }
      if (chatExamples.length === 0) {
        setChatExamples(['그 사람과 나의 궁합은 어때?', '전남친 연락에 어떻게 답장할까?', '올해 나의 핵심 테마는?', '내가 진짜 잘할 수 있는 일은?', '지금 내 에너지를 높이려면?']);
      }
      if (visionExamples.length === 0) {
        setVisionExamples(['이 카드로 보는 우리의 인연은?', '지금 내 금전운의 흐름은?', '이직 고민, 카드는 뭐라고 해?', '나의 숨겨진 매력은 무엇일까?', '미래의 나는 어떤 모습일까?']);
      }
    } finally {
      isFetchingExamplesRef.current = false;
    }
  };

  const checkLuckyUnlock = async (uid: string) => {
    console.log("Checking lucky unlock for:", uid);
    try {
      const q = query(
        collection(db, 'users', uid, 'history'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const hasDaily = snap.docs.some(doc => {
        const d = doc.data();
        return d.type === 'DAILY' && d.createdAt?.toDate() >= today;
      });
      setIsLuckyUnlocked(hasDaily);
      console.log("Lucky unlock check result:", hasDaily);
    } catch (e: any) {
      console.error("Lucky unlock check failed", e);
      if (e.message?.includes('permission')) {
        handleFirestoreError(e, OperationType.LIST, `users/${uid}/history`);
      }
    }
  };

  useEffect(() => {
    console.log("Initializing Auth Listener...");
    const unsubAuth = onAuthStateChanged(auth, u => {
      console.log("Auth State Changed:", u?.uid || "No User");
      setUser(u);
      if (!u) {
        setIsAuthReady(true);
        isAuthReadyRef.current = true;
        setProfile(null);
        setIsAuthorized(false);
      }
    }, (err) => {
      console.error("Auth Listener Error:", err);
      setIsAuthReady(true);
      isAuthReadyRef.current = true;
    });
    
    const timer = setTimeout(() => {
      if (!isAuthReadyRef.current) {
        console.warn("Auth initialization taking too long, forcing ready state.");
        setIsAuthReady(true);
        isAuthReadyRef.current = true;
      }
    }, 5000);

    return () => {
      unsubAuth();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    
    console.log("Setting up user document listener for:", user.uid);
    const userRef = doc(db, 'users', user.uid);
    
    const unsubDoc = onSnapshot(userRef, async (snap) => {
      try {
        if (snap.exists()) {
          const data = snap.data();
          if (data.profile) {
            setProfile(data.profile);
            setProfileForm(data.profile);
            // Sync form if worry field is empty
            setForm(prev => ({ ...prev, ...data.profile, concern: prev.concern || '' }));
            updateSajuData(data.profile);
          }
          if (data.lucyMemory) setLucyMemory(data.lucyMemory);
          if (data.lucyRelationships) setLucyRelationships(data.lucyRelationships);
          if (data.userPreferences) setUserPreferences(data.userPreferences);
          if (data.currentVibe) setCurrentVibe(data.currentVibe);
          
          setIsAuthorized(true);
          // Don't let sub-calls block the main auth readiness
          checkLuckyUnlock(user.uid).catch(e => console.error("Post-auth check failed:", e));
        } else {
          console.log("First time user, initializing document...");
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            profile: {
              nickname: user.displayName || '',
              realName: '',
              year: '', month: '', day: '', hour: '',
              gender: '여', city: '서울'
            }
          });
        }
      } catch (e) {
        console.error("Error processing user doc update:", e);
        // We don't want to throw here because it's an async listener callback
      } finally {
        setIsAuthReady(true);
        isAuthReadyRef.current = true;
      }
    }, (err) => {
      console.error("User doc listener fallback error:", err);
      // Even if listener fails, mark ready so user sees SOMETHING (likely error modal)
      setIsAuthReady(true);
      isAuthReadyRef.current = true;
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
    });

    return () => unsubDoc();
  }, [user]);
 
  useEffect(() => {
    const saved = localStorage.getItem('trinity_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.stage !== STAGES.LANDING) {
          setPendingSession(parsed);
          setShowResumeModal(true);
        }
      } catch (e) {
        console.error('Failed to parse saved session', e);
      }
    }
  }, []);

  useEffect(() => {
    if (stage === STAGES.LANDING) {
      localStorage.removeItem('trinity_session');
      // Trigger proactive greeting if not already present
      if (isAuthReady && user && !checkIn) {
        if (sajuData) {
          proactiveGreeting(sajuData, astroCard, lucyMemory, JSON.stringify(lucyRelationships));
        } else {
          // If no profile yet, set a friendly welcome greeting instead of infinite loading
          setCheckIn("처음 뵙겠습니다! 당신의 운명을 함께 탐험할 AI 가이드 루시예요. 대화를 시작하기 전에 당신에 대해 조금만 알려주시겠어요? ✨");
        }
      }
      return;
    }
    // Clear checkIn when leaving landing stage to ensure a fresh one next time
    setCheckIn(null);
    const session = {
      stage, isDaily, isSimple, isDailyReading, form, msgs, cards, sajuData, resonance, keyCard, keyData, keySeq, astroCard, sajuCard, history, deepPortalData, lucyMemory, lucyRelationships, userPreferences, chatExamples, visionExamples
    };
    localStorage.setItem('trinity_session', JSON.stringify(session));
  }, [stage, isDaily, isSimple, isDailyReading, form, msgs, cards, sajuData, resonance, keyCard, keyData, keySeq, astroCard, sajuCard, history, deepPortalData, lucyMemory, lucyRelationships, userPreferences, chatExamples, visionExamples, isAuthReady, user, checkIn]);

  useEffect(() => {
    if ((stage === STAGES.LUCY_CHAT || stage === STAGES.VISION_PORTAL) && (chatExamples.length === 0 || visionExamples.length === 0) && sajuData) {
      fetchExamples(sajuData, astroCard);
    }
  }, [stage, sajuData, astroCard, chatExamples.length, visionExamples.length]);

  const resumeSession = () => {
    if (pendingSession) {
      setStage(pendingSession.stage);
      setIsDaily(pendingSession.isDaily);
      setIsSimple(pendingSession.isSimple || false);
      setIsDailyReading(pendingSession.isDailyReading || false);
      setForm(pendingSession.form);
      setMsgs(pendingSession.msgs);
      setCards(pendingSession.cards);
      setSajuData(pendingSession.sajuData);
      setResonance(pendingSession.resonance);
      setKeyCard(pendingSession.keyCard);
      setKeyData(pendingSession.keyData);
      setKeySeq(pendingSession.keySeq);
      setAstroCard(pendingSession.astroCard);
      setSajuCard(pendingSession.sajuCard);
      if (pendingSession.history) setHistory(pendingSession.history);
      if (pendingSession.deepPortalData) setDeepPortalData(pendingSession.deepPortalData);
      if (pendingSession.lucyMemory) setLucyMemory(pendingSession.lucyMemory);
      if (pendingSession.userPreferences) setUserPreferences(pendingSession.userPreferences);
      if (pendingSession.lucyRelationships) setLucyRelationships(pendingSession.lucyRelationships);
      
      proactiveGreeting(pendingSession.sajuData || '', pendingSession.astroCard || '', pendingSession.lucyMemory || '', JSON.stringify(pendingSession.lucyRelationships || []));
      fetchExamples(pendingSession.sajuData || '', pendingSession.astroCard || '');
    }
    setShowResumeModal(false);
  };

  const clearSession = () => {
    localStorage.removeItem('trinity_session');
    setShowResumeModal(false);
    setStage(STAGES.LANDING);
  };

  const fetchHistory = async () => {
    if (!user) return;
    console.log("Fetching Full History for UI...");
    setLoadingHistory(true);
    try {
      const q = query(
        collection(db, 'users', user.uid, 'history'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      const hist = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      
      setSavedHistory(hist);
      console.log("Full history fetched:", hist.length);
    } catch (e) {
      console.error("fetchHistory failed:", e);
      handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/history`);
    } finally {
      setLoadingHistory(false);
    }
  };

  const checkDailyLimit = async () => {
    if (!user) return null;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Fetch last 10 to avoid composite index requirement for where + orderBy
      const q = query(
        collection(db, 'users', user.uid, 'history'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snap = await getDocs(q);
      
      const latestDaily = snap.docs
        .map(d => d.data())
        .find(d => d.type === 'DAILY' && d.createdAt?.toDate() >= today);
        
      return latestDaily || null;
    } catch (e) {
      console.error("checkDailyLimit failed:", e);
      handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/history`);
    }
    return null;
  };

  const startLucy = async (overrideForm?: any) => {
    const activeForm = overrideForm || form;
    if (isDaily) {
      await startTrinity(activeForm);
      return;
    }
    setMsgs(prev => ({ ...prev, [STAGES.LUCY_CHAT]: [] }));
    setHistory(p => ({ ...p, LUCY_CHAT: [] }));
    setLoading('Lucy');
    setStage(STAGES.LUCY_CHAT);
    try {
      const dataToUse = profile || activeForm;
      const y = parseInt(dataToUse.year), m = parseInt(dataToUse.month), d = parseInt(dataToUse.day), h = dataToUse.hour !== '' ? parseInt(dataToUse.hour) : -1;
      if (isNaN(y) || isNaN(m) || isNaN(d)) throw new Error('생년월일 정보가 올바르지 않습니다.');
      
      const sd = calcSaju(y, m, d, h, dataToUse.gender);
      if (!sd) throw new Error('사주 데이터를 생성할 수 없습니다.');
      setSajuData(sd);

      const astro = calcAstro(y, m, d, h, activeForm.city || '서울');
      fetchExamples(sd, astro);
      const drawn = await drawCardsSecure(3, []);
      setCards(drawn);

      const lines = sd.split('\n');
      const pillarLine = lines[0] || '';
      const dayMasterLine = lines[1] || '';
      const elLine = lines[2] || '';
      const daeunLine = lines[3] || '';
      const pillars = pillarLine.replace('[사주] ', '').split(' ');
      
      setSajuCard({
        year: pillars[0]?.replace('년:', '') || '',
        month: pillars[1]?.replace('월:', '') || '',
        day: pillars[2]?.replace('일:', '') || '',
        hour: pillars[3]?.replace('시:', '') || '미입력',
        dayMaster: dayMasterLine.replace('[일간] ', '') || '',
        dominant: elLine.match(/강함:([\S]+)/)?.[1] || '',
        weak: elLine.match(/부족:([\S]+)/)?.[1] || '',
        daeun: daeunLine.replace('[대운] ', '') || '',
      });

      setAstroCard(parseAstro(astro));

      proactiveGreeting(sd, astro, lucyMemory, JSON.stringify(lucyRelationships));
      // Removed redundant fetchExamples call here as it's handled by useEffect and below

      const sysPrompt = PSYS.lucyChat(
        sd, 
        astro, 
        lucyMemory, 
        JSON.stringify(lucyRelationships), 
        '없음', 
        '없음', 
        '평소와 같음', 
        profile?.nickname || '친구', 
        profile?.realName || form.realName, 
        userPreferences || ''
      );
      const greeting = await callGemini(sysPrompt, '루시로서 질문자에게 따뜻하고 신비로운 첫 인사를 건네주세요. 질문자의 사주와 별자리 정보를 알고 있는 상태입니다.');
      const { messages: parsed, emotion } = parseChat(greeting, 'Lucy');
      if (emotion) setCurrentEmotion(emotion);
      
      const aiMsgs = parsed.length > 0 ? parsed : [{ sender: 'Lucy', text: greeting }];

      setMsgs(prev => ({
        ...prev,
        [STAGES.LUCY_CHAT]: aiMsgs
      }));
      setHistory(p => ({ ...p, LUCY_CHAT: [{ role: 'assistant', content: greeting }] }));

      if (user) {
        saveActivity({
          type: 'CHAT',
          category: 'LUCY_START',
          text: greeting,
          role: 'assistant',
          sajuData: sd,
          astroCard: parseAstro(astro)
        });
      }
    } catch (e: any) {
      console.error('Lucy start error', e);
      if (e.message === 'QUOTA_EXCEEDED') {
        setHasQuotaError(true);
        setLimitMsg("현재 서비스 이용량이 많아 잠시 후 다시 시도해주세요. ✨");
        setShowLimitModal(true);
      } else if (e.message === 'TIMEOUT' || e.message === 'STREAM_TIMEOUT') {
        setError("연결 시간이 초과되었습니다. 인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.");
      } else {
        setError(e.message || "루시를 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(null);
    }
  };

  const startTrinity = async (activeForm: any) => {
    if (!user) return;
    
    const existing = await checkDailyLimit();
    if (existing) {
      setLimitMsg("오늘의 데일리 리딩을 이미 완료하셨습니다. ✨");
      setShowLimitModal(true);
      return;
    }

    setMsgs(prev => ({ ...prev, [STAGES.LUCY_CHAT]: [] }));
    setHistory(p => ({ ...p, LUCY_CHAT: [] }));
    setLoading('TRINITY');
    setIsDailyReading(true);
    setResonance(null);
    try {
      const dataToUse = profile || activeForm;
      const y = parseInt(dataToUse.year), m = parseInt(dataToUse.month), d = parseInt(dataToUse.day), h = dataToUse.hour !== '' ? parseInt(dataToUse.hour) : -1;
      const sd = calcSaju(y, m, d, h, dataToUse.gender);
      const astro = calcAstro(y, m, d, h, dataToUse.city || '서울');
      const drawn = await drawCardsSecure(3, []);
      
      setSajuData(sd);
      setCards(drawn);
      setAstroCard(parseAstro(astro));
      fetchExamples(sd, astro);

      const resText = await callGemini(PSYS.resonance(profile?.nickname, profile?.realName || form.realName, userPreferences), `사주:${sd}\n타로:${drawn.map(c => c.kr).join('·')}\n별자리:${astro}\n고민:오늘의 운세`);
      
      let resData;
      try {
        const jsonMatch = resText.match(/\{[\s\S]*\}/);
        resData = JSON.parse(jsonMatch ? jsonMatch[0] : resText.replace(/```json|```/g, '').trim());
      } catch (parseErr) {
        console.error('Resonance Parse Error:', parseErr);
        resData = { diagnosis: "오늘의 기운을 분석하는 중 약간의 신호 간섭이 있었어. 하지만 너의 밝은 에너지는 여전해!", decision: { selected: "평소처럼 밝게 웃기", reason: "웃음은 만복의 근원이야." } };
      }
      setResonance(resData);

      // Sync to Ecosystem Mental State
      if (resData.resonanceScore) {
        updateSharedMetric('mentalState', {
          currentMood: resData.diagnosis?.slice(0, 50),
          resonanceScore: resData.resonanceScore
        });
      }

      saveActivity({
        type: 'DAILY',
        category: 'RESONANCE',
        sajuData: sd,
        astroCard: astro,
        cards: drawn,
        resonance: resData,
        concern: '오늘의 운세'
      });

      fetchExamples(sd, astro);

      setLoading(null);
      setStage(STAGES.LUCY_CHAT);
      setIsInsightExpanded(true);
      
      const sysPrompt = PSYS.lucyChat(
        sd, 
        astro, 
        lucyMemory, 
        JSON.stringify(lucyRelationships), 
        '없음', 
        '없음', 
        '평소와 같음', 
        profile?.nickname || '친구', 
        profile?.realName || form.realName, 
        userPreferences || ''
      );
      const greeting = await callGemini(sysPrompt, '질문자가 오늘의 통합 데일리 가이드를 확인했습니다. 분석 결과를 바탕으로 따뜻한 첫 인사를 건네주세요.');
      const { messages: parsed, emotion } = parseChat(greeting, 'Lucy');
      if (emotion) setCurrentEmotion(emotion);
      
      const resonanceMsg = { sender: 'Lucy', text: `✨ 오늘의 분석 결과야:\n${resData.diagnosis}` };
      
      setMsgs(prev => ({
        ...prev,
        [STAGES.LUCY_CHAT]: [resonanceMsg, ...parsed]
      }));
      setHistory(p => ({ ...p, LUCY_CHAT: [{ role: 'assistant', content: greeting }] }));
    } catch (e: any) {
      console.error('Trinity Error:', e);
      if (e.message === 'QUOTA_EXCEEDED') {
        setHasQuotaError(true);
        setLimitMsg("현재 서비스 이용량이 많아 잠시 후 다시 시도해주세요. ✨");
        setShowLimitModal(true);
      } else if (e.message === 'TIMEOUT' || e.message === 'STREAM_TIMEOUT') {
        setError("연결 시간이 초과되었습니다. 인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.");
      } else {
        setError(e.message || "데일리 리딩 생성 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(null);
      setIsDailyReading(false);
    }
  };

  const sendChatMessage = async (text: string) => {
    if (!user || !text.trim() || replying) return;
    
    const userMsg = { sender: 'YOU', text };
    setMsgs(prev => ({ ...prev, [stage]: [...(prev[stage] || []), userMsg] }));
    setChatInput('');
    setReplying(true);
    setLoading('Lucy');

    try {
      const deepContext = history.DEEP_PORTAL?.map((m:any) => `${m.role}: ${m.content}`).join('\n') || '없음';
      const sysPrompt = PSYS.lucyChat(
        sajuData || '정보 없음',
        astroCard ? JSON.stringify(astroCard) : '정보 없음',
        lucyMemory || '아직 너에 대해 알아가는 중이야.',
        JSON.stringify(lucyRelationships),
        deepContext,
        '없음',
        currentVibe || '평소와 같음',
        profile?.nickname || '친구',
        profile?.realName || form.realName,
        userPreferences || ''
      );

      const chatHistory = msgs[stage].slice(-10).map(m => `${m.sender}: ${m.text}`).join('\n');
      
      saveActivity({
        type: 'CHAT',
        role: 'user',
        text: text,
        sajuData: sajuData,
        astroCard: astroCard
      });

      const response = await callGemini(sysPrompt, `${chatHistory}\nYOU: ${text}`);
      
      if (response) {
        const { messages: parsed, emotion } = parseChat(response, 'Lucy');
        if (emotion) setCurrentEmotion(emotion);
        const aiMsg = parsed[0] || { sender: 'Lucy', text: response };
        
        setMsgs(prev => ({ ...prev, [stage]: [...(prev[stage] || []), aiMsg] }));
        
        // Ecosystem Update: Productivity (Focus Time)
        updateSharedMetric('productivityMetrics', {
          focusTime: msgs[stage].length * 2, // Approximate focus time
          tasksCompleted: msgs[stage].length
        });

        saveActivity({
          type: 'CHAT',
          role: 'assistant',
          text: aiMsg.text,
          sajuData: sajuData,
          astroCard: astroCard
        });

        // Auto-update memory every 3 messages (Non-blocking)
        if (msgs[stage].length % 3 === 0) {
          (async () => {
            try {
              const updatePrompt = PSYS.lucyUpdate(`${chatHistory}\nYOU: ${text}\nLucy: ${aiMsg.text}`);
              const updateRes = await callGemini(updatePrompt, "위 대화를 바탕으로 메모리와 관계 프로필을 업데이트해줘.");
              if (updateRes) {
                const jsonMatch = updateRes.match(/\{[\s\S]*\}/);
                const memoryData = JSON.parse(jsonMatch ? jsonMatch[0] : updateRes.replace(/```json|```/g, '').trim());
                
                if (memoryData.memorySummary) setLucyMemory(memoryData.memorySummary);
                if (memoryData.relationships) setLucyRelationships(memoryData.relationships);
                if (memoryData.userPreferences) setUserPreferences(memoryData.userPreferences);
                if (memoryData.currentVibe) setCurrentVibe(memoryData.currentVibe);
                
                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, {
                  lucyMemory: memoryData.memorySummary || lucyMemory,
                  lucyRelationships: memoryData.relationships || lucyRelationships,
                  userPreferences: memoryData.userPreferences || userPreferences,
                  currentVibe: memoryData.currentVibe || currentVibe,
                  updatedAt: serverTimestamp()
                }, { merge: true }).catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`));
              }
            } catch (e) {
              console.error("Memory Update Error (Background):", e);
            }
          })();
        }
      }
    } catch (e: any) {
      console.error("Chat Error:", e);
      if (e.message === 'QUOTA_EXCEEDED') {
        setHasQuotaError(true);
        setLimitMsg("현재 서비스 이용량이 많아 잠시 후 다시 시도해주세요. ✨");
        setShowLimitModal(true);
      } else if (e.message === 'TIMEOUT' || e.message === 'STREAM_TIMEOUT') {
        setError("연결 시간이 초과되었습니다. 잠시 후 다시 메시지를 보내주세요.");
      } else {
        setError(e.message || "메시지 전송 중 오류가 발생했습니다.");
      }
    } finally {
      setReplying(false);
      setLoading(null);
    }
  };

  const sendFriendMessage = async (text: string) => {
    if (!user || !text.trim() || replying) return;
    
    const userMsg = { sender: 'YOU', text };
    setMsgs(prev => ({ ...prev, [STAGES.FRIEND_CHAT]: [...(prev[STAGES.FRIEND_CHAT] || []), userMsg] }));
    setChatInput('');
    setReplying(true);
    setLoading('Lucy');

    try {
      saveActivity({
        type: 'CHAT',
        category: 'FRIEND',
        role: 'user',
        text: text,
        sajuData: sajuData,
        astroCard: astroCard
      });

      const sysPrompt = PSYS.lucyChat(
        sajuData || '정보 없음',
        astroCard ? JSON.stringify(astroCard) : '정보 없음',
        lucyMemory || '아직 너에 대해 알아가는 중이야.',
        JSON.stringify(lucyRelationships),
        '없음',
        '없음',
        currentVibe || '평소와 같음',
        profile?.nickname || '친구',
        profile?.realName || form.realName,
        userPreferences || ''
      );

      const chatHistory = msgs[STAGES.FRIEND_CHAT].slice(-10).map(m => `${m.sender}: ${m.text}`).join('\n');
      const response = await callGemini(sysPrompt, `${chatHistory}\nYOU: ${text}`);
      
      if (response) {
        const { messages: parsed, emotion } = parseChat(response, 'Lucy');
        if (emotion) setCurrentEmotion(emotion);
        const aiMsg = parsed[0] || { sender: 'Lucy', text: response };
        
        setMsgs(prev => ({ ...prev, [STAGES.FRIEND_CHAT]: [...(prev[STAGES.FRIEND_CHAT] || []), aiMsg] }));
        
        // Ecosystem Update: Mental State (Stress Relief)
        updateSharedMetric('mentalState', {
          currentMood: "친구 대화 중",
          resonanceScore: 90
        });

        saveActivity({
          type: 'CHAT',
          category: 'FRIEND',
          role: 'assistant',
          text: aiMsg.text,
          sajuData: sajuData,
          astroCard: astroCard
        });

        // Auto-update memory every 3 messages (Non-blocking)
        if (msgs[STAGES.FRIEND_CHAT].length % 3 === 0) {
          (async () => {
            try {
              const updatePrompt = PSYS.lucyUpdate(`${chatHistory}\nYOU: ${text}\nLucy: ${aiMsg.text}`);
              const updateRes = await callGemini(updatePrompt, "위 대화를 바탕으로 메모리와 관계 프로필을 업데이트해줘.");
              if (updateRes) {
                const jsonMatch = updateRes.match(/\{[\s\S]*\}/);
                const memoryData = JSON.parse(jsonMatch ? jsonMatch[0] : updateRes.replace(/```json|```/g, '').trim());
                
                if (memoryData.memorySummary) setLucyMemory(memoryData.memorySummary);
                if (memoryData.relationships) setLucyRelationships(memoryData.relationships);
                if (memoryData.userPreferences) setUserPreferences(memoryData.userPreferences);
                if (memoryData.currentVibe) setCurrentVibe(memoryData.currentVibe);
                
                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, {
                  lucyMemory: memoryData.memorySummary || lucyMemory,
                  lucyRelationships: memoryData.relationships || lucyRelationships,
                  userPreferences: memoryData.userPreferences || userPreferences,
                  currentVibe: memoryData.currentVibe || currentVibe,
                  updatedAt: serverTimestamp()
                }, { merge: true }).catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`));
              }
            } catch (e) {
              console.error("Memory Update Error (Background):", e);
            }
          })();
        }
      }
    } catch (e: any) {
      console.error("Friend Chat Error:", e);
      if (e.message === 'QUOTA_EXCEEDED') {
        setHasQuotaError(true);
        setLimitMsg("현재 서비스 이용량이 많아 잠시 후 다시 시도해주세요. ✨");
        setShowLimitModal(true);
      } else if (e.message === 'TIMEOUT' || e.message === 'STREAM_TIMEOUT') {
        setError("연결 시간이 초과되었습니다. 잠시 후 다시 메시지를 보내주세요.");
      } else {
        setError(e.message || "메시지 전송 중 오류가 발생했습니다.");
      }
    } finally {
      setReplying(false);
      setLoading(null);
    }
  };

  const handleDeepPortalClick = async () => {
    if (loadingHistory || replying) return;
    if (!user) {
      setLimitMsg("상담을 기록하고 이어가기 위해 로그인이 필요합니다.");
      setShowLimitModal(true);
      return;
    }
    setLoadingHistory(true);
    try {
      let data: any = {};
      if (resonance) {
        const sessionKey = isDaily ? 'daily' : 'trinity';
        data[sessionKey] = { resonance: resonance, key: keyData || null };
      }
      setDeepPortalData(data);
      setStage(STAGES.DEEP_PORTAL);
    } catch (e) {
      console.error("Deep Portal Error:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleVisionResult = async (res: any) => {
    setVisionResult(res);
    setIsVisionLoading(false);
    if (!user || !res) return;

    saveActivity({
      type: 'VISION',
      sajuData,
      astroCard,
      visionResult: res,
      concern: visionConcern
    });

    // Ecosystem Update
    updateSharedMetric('productivityMetrics', {
      tasksCompleted: (sharedState?.productivityMetrics?.tasksCompleted || 0) + 1
    });
  };

  const reset = () => {
    setStage(STAGES.LANDING);
    setIsDaily(false);
    setIsSimple(false);
    setIsProcessing(false);
    setLoading(null);
    setMsgs({
      [STAGES.DAILY]: [],
      [STAGES.DEEP_PORTAL]: [],
      [STAGES.SIMPLE_PORTAL]: [],
      [STAGES.LUCY_CHAT]: [],
      [STAGES.FRIEND_CHAT]: []
    });
    setCards([]); setSajuData(''); setResonance(null); setKeyCard(null); setKeyData(null);
    setChatInput(''); setReplying(false);
    setHistory({ DAILY: [], DEEP_PORTAL: [], FRIEND_CHAT: [] });
    setForm({ concern: '', year: '', month: '', day: '', hour: '', gender: '여', city: '서울', realName: '' });
    setVisionResult(null);
    setIsDailyReading(false);
  };

  const startLucyJourney = async () => {
    try {
      setCheckIn(null);
      if (!user) {
        setLimitMsg("로그인이 필요한 기능입니다. ✨");
        setShowLimitModal(true);
        return;
      }

      if (!profile || !profile.year || !profile.month || !profile.day) {
        // If no profile or incomplete profile, open profile modal instead of showing redundant input stage
        setLimitMsg("상담을 시작하기 위해 필요한 기본 정보(생년월일)가 부족해요. 프로필에서 입력해주시겠어요? ✨");
        setShowLimitModal(true);
        setShowProfileModal(true);
        setIsDaily(false);
        return;
      }

      const existingDaily = await checkDailyLimit();
      setIsInsightExpanded(false);
      if (existingDaily) {
        setResonance(existingDaily.resonance);
        setCards(existingDaily.cards || []);
      } else {
        setResonance(null);
      }
      setIsDaily(false);
      startLucy(profile);
    } catch (e: any) {
      console.error("Failed to start Lucy journey:", e);
      setError("포탈 입장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const updateProfile = async (newProfile: any) => {
    if (!user) return;
    console.log("Starting profile update for user:", user.uid);
    setIsUpdatingProfile(true);
    
    // Create a timeout promise to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("프로필 저장 시간이 초과되었습니다.")), 15000)
    );

    try {
      const userRef = doc(db, "users", user.uid);
      
      const profileToSave = {
        nickname: newProfile.nickname || '',
        realName: newProfile.realName || '',
        year: String(newProfile.year || ''),
        month: String(newProfile.month || ''),
        day: String(newProfile.day || ''),
        hour: String(newProfile.hour || ''),
        gender: newProfile.gender || '여',
        city: newProfile.city || '서울'
      };

      console.log("Saving to Firestore:", profileToSave);
      
      // Use Promise.race to ensure we don't wait forever
      await Promise.race([
        setDoc(userRef, { profile: profileToSave }, { merge: true }),
        timeoutPromise
      ]);
      
      console.log("Firestore profile update successful");
      
      // Update all local states immediately
      setProfile(profileToSave);
      setProfileForm(profileToSave);
      setForm(prev => ({ ...prev, ...profileToSave, concern: prev.concern || '' }));
      
      // Update calculations for Saju/Astro
      updateSajuData(profileToSave);
      
      console.log("Profile updated successfully locally.");
      return true;
    } catch (err: any) {
      console.error("Profile update failed in updateProfile:", err);
      setError(err.message === "프로필 저장 시간이 초과되었습니다." 
        ? err.message 
        : "프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      
      if (!err.message.includes("시간이 초과되었습니다")) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
      return false;
    } finally {
      console.log("Setting isUpdatingProfile to false");
      setIsUpdatingProfile(false);
    }
  };

  const updateSajuData = (p: any) => {
    const y = parseInt(p.year), m = parseInt(p.month), d = parseInt(p.day), h = p.hour !== '' ? parseInt(p.hour) : -1;
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      const sd = calcSaju(y, m, d, h, p.gender);
      if (sd) {
        setSajuData(sd);
        const lines = sd.split('\n');
        const pillarLine = lines[0] || '';
        const dayMasterLine = lines[1] || '';
        const elLine = lines[2] || '';
        const daeunLine = lines[3] || '';
        const pillars = pillarLine.replace('[사주] ', '').split(' ');
        
        setSajuCard({
          year: pillars[0]?.replace('년:', '') || '',
          month: pillars[1]?.replace('월:', '') || '',
          day: pillars[2]?.replace('일:', '') || '',
          hour: pillars[3]?.replace('시:', '') || '미입력',
          dayMaster: dayMasterLine.replace('[일간] ', '') || '',
          dominant: elLine.match(/강함:([\S]+)/)?.[1] || '',
          weak: elLine.match(/부족:([\S]+)/)?.[1] || '',
          daeun: daeunLine.replace('[대운] ', '') || '',
        });
      }
      const astro = calcAstro(y, m, d, h, p.city || '서울');
      setAstroCard(parseAstro(astro));
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    } catch (error: any) {
      console.error("Login failed:", error);
    }
  };

  const handleMetaMaskLogin = async (address: string) => {
    // For now, we mock a user object for MetaMask login
    // In a real app, you would verify the signature on the backend
    const mockUser = {
      uid: `eth-${address}`,
      email: `${address.slice(0, 6)}...${address.slice(-4)}@ethereum`,
      displayName: `${address.slice(0, 6)}...${address.slice(-4)}`,
      photoURL: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`
    };
    setUser(mockUser as any);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setStage(STAGES.LANDING);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const startQuickReading = async (activeForm: any) => {
    setMsgs(prev => ({ ...prev, [STAGES.LUCY_CHAT]: [] }));
    setHistory(p => ({ ...p, LUCY_CHAT: [] }));
    setLoading('Lucy');
    setStage(STAGES.LUCY_CHAT);
    setIsSimple(true);
    setQuickInsight(null);
    try {
      const dataToUse = profile || activeForm;
      const y = parseInt(dataToUse.year), m = parseInt(dataToUse.month), d = parseInt(dataToUse.day), h = dataToUse.hour !== '' ? parseInt(dataToUse.hour) : -1;
      const sd = calcSaju(y, m, d, h, dataToUse.gender);
      const astro = calcAstro(y, m, d, h, dataToUse.city || '서울');
      const drawn = await drawCardsSecure(1, []);
      
      setSajuData(sd);
      setCards(drawn);
      setAstroCard(parseAstro(astro));
      fetchExamples(sd, astro);

      const sysPrompt = PSYS.lucyChat(
        sd, 
        astro, 
        lucyMemory, 
        JSON.stringify(lucyRelationships), 
        '없음', 
        '없음', 
        '평소와 같음', 
        profile?.nickname || '친구', 
        profile?.realName || form.realName, 
        userPreferences || ''
      );
      const greeting = await callLuciel(sysPrompt, `카드는 사용자의 상황과 관계없이 서버에서 무작위로 추출되었습니다. 카드: ${drawn[0].kr}. 사용자의 질문: ${activeForm.concern}`);
      const { messages: parsed, emotion } = parseChat(greeting, 'Lucy');
      if (emotion) setCurrentEmotion(emotion);
      
      setMsgs(prev => ({
        ...prev,
        [STAGES.LUCY_CHAT]: parsed
      }));
      setHistory(p => ({ ...p, LUCY_CHAT: [{ role: 'assistant', content: greeting }] }));

      // Generate Quick Insight and Save History
      (async () => {
        try {
          const insightPrompt = PSYS.quickInsight(profile?.nickname, profile?.realName || activeForm.realName, userPreferences);
          const insightRes = await callGemini(insightPrompt, `사주: ${sd}, 별자리: ${astro}, 타로: ${drawn[0].kr}, 고민: ${activeForm.concern}`);
          let insightData = null;
          if (insightRes) {
            const jsonMatch = insightRes.match(/\{[\s\S]*\}/);
            insightData = JSON.parse(jsonMatch ? jsonMatch[0] : insightRes.replace(/```json|```/g, '').trim());
            setQuickInsight(insightData);
          }

          saveActivity({
            type: 'QUICK',
            category: 'CHAT',
            sajuData: sd,
            astroCard: astro,
            cards: drawn,
            text: greeting,
            concern: activeForm.concern,
            quickInsight: insightData
          });
        } catch (e) {
          console.error("Quick Insight Generation Error:", e);
          saveActivity({
            type: 'QUICK',
            category: 'CHAT',
            sajuData: sd,
            astroCard: astro,
            cards: drawn,
            text: greeting,
            concern: activeForm.concern
          });
        }
      })();
    } catch (e: any) {
      console.error('Quick Reading Error:', e);
      if (e.message === 'QUOTA_EXCEEDED') {
        setHasQuotaError(true);
        setLimitMsg("현재 서비스 이용량이 많아 잠시 후 다시 시도해주세요. ✨");
        setShowLimitModal(true);
      } else if (e.message === 'TIMEOUT' || e.message === 'STREAM_TIMEOUT') {
        setError("연결 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError(e.message || "퀵 리딩 생성 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(null);
    }
  };

  const cancelSpeakRef = useRef(false);

  const speak = async (text: string, voice: string = 'Kore', skipStateUpdate: boolean = false) => {
    await initAudio();
    if (cancelSpeakRef.current) return;
    if (!skipStateUpdate) {
      setIsSpeaking(true);
      setIsTtsLoading(true);
    }
    
    // Split long text into smaller chunks (~400 chars) for faster TTS generation and fewer timeouts
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = "";
    for (const s of sentences) {
      if ((currentChunk + s).length > 400) {
        chunks.push(currentChunk);
        currentChunk = s;
      } else {
        currentChunk += s;
      }
    }
    if (currentChunk) chunks.push(currentChunk);
    
    try {
      for (const chunk of chunks) {
        if (cancelSpeakRef.current) break;
        const trimmed = chunk.trim();
        if (!trimmed) continue;

        const base64 = await generateSpeech(trimmed, voice);
        setIsTtsLoading(false); // Done loading first chunk
        if (cancelSpeakRef.current) break;

        if (base64) {
          await new Promise<void>(async (resolve) => {
            const source = await playPCMAudio(base64);
            if (source) {
              source.onended = () => resolve();
            } else {
              resolve();
            }
          });
        }
      }
    } catch (err: any) {
      console.error("Speak Error:", err);
      if (err.message === 'QUOTA_EXCEEDED') {
        setHasQuotaError(true);
        setLimitMsg("현재 서비스 이용량이 많아 음성 서비스를 잠시 이용할 수 없어요. ✨");
        setShowLimitModal(true);
      }
    } finally {
      if (!skipStateUpdate) {
        setIsSpeaking(false);
        setIsTtsLoading(false);
      }
    }
  };

  const speakAll = async (messages: any[]) => {
    await initAudio();
    cancelSpeakRef.current = false;
    setIsSpeaking(true);
    setIsTtsLoading(true);

    try {
      // Helper to get voice name
      const getVoice = (m: any) => (m.sender === 'user' || m.sender === 'YOU' || m.sender === 'User') ? 'Puck' : 'Kore';

      for (let i = 0; i < messages.length; i++) {
        if (cancelSpeakRef.current) break;
        
        const m = messages[i];
        // Split long text into smaller chunks (~400 chars) for faster TTS generation and fewer timeouts
        const sentences = m.text.match(/[^.!?]+[.!?]+|[^.!?]+/g) || [m.text];
        const chunks: string[] = [];
        let currentChunk = "";
        for (const s of sentences) {
          if ((currentChunk + s).length > 400) {
            chunks.push(currentChunk);
            currentChunk = s;
          } else {
            currentChunk += s;
          }
        }
        if (currentChunk) chunks.push(currentChunk);
        
        for (const chunk of chunks) {
          if (cancelSpeakRef.current) break;
          const trimmed = chunk.trim();
          if (!trimmed) continue;

          const base64 = await generateSpeech(trimmed, getVoice(m));
          setIsTtsLoading(false); // Done loading first chunk of first message
          if (cancelSpeakRef.current) break;

          if (base64) {
            await new Promise<void>(async (resolve) => {
              const source = await playPCMAudio(base64);
              if (source) {
                source.onended = () => resolve();
              } else {
                resolve();
              }
            });
          }
        }
        
        // Small pause between messages
        if (i < messages.length - 1) {
          await new Promise(r => setTimeout(r, 500));
        }
      }
    } catch (err: any) {
      console.error("SpeakAll Error:", err);
      if (err.message === 'QUOTA_EXCEEDED') {
        setHasQuotaError(true);
        setLimitMsg("죄송해요, 현재 이용량이 많아 음성 서비스를 잠시 이용할 수 없어요. 1분 정도만 기다려주세요! ✨");
        setShowLimitModal(true);
      }
    } finally {
      setIsSpeaking(false);
      setIsTtsLoading(false);
    }
  };

  const stopSpeak = () => {
    cancelSpeakRef.current = true;
    stopPCMAudio();
    setIsSpeaking(false);
    setIsTtsLoading(false);
  };

  return {
    user, isAuthReady, isAuthorized,
    stage, setStage,
    loading, setLoading,
    isProcessing, setIsProcessing,
    isLuckyUnlocked,
    profile, setProfile,
    lucyMemory, setLucyMemory,
    lucyRelationships, setLucyRelationships,
    userPreferences, setUserPreferences,
    savedHistory, setSavedHistory,
    loadingHistory,
    isDaily, setIsDaily,
    isSimple, setIsSimple,
    isDailyReading, setIsDailyReading,
    msgs, setMsgs,
    history, setHistory,
    updateProfile,
    isUpdatingProfile,
    handleLogin, handleLogout, handleMetaMaskLogin,
    fetchHistory,
    replying, setReplying,
    chatInput, setChatInput,
    chatExamples, setChatExamples,
    visionExamples, setVisionExamples,
    currentEmotion, setCurrentEmotion,
    sharedState, updateSharedMetric,
    isInsightExpanded, setIsInsightExpanded,
    isSpeaking, isTtsLoading, speak, stopSpeak, speakAll,
    visionDeck, setVisionDeck,
    visionConcern, setVisionConcern,
    visionResult, setVisionResult,
    isVisionLoading, setIsVisionLoading,
    checkIn, setCheckIn,
    sajuData, setSajuData,
    astroCard, setAstroCard,
    sajuCard, setSajuCard,
    cards, setCards,
    resonance, setResonance,
    quickInsight, setQuickInsight,
    keyCard, setKeyCard,
    keyData, setKeyData,
    keySeq, setKeySeq,
    deepPortalData, setDeepPortalData,
    showProfileModal, setShowProfileModal,
    showHistoryModal, setShowHistoryModal,
    showInstallGuide, setShowInstallGuide,
    showLimitModal, setShowLimitModal,
    showResumeModal, setShowResumeModal,
    showLucyMemoryModal, setShowLucyMemoryModal,
    showLucyRelationshipsModal, setShowLucyRelationshipsModal,
    error, setError,
    limitMsg, setLimitMsg,
    hasQuotaError,
    form, setForm,
    profileForm, setProfileForm,
    fetchExamples,
    reset,
    startLucy,
    startTrinity,
    startQuickReading,
    sendChatMessage,
    sendFriendMessage,
    handleDeepPortalClick,
    handleVisionResult,
    startLucyJourney,
    resumeSession,
    clearSession,
    checkDailyLimit
  };
}
