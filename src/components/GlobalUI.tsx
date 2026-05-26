import React from 'react';
import { Header } from './Header';
import { 
  InstallGuideModal, ProfileModal, HistoryModal, 
  ResumeModal, LimitModal, ErrorModal, LucyMemoryModal, LucyRelationshipsModal 
} from './Modals';

interface GlobalUIProps {
  user: any;
  profile: any;
  onLogout: () => void;
  onShowProfile: () => void;
  onShowHistory: () => void;
  onInstall: () => void;
  onHome: () => void;
  isStandalone: boolean;
  showInstallGuide: boolean;
  setShowInstallGuide: (v: boolean) => void;
  isSamsung: boolean;
  isIOS: boolean;
  showProfileModal: boolean;
  setShowProfileModal: (v: boolean) => void;
  profileForm: any;
  setProfileForm: (v: any) => void;
  setProfile: (v: any) => Promise<boolean>;
  isUpdatingProfile?: boolean;
  sajuCard: any;
  astroCard: any;
  showHistoryModal: boolean;
  setShowHistoryModal: (v: boolean) => void;
  savedHistory: any[];
  loadingHistory: boolean;
  showResumeModal: boolean;
  resumeSession: () => void;
  clearSession: () => void;
  showLimitModal: boolean;
  setShowLimitModal: (v: boolean) => void;
  limitMsg: string;
  showLucyMemoryModal: boolean;
  setShowLucyMemoryModal: (v: boolean) => void;
  lucyMemory: string;
  showLucyRelationshipsModal: boolean;
  setShowLucyRelationshipsModal: (v: boolean) => void;
  lucyRelationships: any[];
  error: string | null;
  setError: (v: string | null) => void;
}

export function GlobalUI({
  user, profile, onLogout, onShowProfile, onShowHistory, onInstall, onHome,
  isStandalone,
  showInstallGuide, setShowInstallGuide, isSamsung, isIOS,
  showProfileModal, setShowProfileModal, profileForm, setProfileForm, setProfile, isUpdatingProfile,
  sajuCard, astroCard,
  showHistoryModal, setShowHistoryModal, savedHistory, loadingHistory,
  showResumeModal, resumeSession, clearSession,
  showLimitModal, setShowLimitModal, limitMsg,
  showLucyMemoryModal, setShowLucyMemoryModal, lucyMemory,
  showLucyRelationshipsModal, setShowLucyRelationshipsModal, lucyRelationships,
  error, setError
}: GlobalUIProps) {
  return (
    <>
      <Header 
        user={user}
        profile={profile}
        onLogout={onLogout}
        onShowProfile={onShowProfile}
        onShowHistory={onShowHistory}
        onInstall={onInstall}
        onHome={onHome}
        isStandalone={isStandalone}
      />

      <InstallGuideModal 
        isOpen={showInstallGuide} 
        onClose={() => setShowInstallGuide(false)} 
        isSamsung={isSamsung} 
        isIOS={isIOS} 
      />

      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profileForm={profileForm}
        setProfileForm={setProfileForm}
        sajuCard={sajuCard}
        astroCard={astroCard}
        isUpdating={isUpdatingProfile}
        onSave={async () => {
          try {
            const success = await setProfile(profileForm);
            if (success) {
              setShowProfileModal(false);
              setShowLimitModal(false);
            }
          } catch (err) {
            console.error("Profile save failed:", err);
          }
        }}
      />

      <HistoryModal 
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        savedHistory={savedHistory}
        loadingHistory={loadingHistory}
      />

      <ResumeModal 
        isOpen={showResumeModal}
        onResume={resumeSession}
        onClear={clearSession}
      />

      <LimitModal 
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        message={limitMsg}
      />

      <ErrorModal 
        isOpen={!!error}
        error={error}
        onClose={() => setError(null)}
      />

      <LucyMemoryModal 
        isOpen={showLucyMemoryModal}
        onClose={() => setShowLucyMemoryModal(false)}
        memory={lucyMemory}
      />

      <LucyRelationshipsModal 
        isOpen={showLucyRelationshipsModal}
        onClose={() => setShowLucyRelationshipsModal(false)}
        relationships={lucyRelationships}
      />
    </>
  );
}
