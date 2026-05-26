import React, { useRef, useState, useEffect } from 'react';
import { CHAR, STAGES } from '../constants';
import { motion } from 'motion/react';
import { Check, Loader2, Volume2 } from 'lucide-react';

export function Stars({ intensity = 1 }: { intensity?: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="light-beam" style={{ opacity: intensity }} />
      {[...Array(30)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: Math.random() * 2 + 1 + 'px',
          height: Math.random() * 2 + 1 + 'px',
          background: 'white',
          borderRadius: '50%',
          opacity: (Math.random() * 0.3 + 0.1) * intensity,
          boxShadow: `0 0 8px rgba(255,255,255,${0.8 * intensity})`,
          animation: `twinkle ${Math.random() * 5 + 5}s infinite`
        }} />
      ))}
    </div>
  );
}

export function CyberGrid() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#030303' }}>
      <div style={{
        position: 'absolute', inset: '-50%',
        backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
        animation: 'gridMove 20s linear infinite'
      }} />
    </div>
  );
}

export function Bubble({ sender, text, i, onSpeak, isSpeaking, isTtsLoading }: any) {
  const isUser = sender === 'user' || sender === 'YOU' || sender === 'User';
  if (isUser) return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}
    >
      <div style={{
        maxWidth: '85%',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px 16px 4px 16px',
        padding: '14px 20px',
        fontSize: '14px',
        lineHeight: 1.6,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'var(--font-sans)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(12px)'
      }}>
        {text.trim()}
      </div>
    </motion.div>
  );

  const c = (sender === 'Trinity' || sender === '트리니티') ? CHAR.TRINITY : CHAR.LUCY;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (i || 0) * 0.1 }}
      style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}
    >
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        border: `1px solid ${c.border}`,
        background: `linear-gradient(135deg, ${c.bg}, rgba(0,0,0,0.4))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        flexShrink: 0,
        boxShadow: `0 4px 12px ${c.glow}`,
        backdropFilter: 'blur(8px)'
      }}>{c.sym}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '10px', color: c.color, letterSpacing: '.2em', fontWeight: 700, fontFamily: 'var(--font-mono)', opacity: 0.6 }}>{c.name.toUpperCase()}</div>
          {onSpeak && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSpeak(text)}
              disabled={isSpeaking}
              style={{ 
                background: 'none', border: 'none', color: isSpeaking ? 'rgba(200,169,110,0.3)' : '#c8a96e', 
                cursor: isSpeaking ? 'default' : 'pointer', padding: '4px' 
              }}
            >
              {isSpeaking ? (isTtsLoading ? <Loader2 size={14} className="animate-spin" /> : <Loader2 size={14} className="animate-pulse" />) : <Volume2 size={14} />}
            </motion.button>
          )}
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${c.bg}, rgba(255,255,255,0.01))`,
          border: `1px solid ${c.border}`,
          borderRadius: '4px 16px 16px 16px',
          padding: '18px 22px',
          fontSize: '15px',
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.95)',
          fontFamily: 'var(--font-sans)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'keep-all',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(16px)',
          position: 'relative'
        }}>
          {text.trim()}
        </div>
      </div>
    </motion.div>
  );
}

export function Spin({ who }: { who: string }) {
  const c = (who === 'TRINITY' || who === 'DAILY') ? CHAR.TRINITY : CHAR.LUCY;
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dInt = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 500);
    return () => clearInterval(dInt);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', gap: '12px', marginBottom: '20px', padding: '0 4px' }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '2px',
        border: `1px solid ${c.border}`,
        background: `linear-gradient(135deg, ${c.bg}, rgba(0,0,0,0.8))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontFamily: 'var(--font-mono)',
        flexShrink: 0,
        boxShadow: `0 0 10px ${c.glow}`,
        backdropFilter: 'blur(4px)'
      }}>{c.sym}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{
          background: `linear-gradient(135deg, ${c.bg}, rgba(0,0,0,0.5))`,
          border: `1px solid ${c.border}`,
          borderLeft: `3px solid ${c.color}`,
          borderRadius: '2px',
          padding: '10px 18px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: c.color,
          fontFamily: 'var(--font-mono)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(8px)',
          minWidth: '60px',
          textAlign: 'center'
        }}>
          {dots || '\u00A0\u00A0\u00A0'}
        </div>
      </div>
    </motion.div>
  );
}

export function Progress({ stage, isDaily, isSimple }: { stage: string; isDaily?: boolean; isSimple?: boolean }) {
  const steps = [
    { s: STAGES.LUCY_CHAT, l: 'SYS.LUCY', sym: '[L]', c: CHAR.LUCY.color },
    { s: STAGES.RESONANCE, l: 'INTEGRATE', sym: '[I]', c: '#ffffff' },
    { s: STAGES.LUCKY, l: 'INSIGHT', sym: '[I]', c: '#ff003c' }
  ];
  const ord = [STAGES.INPUT, STAGES.LUCY_CHAT, STAGES.RESONANCE, STAGES.LUCKY];
  const ci = ord.indexOf(stage);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '16px 0 8px' }}>
      {steps.map((s, i) => {
        const done = ci > i + 1;
        const active = ci === i + 1;
        return (
          <div key={s.s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <motion.div 
                animate={{ 
                  scale: active ? 1.1 : 1,
                  boxShadow: active ? `0 0 12px ${s.c}66` : 'none'
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '2px',
                  border: `1px solid ${active || done ? s.c : 'rgba(255,255,255,.15)'}`,
                  background: active ? `${s.c}22` : done ? `${s.c}11` : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: active || done ? s.c : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {done ? <Check size={12} /> : s.sym}
              </motion.div>
              <span style={{ fontSize: '8px', color: active ? s.c : 'rgba(255,255,255,.3)', letterSpacing: '0.05em', fontWeight: active ? 600 : 400, fontFamily: 'var(--font-mono)' }}>{s.l}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: '16px', height: '1px', background: done ? `${s.c}66` : 'rgba(255,255,255,.1)', marginBottom: '14px', transition: 'background 0.3s ease' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
