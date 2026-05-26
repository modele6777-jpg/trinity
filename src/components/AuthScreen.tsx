import React from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Loader2, Wallet } from 'lucide-react';
import { Stars } from './PortalComponents';
import { connectMetaMask } from '../utils/web3';

interface AuthScreenProps {
  onLogin: () => void;
  onMetaMaskLogin: (address: string) => void;
}

export function AuthScreen({ onLogin, onMetaMaskLogin }: AuthScreenProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleMetaMask = async () => {
    setLoading(true);
    setError(null);
    try {
      const address = await connectMetaMask();
      onMetaMaskLogin(address);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0818', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <Stars />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          maxWidth: '400px', width: '100%', padding: '40px', 
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', 
          borderRadius: '24px', textAlign: 'center', backdropFilter: 'blur(20px)' 
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔮</div>
        <h1 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>
          운명의 문을 여세요
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px', lineHeight: 1.6 }}>
          세 존재와 대화하기 위해 로그인이 필요합니다.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin}
            style={{ 
              width: '100%', padding: '16px', borderRadius: '12px', 
              background: 'linear-gradient(135deg, #c8a96e, #8e734b)', 
              color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            <UserIcon size={20} />
            Google로 시작하기
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMetaMask}
            disabled={loading}
            style={{ 
              width: '100%', padding: '16px', borderRadius: '12px', 
              background: 'rgba(255,255,255,0.05)', 
              color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: loading ? 'default' : 'pointer', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Wallet size={20} />}
            MetaMask로 시작하기
          </motion.button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '16px', color: '#ff6464', fontSize: '12px' }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
