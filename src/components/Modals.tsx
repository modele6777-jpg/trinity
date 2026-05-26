import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, User as UserIcon, History, Sparkles, X, Loader2, BarChart2 } from 'lucide-react';
import { InsightCharts } from './InsightCharts';

const IS = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', color: '#fff', fontSize: '14px', outline: 'none' };

export function InstallGuideModal({ isOpen, onClose, isStandalone, isSamsung, isIOS }: any) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '360px', 
              background: 'linear-gradient(180deg, #1a1625 0%, #0d0818 100%)', 
              border: '1px solid rgba(200,169,110,0.3)', 
              borderRadius: '24px', 
              padding: '32px', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              textAlign: 'center'
            }}
          >
            <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'rgba(200,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(200,169,110,0.2)' }}>
              <Download size={28} color="#c8a96e" />
            </div>
            <h3 style={{ fontSize: '20px', color: '#c8a96e', marginBottom: '12px', fontWeight: 600, letterSpacing: '-0.02em' }}>앱 설치 안내</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '28px', wordBreak: 'keep-all' }}>
              {window.self !== window.top ? (
                <>
                  현재 미리보기 모드에서는 설치가 제한될 수 있습니다. <br/>
                  우측 상단의 <b>'새 탭에서 열기'</b> 아이콘을 눌러 전체 화면으로 이동한 후 설치해 주세요.
                </>
              ) : isSamsung ? (
                <>
                  삼성 인터넷 브라우저 상단의 <b>'설치(↓)'</b> 아이콘을 누르거나, 하단 메뉴(≡)에서 <b>'앱 추가'</b>를 선택하여 홈 화면에 설치할 수 있습니다.
                </>
              ) : isIOS ? (
                <>
                  Safari 브라우저 하단의 <b>'공유(↑)'</b> 버튼을 누른 후, 메뉴에서 <b>'홈 화면에 추가'</b>를 선택해 주세요.
                </>
              ) : isMobile ? (
                <>
                  브라우저 설정 메뉴(⋮)에서 <b>'홈 화면에 추가'</b> 또는 <b>'앱 설치'</b>를 선택하여 I AM을 앱처럼 편리하게 사용해 보세요.
                </>
              ) : (
                <>
                  Chrome 또는 Edge 브라우저 주소창 우측의 <b>'설치(⊕)'</b> 아이콘을 누르거나, 설정 메뉴에서 <b>'I AM 설치'</b>를 선택해 주세요.
                </>
              )}
            </p>
            <button 
              onClick={onClose}
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: 'linear-gradient(135deg, #c8a96e 0%, #a68a56 100%)', 
                color: '#000', 
                border: 'none', 
                borderRadius: '14px', 
                fontWeight: 700, 
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(200,169,110,0.3)'
              }}
            >
              확인했습니다
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ProfileModal({ isOpen, onClose, profileForm, setProfileForm, onSave, sajuCard, astroCard, isUpdating }: any) {
  const SajuTag = ({ label, value, sub }: any) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px', flex: 1 }}>
      <div style={{ fontSize: '10px', color: 'rgba(200,169,110,0.6)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '15px', color: '#fff', fontWeight: 600 }}>{value}</div>
      {sub && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{sub}</div>}
    </div>
  );

  const isSaveDisabled = !profileForm.year || !profileForm.month || !profileForm.day || isUpdating;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="mobile-p-small"
            style={{ background: '#120d1d', border: '1px solid rgba(200,169,110,0.3)', borderRadius: '24px', width: '100%', maxWidth: '400px', maxHeight: '92vh', overflowY: 'auto', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#c8a96e', fontSize: '18px', letterSpacing: '.1em' }}>개인 프로필</h3>
              <button disabled={isUpdating} onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: isUpdating ? 'wait' : 'pointer', fontSize: '24px' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(200,169,110,.8)', marginBottom: '8px' }}>닉네임</label>
                <input disabled={isUpdating} type="text" value={profileForm.nickname} onChange={e => setProfileForm((p: any) => ({ ...p, nickname: e.target.value }))} placeholder="닉네임을 입력하세요" style={IS} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(200,169,110,.8)', marginBottom: '8px' }}>실명 (사주 분석용)</label>
                <input disabled={isUpdating} type="text" value={profileForm.realName} onChange={e => setProfileForm((p: any) => ({ ...p, realName: e.target.value }))} placeholder="이름을 입력하세요" style={IS} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(200,169,110,.8)', marginBottom: '8px' }}>생년월일 <span style={{ color: '#ff6464' }}>*</span></label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input disabled={isUpdating} type="number" placeholder="년" value={profileForm.year} onChange={e => setProfileForm((p: any) => ({ ...p, year: e.target.value }))} style={{ ...IS, textAlign: 'center' }} />
                  <input disabled={isUpdating} type="number" placeholder="월" value={profileForm.month} onChange={e => setProfileForm((p: any) => ({ ...p, month: e.target.value }))} style={{ ...IS, textAlign: 'center' }} />
                  <input disabled={isUpdating} type="number" placeholder="일" value={profileForm.day} onChange={e => setProfileForm((p: any) => ({ ...p, day: e.target.value }))} style={{ ...IS, textAlign: 'center' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(200,169,110,.8)', marginBottom: '8px' }}>태어난 시간 (0~23)</label>
                <input disabled={isUpdating} type="number" value={profileForm.hour} onChange={e => setProfileForm((p: any) => ({ ...p, hour: e.target.value }))} placeholder="모르면 비워두세요" style={{ ...IS, textAlign: 'center' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(200,169,110,.8)', marginBottom: '8px' }}>성별 <span style={{ color: '#ff6464' }}>*</span></label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['여', '남'].map(g => (
                    <button key={g} disabled={isUpdating} onClick={() => setProfileForm((p: any) => ({ ...p, gender: g }))} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `1px solid ${profileForm.gender === g ? '#c8a96e' : 'rgba(255,255,255,0.1)'}`, background: profileForm.gender === g ? 'rgba(200,169,110,0.1)' : 'transparent', color: profileForm.gender === g ? '#c8a96e' : 'rgba(255,255,255,0.5)', cursor: isUpdating ? 'wait' : 'pointer' }}>{g}성</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(200,169,110,.8)', marginBottom: '8px' }}>출생 도시 <span style={{ color: '#ff6464' }}>*</span></label>
                <input disabled={isUpdating} type="text" value={profileForm.city} onChange={e => setProfileForm((p: any) => ({ ...p, city: e.target.value }))} placeholder="서울, 부산 등" style={IS} />
              </div>
              
              <motion.button 
                whileHover={{ scale: isSaveDisabled ? 1 : 1.02 }} whileTap={{ scale: isSaveDisabled ? 1 : 0.98 }}
                onClick={onSave}
                disabled={isSaveDisabled}
                style={{ 
                  marginTop: '12px', width: '100%', padding: '16px', borderRadius: '12px', 
                  background: isSaveDisabled ? 'rgba(255,255,255,0.05)' : '#c8a96e', 
                  color: isSaveDisabled ? 'rgba(255,255,255,0.2)' : '#fff', 
                  border: 'none', fontWeight: 600, cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : null}
                {isUpdating ? '저장 중...' : '저장하기'}
              </motion.button>

              {(sajuCard || astroCard) && (
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Sparkles size={16} color="#c8a96e" />
                    <span style={{ fontSize: '14px', color: '#c8a96e', fontWeight: 700, letterSpacing: '0.05em' }}>운명적 데이터 분석</span>
                  </div>

                  {sajuCard && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <SajuTag label="년주" value={sajuCard.year} />
                        <SajuTag label="월주" value={sajuCard.month} />
                        <SajuTag label="일주" value={sajuCard.day} />
                        <SajuTag label="시주" value={sajuCard.hour} />
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <SajuTag label="핵심 일간" value={sajuCard.dayMaster} />
                        <SajuTag label="강한 기운" value={sajuCard.dominant} />
                        <SajuTag label="부족한 기운" value={sajuCard.weak} />
                      </div>
                      {sajuCard.daeun && (
                        <div style={{ marginTop: '8px', background: 'rgba(200,169,110,0.05)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(200,169,110,0.1)' }}>
                          <div style={{ fontSize: '10px', color: '#c8a96e', marginBottom: '4px' }}>현재 대운 흐름</div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{sajuCard.daeun}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {astroCard && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      <div style={{ background: 'rgba(122,174,212,0.05)', border: '1px solid rgba(122,174,212,0.15)', borderRadius: '12px', padding: '12px' }}>
                        <div style={{ fontSize: '10px', color: '#7aaed4', marginBottom: '6px' }}>태양/달 사인</div>
                        <div style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{astroCard.sun} / {astroCard.moon}</div>
                      </div>
                      <div style={{ background: 'rgba(122,174,212,0.05)', border: '1px solid rgba(122,174,212,0.15)', borderRadius: '12px', padding: '12px' }}>
                        <div style={{ fontSize: '10px', color: '#7aaed4', marginBottom: '6px' }}>상승점 (Asc)</div>
                        <div style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{astroCard.asc}</div>
                      </div>
                      <div style={{ background: 'rgba(122,174,212,0.05)', border: '1px solid rgba(122,174,212,0.15)', borderRadius: '12px', padding: '12px' }}>
                        <div style={{ fontSize: '10px', color: '#7aaed4', marginBottom: '6px' }}>금성/화성 (사랑/욕망)</div>
                        <div style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{astroCard.venus} / {astroCard.mars}</div>
                      </div>
                      <div style={{ background: 'rgba(122,174,212,0.05)', border: '1px solid rgba(122,174,212,0.15)', borderRadius: '12px', padding: '12px' }}>
                        <div style={{ fontSize: '10px', color: '#7aaed4', marginBottom: '6px' }}>목성/토성 (확장/제한)</div>
                        <div style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{astroCard.jupiter} / {astroCard.saturn}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HistoryModal({ isOpen, onClose, loadingHistory, savedHistory }: any) {
  const [historyTab, setHistoryTab] = React.useState('CHAT');
  const [chatSubTab, setChatSubTab] = React.useState('ALL');
  const [viewDate, setViewDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const hasHistoryOnDay = (date: Date) => {
    return savedHistory.some((h: any) => {
      if (!h.createdAt?.toDate) return false;
      return isSameDay(h.createdAt.toDate(), date);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="mobile-p-small"
            style={{ background: '#120d1d', border: '1px solid rgba(200,169,110,0.3)', borderRadius: '24px', width: '100%', maxWidth: '440px', maxHeight: '85vh', overflowY: 'auto', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#c8a96e', fontSize: '18px', letterSpacing: '.1em' }}>상담 기록</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button 
                onClick={() => setHistoryTab('CHAT')}
                style={{ 
                  flex: 1, padding: '10px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s',
                  background: historyTab === 'CHAT' ? 'rgba(200,169,110,0.2)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${historyTab === 'CHAT' ? '#c8a96e' : 'rgba(255,255,255,0.1)'}`,
                  color: historyTab === 'CHAT' ? '#c8a96e' : 'rgba(255,255,255,0.4)'
                }}
              >
                LUCY CHAT
              </button>
              <button 
                onClick={() => setHistoryTab('VISION')}
                style={{ 
                  flex: 1, padding: '10px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s',
                  background: historyTab === 'VISION' ? 'rgba(122,174,212,0.2)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${historyTab === 'VISION' ? '#7aaed4' : 'rgba(255,255,255,0.1)'}`,
                  color: historyTab === 'VISION' ? '#7aaed4' : 'rgba(255,255,255,0.4)'
                }}
              >
                LUCY VISION
              </button>
            </div>

            {historyTab === 'CHAT' && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', padding: '4px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                {['ALL', 'DAILY', 'QUICK'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => setChatSubTab(sub)}
                    style={{
                      flex: 1, padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                      background: chatSubTab === sub ? 'rgba(200,169,110,0.15)' : 'transparent',
                      border: 'none',
                      color: chatSubTab === sub ? '#c8a96e' : 'rgba(255,255,255,0.3)'
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} style={{ background: 'none', border: 'none', color: '#c8a96e', cursor: 'pointer', padding: '5px' }}>&lt;</button>
                    <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월</span>
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} style={{ background: 'none', border: 'none', color: '#c8a96e', cursor: 'pointer', padding: '5px' }}>&gt;</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                    {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                      <div key={d} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', paddingBottom: '8px' }}>{d}</div>
                    ))}
                    {getDaysInMonth(viewDate).map((date: any, i: number) => (
                      <div 
                        key={i} 
                        onClick={() => date && setSelectedDate(selectedDate && isSameDay(selectedDate, date) ? null : date)}
                        style={{ 
                          aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', borderRadius: '8px', cursor: date ? 'pointer' : 'default',
                          background: date && selectedDate && isSameDay(selectedDate, date) ? '#c8a96e' : 'transparent',
                          color: date ? (selectedDate && isSameDay(selectedDate, date) ? '#000' : (hasHistoryOnDay(date) ? '#c8a96e' : 'rgba(255,255,255,0.6)')) : 'transparent',
                          fontWeight: date && hasHistoryOnDay(date) ? 700 : 400,
                          position: 'relative'
                        }}
                      >
                        {date?.getDate()}
                        {date && hasHistoryOnDay(date) && !(selectedDate && isSameDay(selectedDate, date)) && (
                          <div style={{ position: 'absolute', bottom: '4px', width: '4px', height: '4px', borderRadius: '50%', background: '#c8a96e' }} />
                        )}
                      </div>
                    ))}
                  </div>
                  {selectedDate && (
                    <button 
                      onClick={() => setSelectedDate(null)}
                      style={{ marginTop: '12px', width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '11px', cursor: 'pointer' }}
                    >
                      전체 기록 보기
                    </button>
                  )}
                </div>

                {selectedDate && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  marginBottom: '24px', 
                  padding: '24px', 
                  borderRadius: '20px', 
                  background: 'linear-gradient(135deg, rgba(200,169,110,0.1) 0%, rgba(18,13,29,0) 100%)', 
                  border: '1px solid rgba(200,169,110,0.25)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Sparkles size={16} color="#c8a96e" />
                  <span style={{ fontSize: '13px', color: '#c8a96e', fontWeight: 'bold', letterSpacing: '0.1em' }}>DAILY INSIGHT SUMMARY</span>
                </div>
                {(() => {
                  const dayHistory = savedHistory.filter((h: any) => h.createdAt?.toDate && isSameDay(h.createdAt.toDate(), selectedDate));
                  const summary = dayHistory.find((h: any) => h.type === 'DAILY')?.resonance?.diagnosis 
                                || dayHistory.find((h: any) => h.type === 'QUICK')?.quickInsight?.diagnosis
                                || dayHistory.find((h: any) => h.diagnosis)?.diagnosis
                                || dayHistory.find((h: any) => h.visionResult?.diagnosis)?.visionResult?.diagnosis;
                  
                  if (summary) {
                    return <div style={{ fontSize: '15px', color: '#fff', lineHeight: 1.7, fontWeight: 500, wordBreak: 'keep-all' }}>{summary}</div>;
                  }
                  
                  if (dayHistory.length > 0) {
                    return <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontStyle: 'italic' }}>이날은 루시와 소중한 대화를 나누며 마음을 돌보았어요. 기록들을 하나씩 살펴보며 다시 한번 그때의 기운을 느껴보세요.</div>;
                  }
                  
                  return <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>기록이 없습니다.</div>;
                })()}
              </motion.div>
            )}

            {loadingHistory ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}><Loader2 className="animate-spin" color="#c8a96e" style={{ margin: '0 auto' }} /></div>
                ) : savedHistory.filter((h: any) => {
                  const dateMatch = selectedDate ? (h.createdAt?.toDate ? isSameDay(h.createdAt.toDate(), selectedDate) : false) : true;
                  const typeMatch = historyTab === 'VISION' ? h.type === 'VISION' : h.type !== 'VISION';
                  let subMatch = true;
                  if (historyTab === 'CHAT') {
                    if (chatSubTab === 'DAILY') subMatch = h.type === 'DAILY';
                    else if (chatSubTab === 'QUICK') subMatch = h.type === 'QUICK';
                  }
                  return dateMatch && typeMatch && subMatch;
                }).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                    {selectedDate ? `${selectedDate.toLocaleDateString()}의 기록이 없습니다.` : `${historyTab === 'VISION' ? '비전' : (chatSubTab === 'ALL' ? '루시' : chatSubTab)} 기록이 없습니다.`}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {savedHistory.filter((h: any) => {
                      const dateMatch = selectedDate ? (h.createdAt?.toDate ? isSameDay(h.createdAt.toDate(), selectedDate) : false) : true;
                      const typeMatch = historyTab === 'VISION' ? h.type === 'VISION' : h.type !== 'VISION';
                      let subMatch = true;
                      if (historyTab === 'CHAT') {
                        if (chatSubTab === 'DAILY') subMatch = h.type === 'DAILY';
                        else if (chatSubTab === 'QUICK') subMatch = h.type === 'QUICK';
                      }
                      return dateMatch && typeMatch && subMatch;
                    }).map((h: any) => (
                      <div key={h.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '10px', color: '#c8a96e', background: 'rgba(200,169,110,0.1)', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                            {h.type === 'VISION' ? 'LUCY VISION' : h.type === 'DAILY' ? 'DAILY READING' : h.type === 'QUICK' ? 'QUICK READING' : 'LUCY CHAT'}
                          </span>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                            {h.createdAt?.toDate ? h.createdAt.toDate().toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        
                        <div style={{ fontSize: '15px', color: '#fff', marginBottom: '16px', fontWeight: 500, lineHeight: 1.5 }}>"{h.concern}"</div>
                        
                        {(h.resonance || h.quickInsight || h.keyCard || (h.type === 'VISION' && h.visionResult?.diagnosis)) && (
                          <div style={{ background: 'rgba(200,169,110,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(200,169,110,0.15)', marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#c8a96e', marginBottom: '10px', fontWeight: 'bold', letterSpacing: '0.1em' }}>INTEGRATED INSIGHT</div>
                            
                            {(h.resonance || h.quickInsight || h.visionResult) && (
                              <div style={{ marginBottom: (h.keyCard || h.visionResult?.keyInsight || h.quickInsight?.keyInsight) ? '12px' : 0 }}>
                                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: '6px', fontWeight: 500 }}>
                                  {h.resonance?.diagnosis || h.quickInsight?.diagnosis || h.visionResult?.diagnosis}
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(200,169,110,0.7)', lineHeight: 1.5 }}>
                                  {h.resonance?.coreProblem || h.quickInsight?.coreProblem || h.visionResult?.coreProblem}
                                </div>
                              </div>
                            )}
                            
                            {(h.keyCard || h.visionResult?.keyInsight || h.quickInsight?.keyInsight) && (
                              <div style={{ paddingTop: (h.resonance || h.quickInsight || h.visionResult?.diagnosis) ? '12px' : 0, borderTop: (h.resonance || h.quickInsight || h.visionResult?.diagnosis) ? '1px solid rgba(200,169,110,0.1)' : 'none' }}>
                                <div style={{ fontSize: '14px', color: '#ffd700', fontWeight: 'bold', marginBottom: '6px' }}>
                                  {h.keyCard || h.visionResult?.keyInsight?.message || h.quickInsight?.keyInsight?.message || 'Key Insight'}
                                </div>
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                                  {h.guidance || h.visionResult?.decision?.selected || h.quickInsight?.decision?.selected}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {h.type === 'QUICK' && !h.quickInsight && h.text && (
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>QUICK SUMMARY</div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{h.text}</div>
                          </div>
                        )}

                        {h.type === 'VISION' && h.visionResult?.cards && (
                          <div style={{ background: 'rgba(122,174,212,0.05)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(122,174,212,0.2)', marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#7aaed4', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>VISION CARDS</div>
                            {h.visionResult.cards.map((card: any, idx: number) => (
                              <div key={idx} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: idx < h.visionResult.cards.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <div style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{card.cardName}</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px', lineHeight: 1.4 }}>{card.advice}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {(h.type === 'LUCKY' || h.type === 'DEEP_PORTAL' || h.type === 'DAILY' || h.type === 'SIMPLE' || h.type === 'QUICK') && h.chatHistory && (
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                              {h.chatHistory.map((msg: any, idx: number) => (
                                <div key={idx} style={{ fontSize: '12px', lineHeight: 1.5 }}>
                                  <div style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.4)' : '#c8a96e', fontWeight: 'bold', marginBottom: '2px', fontSize: '10px' }}>
                                    {msg.role === 'user' ? 'YOU' : 'LUCY'}
                                  </div>
                                  <div style={{ color: 'rgba(255,255,255,0.8)' }}>{msg.content}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ResumeModal({ isOpen, onResume, onClear }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'rgba(20,20,25,0.95)', border: '1px solid rgba(200,169,110,0.3)', borderRadius: '24px', padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(200,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Sparkles size={30} color="#c8a96e" />
            </div>
            <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 'bold', marginBottom: '12px' }}>이전 상담이 남아있습니다</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: 1.6 }}>
              진행 중이던 상담 기록이 발견되었습니다.<br/>이어서 상담을 계속하시겠습니까?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={onResume}
                style={{ width: '100%', padding: '16px', background: '#c8a96e', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                이어서 상담하기
              </button>
              <button 
                onClick={onClear}
                style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer' }}
              >
                새로 시작하기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LimitModal({ isOpen, message, onClose }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', padding: '20px' }}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={{ background: '#0a0a0a', border: '1px solid rgba(200,169,110,0.3)', borderRadius: '20px', padding: '32px', textAlign: 'center', maxWidth: '320px', width: '100%' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <div style={{ color: '#c8a96e', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>{message}</div>
            <button onClick={onClose} style={{ width: '100%', padding: '12px', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.3)', borderRadius: '12px', color: '#c8a96e', cursor: 'pointer' }}>확인</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LucyMemoryModal({ isOpen, onClose, memory }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ position: 'relative', width: '100%', maxWidth: '400px', background: '#1a1a2e', border: '1px solid rgba(200,169,110,0.2)', borderRadius: '24px', padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: '#c8a96e', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><History size={20} /> LUCKY MEMORY</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {memory || "아직 기억된 내용이 없어요. 루시와 더 많은 이야기를 나눠보세요!"}
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '20px', textAlign: 'center' }}>루시는 당신의 이야기를 소중히 기억합니다.</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ErrorModal({ isOpen, error, onClose }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ position: 'relative', width: '100%', maxWidth: '360px', background: '#1a0d0d', border: '1px solid rgba(255,100,100,0.3)', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,100,100,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <X size={30} color="#ff6464" />
            </div>
            <h3 style={{ fontSize: '20px', color: '#ff6464', fontWeight: 'bold', marginBottom: '12px' }}>오류가 발생했습니다</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: 1.6, wordBreak: 'break-all' }}>
              {error || "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
            </p>
            <button 
              onClick={onClose}
              style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              닫기
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function LucyRelationshipsModal({ isOpen, onClose, relationships }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ position: 'relative', width: '100%', maxWidth: '400px', background: '#1a1a2e', border: '1px solid rgba(200,169,110,0.2)', borderRadius: '24px', padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: '#c8a96e', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><UserIcon size={20} /> RELATIONSHIPS</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {relationships.length > 0 ? relationships.map((rel: any, i: number) => (
                <div key={i} style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#c8a96e', fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{rel.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.5 }}>{rel.description}</div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '40px 0' }}>주변 인물에 대해 이야기하면 루시가 프로필을 만들어줄게요.</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
