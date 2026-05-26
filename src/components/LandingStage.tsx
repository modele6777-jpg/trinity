import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sparkles, Sun, Download, Loader2 } from 'lucide-react';
import { Stars } from './PortalComponents';

interface LandingStageProps {
  onStartJourney: () => void;
  onVisionPortal: () => void;
  onInstallClick: () => void;
  deferredPrompt: any;
  globalHeaderAndModal: React.ReactNode;
  checkIn?: string | null;
  lucyMemory?: string;
  fatigue?: number;
}

export function LandingStage({
  onStartJourney,
  onVisionPortal,
  onInstallClick,
  deferredPrompt,
  globalHeaderAndModal,
  checkIn,
  lucyMemory,
  fatigue = 0
}: LandingStageProps) {
  const base = {
    minHeight: '100vh',
    background: fatigue > 70 
      ? 'radial-gradient(circle at center, #1a1a2e 0%, #0d0818 100%)' 
      : '#0d0818',
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    overflowX: 'hidden' as const,
    position: 'relative' as const,
    transition: 'background 2s ease-in-out'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ ...base, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', paddingTop: '108px' }}
    >
      {globalHeaderAndModal}
      <Stars />
      <div className="relative z-10 text-center w-full max-w-[420px] md:max-w-[1000px] mx-auto">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: '32px', marginBottom: '16px', display: 'flex', justifyContent: 'center', gap: '12px', color: '#c8a96e' }}
        >
          <Moon size={28} /> <Sparkles size={28} /> <Sun size={28} />
        </motion.div>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '.15em', background: 'linear-gradient(135deg,#fff 0%,#c8a96e 50%, #000 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px', fontFamily: 'var(--font-serif)' }}
        >
          LUCY AI
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          style={{ fontSize: '10px', letterSpacing: '.5em', color: 'rgba(200,169,110,.6)', marginBottom: '32px' }}
        >
          INTEGRATED INTELLIGENCE
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
          <div className="w-full md:max-w-[420px]">
            <AnimatePresence mode="wait">
              {checkIn ? (
                <motion.div
                  key="check-in-active"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'rgba(200,169,110,0.08)',
                    border: '1px solid rgba(200,169,110,0.2)',
                    borderRadius: '24px',
                    position: 'relative',
                    textAlign: 'left',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#c8a96e', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.1em' }}>
                    <Sparkles size={14} /> LUCY'S CHECK-IN
                  </div>
                  <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.95)', lineHeight: 1.6, fontWeight: 400 }}>
                    {checkIn}
                  </div>
                  <div style={{ position: 'absolute', top: '-6px', left: '24px', width: '12px', height: '12px', background: 'rgba(200,169,110,0.1)', borderLeft: '1px solid rgba(200,169,110,0.2)', borderTop: '1px solid rgba(200,169,110,0.2)', transform: 'rotate(45deg)', backdropFilter: 'blur(10px)' }} />
                </motion.div>
              ) : (
                <motion.div
                  key="check-in-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px dashed rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                    <Loader2 size={16} className="animate-spin" />
                    <span>오늘의 기운을 연결하는 중...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px', width: '100%' }}
            >
              <motion.div 
                whileHover={{ y: -5, boxShadow: `0 20px 40px rgba(0,0,0,0.4)` }}
                onClick={onStartJourney}
                style={{ 
                  padding: '40px 20px', 
                  border: `1px solid rgba(255,255,255,0.08)`, 
                  borderRadius: '32px', 
                  background: `linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))`, 
                  textAlign: 'center', backdropFilter: 'blur(20px)', cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '20px', color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>✦</div>
                <div style={{ color: '#fff', fontSize: '22px', fontWeight: 600, letterSpacing: '0.15em', fontFamily: 'var(--font-serif)' }}>LUCY</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '8px' }}>Shadow & Light Guide</div>
                <div style={{ marginTop: '24px', padding: '10px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', fontSize: '12px', color: '#c8a96e', fontWeight: 600, border: '1px solid rgba(200,169,110,0.2)' }}>
                  ENTER THE PORTAL →
                </div>
              </motion.div>
            </motion.div>
    
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(200,169,110,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onVisionPortal} 
              style={{ 
                width: '100%', padding: '18px', border: '1px solid rgba(200,169,110,.5)', 
                borderRadius: '16px', background: 'linear-gradient(90deg, rgba(200,169,110,.1), rgba(200,169,110,.2))', 
                color: '#c8a96e', 
                fontSize: '15px', fontWeight: 600, letterSpacing: '.2em', 
                cursor: 'pointer', 
                backdropFilter: 'blur(5px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                marginBottom: '16px'
              }}
            >
              VISION
            </motion.button>

            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.8 }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(200,169,110,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (window as any).setStage('STAT')} 
              style={{ 
                width: '100%', padding: '18px', border: '1px solid rgba(200,169,110,.3)', 
                borderRadius: '16px', background: 'rgba(200,169,110,0.05)', 
                color: '#c8a96e', 
                fontSize: '15px', fontWeight: 600, letterSpacing: '.2em', 
                cursor: 'pointer', 
                backdropFilter: 'blur(5px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                marginBottom: deferredPrompt ? '16px' : '0'
              }}
            >
              LUCY STAT
            </motion.button>
    
            {deferredPrompt && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                onClick={onInstallClick}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '12px', 
                  background: 'rgba(200,169,110,0.1)', 
                  border: '1px dashed rgba(200,169,110,0.4)', 
                  color: '#c8a96e', 
                  fontSize: '13px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Download size={16} />
                LUCY 앱으로 설치하기
              </motion.button>
            )}
          </div>

          <div className="hidden md:flex flex-1 flex-col gap-6 text-left">
            <div style={{ padding: '32px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '11px', color: '#c8a96e', fontWeight: 700, letterSpacing: '0.2em', marginBottom: '16px' }}>CORE FEATURES</div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>사주 & 별자리 통합</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>동양의 명리학과 서양의 점성학을 결합하여 당신의 기질을 입체적으로 분석합니다.</div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>실시간 타로 리딩</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>지금 이 순간의 에너지를 타로 카드로 투영하여 구체적인 행동 지침을 제안합니다.</div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>AI 기억 & 관계</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>루시는 당신과의 대화를 기억하고, 주변 인물들과의 역동을 함께 고민하는 절친입니다.</div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>비전 판독</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>사진 한 장으로 상황의 에너지를 읽어내어 당신만의 특별한 질문을 생성합니다.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
