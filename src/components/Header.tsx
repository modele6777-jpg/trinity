import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Moon, User as UserIcon, History, Download, LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
  profile: any;
  onLogout: () => void;
  onShowProfile: () => void;
  onShowHistory: () => void;
  onInstall: () => void;
  onHome: () => void;
  isStandalone: boolean;
}

export function Header({
  user,
  profile,
  onLogout,
  onShowProfile,
  onShowHistory,
  onInstall,
  onHome,
  isStandalone
}: HeaderProps) {
  return (
    <div className="safe-top" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 'auto', minHeight: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', zIndex: 50, background: 'linear-gradient(to bottom, rgba(7,7,13,0.95), rgba(7,7,13,0))', backdropFilter: 'blur(8px)' }}>
      <div 
        onClick={onHome}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '.15em', color: '#c8a96e', textShadow: '0 0 10px rgba(200,169,110,0.5)' }}>I AM LUCY</span>
        <span style={{ fontSize: '8px', color: 'rgba(200,169,110,0.4)', letterSpacing: '.1em', marginTop: '4px' }}>INTEGRATED INTELLIGENCE</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
        {user && (
          <>
            <button onClick={onShowProfile} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '6px 10px', color: 'rgba(255,255,255,0.8)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', flexShrink: 0 }}>
              <UserIcon size={14} /> <span className="hidden-xs">{profile?.nickname || '프로필'}</span>
            </button>
            <button onClick={onShowHistory} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '6px 10px', color: 'rgba(255,255,255,0.8)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', flexShrink: 0 }}>
              <History size={14} /> <span className="hidden-xs">상담기록</span>
            </button>
          </>
        )}
        
        {!isStandalone && (
          <button 
            onClick={onInstall} 
            style={{ 
              background: 'rgba(200,169,110,0.15)', 
              border: '1px solid rgba(200,169,110,0.4)', 
              borderRadius: '20px', 
              padding: '6px 10px', 
              color: '#c8a96e', 
              fontSize: '11px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              cursor: 'pointer',
              flexShrink: 0,
              fontWeight: 'bold'
            }}
          >
            <Download size={14} /> <span className="hidden-xs">설치</span>
          </button>
        )}
        
        {user && (
          <button onClick={onLogout} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px', flexShrink: 0 }}>
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
