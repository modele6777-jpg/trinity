import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Stars } from './PortalComponents';

interface PasswordGateProps {
  onUnlock: () => void;
}

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [input, setInput] = React.useState('');
  const [error, setError] = React.useState(false);
  const correctPassword = '1202';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === correctPassword) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setInput('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0818', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <Stars />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '40px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '32px',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          zIndex: 10
        }}
      >
        <motion.div
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: error ? 'rgba(255,100,100,0.1)' : 'rgba(200,169,110,0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 24px', border: `1px solid ${error ? 'rgba(255,100,100,0.3)' : 'rgba(200,169,110,0.3)'}`,
            color: error ? '#ff6464' : '#c8a96e'
          }}>
            {error ? <Lock size={32} /> : <ShieldCheck size={32} />}
          </div>

          <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.05em' }}>
            보안 액세스
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
            계속하려면 비밀번호를 입력하세요.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="비밀번호 입력"
                autoFocus
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${error ? '#ff6464' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '18px',
                  textAlign: 'center',
                  letterSpacing: '0.5em',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                width: '100%',
                padding: '18px',
                background: 'linear-gradient(135deg, #c8a96e, #8e734b)',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 20px rgba(200,169,110,0.2)'
              }}
            >
              입장하기 <ArrowRight size={20} />
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      <div style={{ position: 'absolute', bottom: '40px', color: 'rgba(255,255,255,0.2)', fontSize: '12px', letterSpacing: '0.1em' }}>
        LUCY INTEGRATED INTELLIGENCE SYSTEM
      </div>
    </div>
  );
}
