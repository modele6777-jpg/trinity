import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, browserPopupRedirectResolver } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, onSnapshot, query, orderBy, limit, getDocFromServer } from 'firebase/firestore';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { browserPopupRedirectResolver };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUid = auth.currentUser?.uid;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  
  console.group('🔥 Firestore Error Diagnostics');
  console.error('Operation:', operationType);
  console.error('Path:', path);
  console.error('Logged In UID:', currentUid);
  console.error('Error Message:', errInfo.error);
  console.error('Full Info:', errInfo);
  console.groupEnd();
  
  // Soft handle errors for history and recurring reads to prevent UI block
  const isHistoryPath = path?.includes('history') || path?.includes('lucky');
  const isUserDocPath = path?.startsWith('users/');
  
  if (operationType === OperationType.GET && isUserDocPath) {
    console.warn("Soft handling user doc read error");
    return;
  }
  
  if (isHistoryPath) {
    console.warn("Soft handling history/lucky collection error");
    return;
  }

  // Profile updates should probably still throw if they fail, but let's see which path it is
  if (operationType === OperationType.UPDATE && isUserDocPath) {
    console.error("Critical: Profile Update Permission Denied. Check rules for path:", path);
  }

  // Only throw for truly blocking errors if we are sure we want to halt the app
  // For now, let's stop throwing for profile updates too, to see if it fixes "infinite loading" or "blocks"
  // but we still want the user to know it failed via setError in the hook.
  // Actually, we'll keep throwing for everything else to maintain some diagnostics.
  if (operationType !== OperationType.LIST && operationType !== OperationType.GET && !isHistoryPath) {
    throw new Error(JSON.stringify(errInfo));
  }
}

// Test connection removed from top-level to speed up start
