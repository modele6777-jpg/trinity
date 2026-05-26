import React from 'react';
import { STAGES } from "./constants";
import { Stars, Progress } from "./components/PortalComponents";
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Sparkles, Moon, Sun, Loader2, ChevronDown, ChevronUp, Volume2
} from 'lucide-react';

import { VisionPortal } from './components/VisionPortal';
import { AuthScreen } from './components/AuthScreen';
import { GlobalUI } from './components/GlobalUI';
import { LandingStage } from './components/LandingStage';
import { InputStage } from './components/InputStage';
import { ChatSection } from './components/ChatSection';
import { PasswordGate } from './components/PasswordGate';
import { InsightCharts } from './components/InsightCharts';
import { useLucy } from './hooks/useLucy';

const base = {
  minHeight: '100vh',
  background: '#0d0818',
  color: '#fff',
  fontFamily: 'var(--font-sans)',
  overflowX: 'hidden' as const,
  position: 'relative' as const,
};

export default function App() {
  const {
    user, isAuthReady,
    stage, setStage,
    loading,
    profile, setProfile,
    lucyMemory,
    lucyRelationships,
    userPreferences,
    savedHistory,
    loadingHistory,
    isDaily, setIsDaily,
    isSimple, setIsSimple,
    isDailyReading,
    isUpdatingProfile,
    msgs,
    handleLogin, handleLogout, handleMetaMaskLogin,
    replying,
    chatInput, setChatInput,
    chatExamples,
    visionExamples,
    currentEmotion,
    isInsightExpanded, setIsInsightExpanded,
    isSpeaking, isTtsLoading, speak, stopSpeak, speakAll,
    visionDeck, setVisionDeck,
    visionConcern, setVisionConcern,
    setVisionResult,
    setIsVisionLoading,
    checkIn,
    sajuData,
    sajuCard,
    astroCard,
    resonance,
    quickInsight,
    showProfileModal, setShowProfileModal,
    showHistoryModal, setShowHistoryModal,
    showInstallGuide, setShowInstallGuide,
    showLimitModal, setShowLimitModal,
    showResumeModal,
    showLucyMemoryModal, setShowLucyMemoryModal,
    showLucyRelationshipsModal, setShowLucyRelationshipsModal,
    error, setError,
    limitMsg, setLimitMsg,
    hasQuotaError,
    sharedState,
    form, setForm,
    profileForm, setProfileForm,
    fetchExamples,
    startLucy,
    startTrinity,
    sendChatMessage,
    sendFriendMessage,
    handleDeepPortalClick,
    handleVisionResult,
    startLucyJourney,
    resumeSession,
    clearSession,
    checkDailyLimit,
    startQuickReading,
    fetchHistory,
    updateProfile,
    reset
  } = useLucy();

  const fatigue = sharedState?.healthMetrics?.fatigue || 0;
  
  const ecosystemStyle = React.useMemo(() => ({
    ...base,
    background: fatigue > 70 
      ? 'radial-gradient(circle at center, #1a1a2e 0%, #0d0818 100%)' 
      : '#0d0818',
    transition: 'background 2s ease-in-out'
  }), [fatigue]);

  React.useEffect(() => {
    (window as any).setStage = setStage;
  }, [setStage]);

  const [isUnlocked, setIsUnlocked] = React.useState(() => {
    return sessionStorage.getItem('isUnlocked') === 'true';
  });

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('isUnlocked', 'true');
  };

  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isSamsung, setIsSamsung] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);

  React.useEffect(() => {
    const ua = navigator.userAgent;
    setIsSamsung(/SamsungBrowser/i.test(ua));
    setIsIOS(/iPhone|iPad|iPod/i.test(ua));
    
    const isActuallyStandalone = (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone);
    setIsStandalone(isActuallyStandalone && window.self === window.top);
    
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  const chatRef = React.useRef<HTMLDivElement>(null);
  const endRef = React.useRef<HTMLDivElement>(null);

  const globalUI = (
    <GlobalUI 
      user={user}
      profile={profile}
      onLogout={handleLogout}
      onShowProfile={() => setShowProfileModal(true)}
      onShowHistory={() => {
        fetchHistory();
        setShowHistoryModal(true);
      }}
      onInstall={handleInstallClick}
      onHome={reset}
      isStandalone={isStandalone}
      showInstallGuide={showInstallGuide}
      setShowInstallGuide={setShowInstallGuide}
      isSamsung={isSamsung}
      isIOS={isIOS}
      showProfileModal={showProfileModal}
      setShowProfileModal={setShowProfileModal}
      profileForm={profileForm}
      setProfileForm={setProfileForm}
      setProfile={updateProfile}
      sajuCard={sajuCard}
      astroCard={astroCard}
      isUpdatingProfile={isUpdatingProfile}
      showHistoryModal={showHistoryModal}
      setShowHistoryModal={setShowHistoryModal}
      savedHistory={savedHistory}
      loadingHistory={loadingHistory}
      showResumeModal={showResumeModal}
      resumeSession={resumeSession}
      clearSession={clearSession}
      showLimitModal={showLimitModal}
      setShowLimitModal={setShowLimitModal}
      limitMsg={limitMsg}
      showLucyMemoryModal={showLucyMemoryModal}
      setShowLucyMemoryModal={setShowLucyMemoryModal}
      lucyMemory={lucyMemory}
      showLucyRelationshipsModal={showLucyRelationshipsModal}
      setShowLucyRelationshipsModal={setShowLucyRelationshipsModal}
      lucyRelationships={lucyRelationships}
      error={error}
      setError={setError}
    />
  );

  const quotaBanner = hasQuotaError && (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{ 
        position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', 
        zIndex: 1000, background: 'rgba(200, 169, 110, 0.15)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(200, 169, 110, 0.3)', borderRadius: '12px', padding: '8px 16px',
        display: 'flex', alignItems: 'center', gap: '8px', color: '#c8a96e', fontSize: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)', pointerEvents: 'none', width: 'max-content'
      }}
    >
      <Sparkles size={14} />
      <span>현재 루시가 많은 대화를 나누고 있어 조금 느릴 수 있어요. ✨</span>
    </motion.div>
  );

  if (!isUnlocked) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  if (!isAuthReady) {
    return (
      <div style={{ ...ecosystemStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="#c8a96e" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} onMetaMaskLogin={handleMetaMaskLogin} />;
  }

  if (stage === STAGES.VISION_PORTAL) {
    return (
      <VisionPortal 
        onBack={reset}
        onResult={handleVisionResult}
        deckId={visionDeck}
        onDeckChange={setVisionDeck}
        concern={visionConcern}
        lucyMemory={lucyMemory}
        sajuData={sajuData}
        astroData={astroCard ? JSON.stringify(astroCard) : ''}
        examples={visionExamples}
        userPreferences={userPreferences}
        hasQuotaError={hasQuotaError}
      />
    );
  }

  if (stage === STAGES.STAT) {
    return (
      <div style={{ ...ecosystemStyle, display: 'flex', flexDirection: 'column', paddingTop: '80px', paddingBottom: '40px' }}>
        {globalUI}
        {quotaBanner}
        <Stars intensity={fatigue > 70 ? 0.3 : 1} />
        <div className="relative z-10 w-full max-w-[600px] mx-auto px-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <motion.button 
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={reset} 
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px', color: '#c8a96e', cursor: 'pointer' }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#c8a96e', letterSpacing: '0.1em', fontFamily: 'var(--font-serif)' }}>LUCY STAT</h2>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>당신의 운명적 데이터 분석</p>
            </div>
          </div>
          <InsightCharts history={savedHistory} />
        </div>
      </div>
    );
  }

  if (stage === STAGES.LANDING) {
    return (
      <>
        {quotaBanner}
        <LandingStage 
        onStartJourney={startLucyJourney}
        checkIn={checkIn}
        onVisionPortal={() => {
          setStage(STAGES.VISION_PORTAL);
          setVisionResult(null);
          setVisionConcern('');
          // Always try to fetch fresh examples when entering Vision Portal
          fetchExamples(sajuData || '', astroCard || '', lucyMemory, JSON.stringify(lucyRelationships), true);
        }}
        onInstallClick={handleInstallClick}
        deferredPrompt={deferredPrompt}
        globalHeaderAndModal={globalUI}
        lucyMemory={lucyMemory}
        fatigue={fatigue}
      />
      </>
    );
  }

  if (stage === STAGES.INPUT) {
    return (
      <>
        {quotaBanner}
        <InputStage 
        onBack={reset}
        form={form}
        setForm={setForm}
        profile={profile}
        isDaily={isDaily}
        isSimple={isSimple}
        loading={loading}
        onStart={async () => {
          if (isDaily) {
            const existingDaily = await checkDailyLimit();
            if (existingDaily) {
              setLimitMsg("오늘의 데일리 리딩을 이미 완료하셨습니다.\n내일 다시 찾아와주세요. ✨");
              setShowLimitModal(true);
              return;
            }
          }
          
          if (isSimple) {
            startQuickReading(form);
          } else {
            await startLucy();
          }
        }}
        globalHeaderAndModal={globalUI}
        fatigue={fatigue}
      />
      </>
    );
  }

  return (
    <div style={{ ...ecosystemStyle, display: 'flex', flexDirection: 'column', paddingTop: '60px' }}>
      {globalUI}
      {quotaBanner}

      <Stars intensity={fatigue > 70 ? 0.3 : 1} />
      <div className="relative z-10 w-full max-w-[500px] md:max-w-[1200px] mx-auto px-4 flex flex-col min-h-[calc(100vh-60px)] pb-[env(safe-area-inset-bottom)]">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {stage !== STAGES.LANDING && (
              <motion.button 
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={reset} 
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                <ArrowLeft size={18} />
              </motion.button>
            )}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '14px', letterSpacing: '.15em', color: '#c8a96e', fontWeight: 600 }}>{stage === STAGES.FRIEND_CHAT ? 'LUCY BEST FRIEND' : stage === STAGES.DEEP_PORTAL ? 'DEEP LUCKY' : 'LUCY'}</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,.25)', marginTop: '1px' }}>{stage === STAGES.FRIEND_CHAT ? '당신의 AI 절친' : stage === STAGES.DEEP_PORTAL ? '딥 루시' : form.concern.slice(0, 20)}</div>
            </div>
          </div>
        </div>
        
        {![STAGES.DEEP_PORTAL, STAGES.FRIEND_CHAT, STAGES.DAILY, STAGES.SIMPLE_PORTAL, STAGES.LUCY_CHAT, STAGES.INPUT, STAGES.LANDING, STAGES.VISION_PORTAL].includes(stage) && <Progress stage={stage} isDaily={isDaily} isSimple={isSimple} />}
        
        <div className="flex flex-col md:flex-row gap-0 md:gap-8 flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {(stage === STAGES.LUCY_CHAT || stage === STAGES.FRIEND_CHAT) && (resonance || quickInsight || isDailyReading) && (
              <div className="md:hidden mb-5">
                <div 
                  onClick={() => setIsInsightExpanded(!isInsightExpanded)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', cursor: 'pointer' }}
                >
                  <div style={{ flex: 1, height: '1px', background: 'rgba(200,169,110,0.2)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#c8a96e', letterSpacing: '.2em', fontWeight: 'bold' }}>{quickInsight ? 'QUICK INSIGHT' : 'DAILY INSIGHT'}</span>
                    {isInsightExpanded ? <ChevronUp size={14} color="#c8a96e" /> : <ChevronDown size={14} color="#c8a96e" />}
                  </div>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(200,169,110,0.2)' }} />
                </div>
                
                <AnimatePresence>
                  {isInsightExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(200,169,110,0.3)', background: 'linear-gradient(180deg, rgba(200,169,110,0.12), rgba(18,13,29,0))', marginBottom: '16px' }}>
                        {(resonance || quickInsight) ? (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                              <div style={{ fontSize: '11px', color: 'rgba(200,169,110,0.6)', letterSpacing: '0.1em', fontWeight: 'bold' }}>{quickInsight ? '루시의 퀵 리딩' : '오늘의 우주 날씨'}</div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  const data = quickInsight || resonance;
                                  speak(`${data.diagnosis}. 마음의 소리: ${data.coreProblem}. 루시의 추천: ${data.decision?.selected}, ${data.decision?.reason}`);
                                }}
                                disabled={isSpeaking}
                                style={{ background: 'none', border: 'none', color: isSpeaking ? 'rgba(200,169,110,0.3)' : '#c8a96e', cursor: isSpeaking ? 'default' : 'pointer' }}
                              >
                                {isSpeaking ? (isTtsLoading ? <Loader2 size={16} className="animate-spin" /> : <Loader2 size={16} className="animate-pulse" />) : <Volume2 size={16} />}
                              </motion.button>
                            </div>
                            <div style={{ fontSize: '16px', color: '#fff', lineHeight: 1.7, marginBottom: '16px', fontWeight: 500 }}>{(quickInsight || resonance).diagnosis}</div>
                            
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(200,169,110,0.15)', marginBottom: '20px' }}>
                              <div style={{ fontSize: '11px', color: '#c8a96e', fontWeight: 600, marginBottom: '6px' }}>핵심 통찰</div>
                              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{(quickInsight || resonance).coreProblem}</div>
                            </div>
    
                            {(quickInsight?.keyInsight || resonance?.keyInsight) && (
                              <div style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.05)', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                  <div style={{ fontSize: '11px', color: 'rgba(255,215,0,0.6)', letterSpacing: '0.1em', fontWeight: 'bold' }}>행운의 열쇠</div>
                                  <div style={{ fontSize: '14px' }}>🗝️</div>
                                </div>
                                <div style={{ fontSize: '15px', color: '#ffd700', fontWeight: 'bold', marginBottom: '8px', lineHeight: 1.5 }}>{(quickInsight?.keyInsight || resonance?.keyInsight).message}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {((quickInsight?.keyInsight || resonance?.keyInsight).immediateActions || [(quickInsight?.keyInsight || resonance?.keyInsight).immediateAction]).map((action: any, idx: number) => (
                                    <div key={idx} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, display: 'flex', gap: '8px' }}>
                                      <span style={{ color: '#ffd700' }}>•</span>
                                      <span>{typeof action === 'string' ? action : (action?.name || action?.message || '새로운 시작을 위한 준비를 하세요.')}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
    
                            <div style={{ borderTop: '1px solid rgba(200,169,110,0.1)', paddingTop: '16px' }}>
                              <div style={{ fontSize: '11px', color: '#c8a96e', fontWeight: 600, marginBottom: '8px' }}>루시의 추천</div>
                              <div style={{ fontSize: '15px', color: '#fff', fontWeight: 'bold', marginBottom: '6px' }}>{(quickInsight || resonance).decision?.selected}</div>
                              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{(quickInsight || resonance).decision?.reason}</div>
                            </div>
                          </>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px 0' }}>
                            <Loader2 className="animate-spin" size={24} color="#c8a96e" />
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>분석 결과를 생성하고 있습니다...</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
    
            <ChatSection 
              stage={stage}
              msgs={msgs}
              loading={loading}
              replying={replying}
              chatInput={chatInput}
              setChatInput={setChatInput}
              onSendMessage={sendChatMessage}
              onSendFriendMessage={sendFriendMessage}
              onDeepPortalClick={handleDeepPortalClick}
              chatRef={chatRef}
              endRef={endRef}
              currentEmotion={currentEmotion}
              chatExamples={chatExamples}
              onShowMemory={() => setShowLucyMemoryModal(true)}
              onShowRelationships={() => setShowLucyRelationshipsModal(true)}
              onSpeak={speak}
              onSpeakAll={speakAll}
              onStopSpeak={stopSpeak}
              isSpeaking={isSpeaking}
              isTtsLoading={isTtsLoading}
              hasQuotaError={hasQuotaError}
              onQuickReading={() => {
                const concernToUse = chatInput.trim() || '빠른 운세';
                setIsDaily(false);
                setIsSimple(true);
                const newForm = { ...form, concern: concernToUse };
                setForm(newForm);
                startQuickReading(newForm);
                setChatInput('');
              }}
              onDailyReading={async () => {
                if (!user) {
                  setLimitMsg("로그인이 필요한 기능입니다. ✨");
                  setShowLimitModal(true);
                  return;
                }
                const existingDaily = await checkDailyLimit();
                if (existingDaily) {
                  setLimitMsg("오늘의 데일리 리딩을 이미 완료하셨습니다.\n내일 다시 찾아와주세요. ✨");
                  setShowLimitModal(true);
                  return;
                }
                const concernToUse = chatInput.trim() || '오늘의 운세';
                setIsDaily(true);
                setIsSimple(false);
                const newForm = { ...form, concern: concernToUse };
                setForm(newForm);
                startTrinity(newForm);
                setChatInput('');
              }}
            />
          </div>

          {/* Desktop Sidebar */}
          {(stage === STAGES.LUCY_CHAT || stage === STAGES.FRIEND_CHAT) && (
            <div className="hidden md:flex w-[380px] flex-col gap-6 overflow-y-auto pb-8 pr-2 custom-scrollbar">
              {(resonance || quickInsight) ? (
                <div style={{ padding: '28px', borderRadius: '24px', border: '1px solid rgba(200,169,110,0.3)', background: 'linear-gradient(180deg, rgba(200,169,110,0.12), rgba(18,13,29,0.3))' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ fontSize: '12px', color: '#c8a96e', letterSpacing: '0.15em', fontWeight: 'bold' }}>{quickInsight ? 'QUICK INSIGHT' : 'DAILY INSIGHT'}</div>
                    <motion.button
                      whileHover={{ scale: hasQuotaError ? 1 : 1.1 }}
                      whileTap={{ scale: hasQuotaError ? 1 : 0.9 }}
                      onClick={() => {
                        if (hasQuotaError) return;
                        const data = quickInsight || resonance;
                        speak(`${data.diagnosis}. 마음의 소리: ${data.coreProblem}. 루시의 추천: ${data.decision?.selected}, ${data.decision?.reason}`);
                      }}
                      disabled={isSpeaking || hasQuotaError}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: (isSpeaking || hasQuotaError) ? 'rgba(200,169,110,0.3)' : '#c8a96e', 
                        cursor: (isSpeaking || hasQuotaError) ? 'default' : 'pointer' 
                      }}
                    >
                      {isTtsLoading ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
                    </motion.button>
                  </div>
                  
                  <div style={{ fontSize: '18px', color: '#fff', lineHeight: 1.7, marginBottom: '20px', fontWeight: 500, fontFamily: 'var(--font-serif)' }}>{(quickInsight || resonance).diagnosis}</div>
                  
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(200,169,110,0.15)', marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', color: '#c8a96e', fontWeight: 600, marginBottom: '8px', opacity: 0.8 }}>핵심 통찰</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{(quickInsight || resonance).coreProblem}</div>
                  </div>

                  {(quickInsight?.keyInsight || resonance?.keyInsight) && (
                    <div style={{ padding: '22px', borderRadius: '20px', border: '1px solid rgba(255,215,0,0.25)', background: 'rgba(255,215,0,0.03)', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,215,0,0.7)', letterSpacing: '0.1em', fontWeight: 'bold' }}>행운의 열쇠</div>
                        <div style={{ fontSize: '16px' }}>🗝️</div>
                      </div>
                      <div style={{ fontSize: '16px', color: '#ffd700', fontWeight: 'bold', marginBottom: '12px', lineHeight: 1.5 }}>{(quickInsight?.keyInsight || resonance?.keyInsight).message}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {((quickInsight?.keyInsight || resonance?.keyInsight).immediateActions || [(quickInsight?.keyInsight || resonance?.keyInsight).immediateAction]).map((action: any, idx: number) => (
                          <div key={idx} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, display: 'flex', gap: '10px' }}>
                            <span style={{ color: '#ffd700', marginTop: '2px' }}>✦</span>
                            <span>{typeof action === 'string' ? action : (action?.name || action?.message || '새로운 통찰을 받아들이세요.')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid rgba(200,169,110,0.15)', paddingTop: '20px' }}>
                    <div style={{ fontSize: '11px', color: '#c8a96e', fontWeight: 600, marginBottom: '10px', opacity: 0.8 }}>루시의 추천</div>
                    <div style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>{(quickInsight || resonance).decision?.selected}</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{(quickInsight || resonance).decision?.reason}</div>
                  </div>
                </div>
              ) : isDailyReading ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', borderRadius: '24px', border: '1px dashed rgba(200,169,110,0.2)', background: 'rgba(200,169,110,0.05)' }}>
                  <Loader2 className="animate-spin" size={32} color="#c8a96e" style={{ margin: '0 auto 16px' }} />
                  <div style={{ fontSize: '14px', color: '#c8a96e', fontWeight: 500 }}>오늘의 운세를 분석하고 있습니다...</div>
                </div>
              ) : (
                <div style={{ padding: '40px 20px', textAlign: 'center', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                   <Sparkles size={24} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 16px' }} />
                   <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>데일리 리딩을 시작하면<br/>이곳에서 상세 분석을 볼 수 있어.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
