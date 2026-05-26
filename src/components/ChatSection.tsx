import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Loader2, MessageCircle, History, User as UserIcon, Volume2 } from 'lucide-react';
import { Bubble, Spin } from './PortalComponents';
import { STAGES } from '../constants';

interface ChatSectionProps {
  stage: string;
  msgs: Record<string, any[]>;
  loading: string | null;
  replying: boolean;
  chatInput: string;
  setChatInput: (v: string) => void;
  onSendMessage: (t: string) => void;
  onSendFriendMessage: (t: string) => void;
  onDeepPortalClick: () => void;
  chatRef: React.RefObject<HTMLDivElement>;
  endRef: React.RefObject<HTMLDivElement>;
  currentEmotion: string | null;
  chatExamples: string[];
  onShowMemory: () => void;
  onShowRelationships: () => void;
  onQuickReading: () => void;
  onDailyReading: () => void;
  onSpeak: (t: string, v?: string) => void;
  onSpeakAll: (msgs: any[]) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
  isTtsLoading: boolean;
  hasQuotaError?: boolean;
}

export function ChatSection({
  stage,
  msgs,
  loading,
  replying,
  chatInput,
  setChatInput,
  onSendMessage,
  onSendFriendMessage,
  onDeepPortalClick,
  chatRef,
  endRef,
  currentEmotion,
  chatExamples,
  onShowMemory,
  onShowRelationships,
  onQuickReading,
  onDailyReading,
  onSpeak,
  onSpeakAll,
  onStopSpeak,
  isSpeaking,
  isTtsLoading,
  hasQuotaError
}: ChatSectionProps) {
  
  const currentMsgs = msgs[stage] || [];

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMsgs, loading]);

  const handleSend = () => {
    if (!chatInput.trim() || replying) return;
    if (stage === STAGES.FRIEND_CHAT) {
      onSendFriendMessage(chatInput);
    } else {
      onSendMessage(chatInput);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Quota Error Banner */}
      <AnimatePresence>
        {hasQuotaError && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
              background: 'rgba(255, 100, 100, 0.9)', color: '#fff', 
              padding: '12px 20px', fontSize: '13px', textAlign: 'center',
              backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,100,100,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <Loader2 size={16} className="animate-spin" />
            <span>AI 서비스 이용량이 많아 잠시 대기 중이에요. 1분 내로 다시 가능해져요! ✨</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div 
        ref={chatRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '100px 20px 20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px', 
          scrollBehavior: 'smooth' 
        }}
      >
        {currentMsgs.map((m, i) => (
          <Bubble key={i} sender={m.sender} text={m.text} i={i} onSpeak={onSpeak} isSpeaking={isSpeaking} isTtsLoading={isTtsLoading} />
        ))}
        
        {loading && <Spin who={loading === 'DAILY' ? 'TRINITY' : 'LUCY'} />}
        <div ref={endRef} />
      </div>

      {/* Chat Input Area */}
      <div style={{ padding: '20px', background: 'linear-gradient(0deg, #0d0818 0%, rgba(13,8,24,0) 100%)', zIndex: 10 }}>
        <div className="w-full max-w-[600px] md:max-w-[900px] mx-auto flex flex-col gap-3">
          
          {/* Quick Actions / Examples */}
          <div 
            className="custom-scrollbar-h"
            style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}
          >
            {stage === STAGES.LUCY_CHAT && (
              <>
                <button onClick={onShowMemory} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: '12px', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', color: '#c8a96e', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <History size={12} /> 기억 보기
                </button>
                <button onClick={onShowRelationships} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: '12px', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', color: '#c8a96e', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <UserIcon size={12} /> 인물 관계
                </button>
                <button onClick={onQuickReading} disabled={hasQuotaError} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: '12px', background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)', color: hasQuotaError ? 'rgba(200,169,110,0.3)' : '#c8a96e', fontSize: '11px', cursor: hasQuotaError ? 'default' : 'pointer', fontWeight: 'bold' }}>
                  QUICK
                </button>
                <button onClick={onDailyReading} disabled={hasQuotaError} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: hasQuotaError ? 'rgba(255,255,255,0.3)' : '#fff', fontSize: '11px', cursor: hasQuotaError ? 'default' : 'pointer', fontWeight: 'bold' }}>
                  DAILY
                </button>
                <button 
                  onClick={() => {
                    if (hasQuotaError) return;
                    if (isSpeaking) {
                      onStopSpeak();
                    } else {
                      onSpeakAll(currentMsgs);
                    }
                  }} 
                  disabled={hasQuotaError}
                  style={{ 
                    flexShrink: 0, padding: '6px 12px', borderRadius: '12px', 
                    background: isSpeaking ? 'rgba(255,100,100,0.15)' : 'rgba(200,169,110,0.15)', 
                    border: `1px solid ${isSpeaking ? 'rgba(255,100,100,0.3)' : 'rgba(200,169,110,0.3)'}`, 
                    color: hasQuotaError ? 'rgba(200,169,110,0.3)' : (isSpeaking ? '#ff6464' : '#c8a96e'), 
                    fontSize: '11px', cursor: hasQuotaError ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px' 
                  }}
                >
                  {isSpeaking ? (isTtsLoading ? <Loader2 size={12} className="animate-spin" /> : <Loader2 size={12} className="animate-pulse" />) : <Volume2 size={12} />} 
                  {isSpeaking ? (isTtsLoading ? '생성 중...' : '듣기 중단') : '전체 듣기'}
                </button>
              </>
            )}
          </div>

          <div 
            className="custom-scrollbar-h"
            style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}
          >
            {chatExamples.map((ex, i) => (
              <motion.button 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(200,169,110,0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => stage === STAGES.FRIEND_CHAT ? onSendFriendMessage(ex) : onSendMessage(ex)}
                style={{ 
                  flexShrink: 0, padding: '10px 18px', borderRadius: '20px', 
                  background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', 
                  color: '#e8d5b0', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' 
                }}
              >
                {ex}
              </motion.button>
            ))}
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <textarea 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={replying ? "루시가 답변을 준비하고 있어요..." : "메시지를 입력하세요..."}
              disabled={replying}
              style={{ 
                width: '100%', minHeight: '54px', maxHeight: '150px', padding: '16px 60px 16px 20px', 
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '20px', color: '#fff', fontSize: '15px', outline: 'none', resize: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!chatInput.trim() || replying}
              style={{ 
                position: 'absolute', right: '8px', width: '40px', height: '40px', 
                borderRadius: '16px', background: chatInput.trim() ? '#c8a96e' : 'rgba(255,255,255,0.05)', 
                border: 'none', color: chatInput.trim() ? '#000' : 'rgba(255,255,255,0.2)', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}
            >
              {replying ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
