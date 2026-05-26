import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Stars } from './PortalComponents';
import { LUCKY_EXAMPLES } from '../constants';

interface InputStageProps {
  onBack: () => void;
  form: any;
  setForm: (f: any) => void;
  profile: any;
  isDaily: boolean;
  isSimple: boolean;
  loading: string | null;
  onStart: () => void;
  globalHeaderAndModal: React.ReactNode;
  fatigue?: number;
}

export function InputStage({
  onBack,
  form,
  setForm,
  profile,
  isDaily,
  isSimple,
  loading,
  onStart,
  globalHeaderAndModal,
  fatigue = 0
}: InputStageProps) {
  const IS = {
    width: '100%',
    boxSizing: 'border-box' as const,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '4px',
    padding: '16px',
    fontSize: '15px',
    color: '#fff',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    transition: 'all 0.3s ease',
  };

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
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      style={{ ...base, padding: '40px 24px 60px', paddingTop: '100px' }}
    >
      {globalHeaderAndModal}
      <Stars />
      <div className="relative z-10 w-full max-w-[440px] md:max-w-[800px] mx-auto">
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: '14px', marginBottom: '24px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> 뒤로
        </button>
        
        <h2 style={{ fontSize: '24px', letterSpacing: '.2em', color: '#fff', textAlign: 'center', marginBottom: '48px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>
          Shadow & Light Input
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div className="flex flex-col">
            {(!isDaily && !isSimple) && (
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', letterSpacing: '.1em', fontWeight: 700 }}>REAL NAME (FOR SAJU)</label>
                <input type="text" value={form.realName} onChange={e => setForm((p: any) => ({ ...p, realName: e.target.value }))} placeholder="Enter your name" style={{ ...IS, padding: '16px', borderRadius: '12px' }} />
              </div>
            )}
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', letterSpacing: '.1em', fontWeight: 700 }}>WHAT IS ON YOUR MIND?</label>
              <textarea value={form.concern} onChange={e => setForm((p: any) => ({ ...p, concern: e.target.value }))} placeholder={isDaily ? "오늘 하루의 기운을 확인해보세요." : "Speak your truth..."} rows={4} style={{ ...IS, resize: 'none', fontSize: '15px', lineHeight: 1.8, padding: '16px', borderRadius: '12px' }} />
            </div>
    
            {(!isDaily && !isSimple) && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(200,169,110,0.5)', marginBottom: '10px', marginLeft: '4px' }}>추천 상담 주제</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {LUCKY_EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setForm((p: any) => ({ ...p, concern: ex }))}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(200,169,110,0.2)',
                        borderRadius: '20px',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {(!isDaily && !isSimple && !profile) && (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(200,169,110,.8)', marginBottom: '10px', letterSpacing: '.05em' }}>생년월일시</label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="number" placeholder="년(예:1990)" value={form.year} onChange={e => setForm((p: any) => ({ ...p, year: e.target.value }))} style={{ ...IS, width: '40%', textAlign: 'center' }} />
                    <input type="number" placeholder="월" value={form.month} onChange={e => setForm((p: any) => ({ ...p, month: e.target.value }))} style={{ ...IS, width: '30%', textAlign: 'center' }} />
                    <input type="number" placeholder="일" value={form.day} onChange={e => setForm((p: any) => ({ ...p, day: e.target.value }))} style={{ ...IS, width: '30%', textAlign: 'center' }} />
                  </div>
                  <input type="number" placeholder="태어난 시간 (0~23, 모르면 비워두세요)" value={form.hour} onChange={e => setForm((p: any) => ({ ...p, hour: e.target.value }))} style={{ ...IS, textAlign: 'center' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  {['여', '남'].map(g => (
                    <button 
                      key={g} 
                      onClick={() => setForm((p: any) => ({ ...p, gender: g }))} 
                      style={{ 
                        flex: 1, padding: '12px', 
                        border: `1px solid ${form.gender === g ? 'rgba(200,169,110,.6)' : 'rgba(255,255,255,.15)'}`, 
                        borderRadius: '12px', 
                        background: form.gender === g ? 'rgba(200,169,110,.15)' : 'rgba(255,255,255,0.02)', 
                        color: form.gender === g ? '#e8d5b0' : 'rgba(255,255,255,.4)', 
                        cursor: 'pointer', fontSize: '14px', fontWeight: form.gender === g ? 600 : 400
                      }}
                    >
                      {g}성
                    </button>
                  ))}
                </div>
                
                <div style={{ marginBottom: '40px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(122,174,212,.8)', marginBottom: '10px', letterSpacing: '.05em' }}>출생 도시 (별자리 계산용)</label>
                  <input type="text" placeholder="서울, 부산, 도쿄, 뉴욕..." value={form.city} onChange={e => setForm((p: any) => ({ ...p, city: e.target.value }))} style={{ ...IS, border: '1px solid rgba(122,174,212,.3)' }} />
                </div>
              </>
            )}
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(200,169,110,0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart} 
          disabled={!!loading || !form.concern || (!profile && (!form.year || !form.month || !form.day))}
          style={{ 
            width: '100%', padding: '18px', 
            border: `1px solid ${form.concern && (profile || form.year) ? 'rgba(200,169,110,.5)' : 'rgba(255,255,255,.1)'}`, 
            borderRadius: '16px', 
            background: form.concern && (profile || form.year) ? 'linear-gradient(90deg, rgba(200,169,110,.15), rgba(200,169,110,.25))' : 'rgba(255,255,255,.03)', 
            color: form.concern && (profile || form.year) ? '#e8d5b0' : 'rgba(255,255,255,.3)', 
            fontSize: '15px', fontWeight: 600, letterSpacing: '.15em', 
            cursor: form.concern && (profile || form.year) ? 'pointer' : 'not-allowed'
          }}
        >
          {isDaily ? 'DAILY CHECK ✦' : isSimple ? 'QUICK INSIGHT ⛧' : 'DEEP CHAT ✨'}
        </motion.button>
      </div>
    </motion.div>
  );
}
