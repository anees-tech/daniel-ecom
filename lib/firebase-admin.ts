import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined,
};

export function initAdmin() {
  if (getApps().length <= 0) {
    initializeApp({
      credential: cert(firebaseAdminConfig),
    });
  }
  return getAuth();
}

export const adminAuth = initAdmin();