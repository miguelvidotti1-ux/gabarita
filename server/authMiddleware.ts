import { Request, RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { PLANOS_IDS_VALIDOS } from '../shared/planos';

interface FirebaseConfig {
  projectId: string;
  firestoreDatabaseId?: string;
}

const FIREBASE_CONFIG_PATH = path.resolve(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: FirebaseConfig = { projectId: '' };
try {
  firebaseConfig = JSON.parse(fs.readFileSync(FIREBASE_CONFIG_PATH, 'utf-8')) as FirebaseConfig;
} catch (err) {
  console.warn('[Auth] Não foi possível ler firebase-applet-config.json:', err);
}

export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;
export const FIRESTORE_DATABASE_ID = firebaseConfig.firestoreDatabaseId || '(default)';
const ADMIN_EMAIL_FALLBACK = 'miguelvidotti1@gmail.com';

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

const VALID_PLANS = new Set<string>(PLANOS_IDS_VALIDOS);

export interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  hasActiveSubscription: boolean;
  idToken: string;
}

function parseFirestoreField(field: Record<string, unknown> | undefined): unknown {
  if (!field) return undefined;
  if ('stringValue' in field) return String(field.stringValue);
  if ('booleanValue' in field) return Boolean(field.booleanValue);
  if ('integerValue' in field) return Number(field.integerValue);
  if ('doubleValue' in field) return Number(field.doubleValue);
  return undefined;
}

export function getFirestoreRestBase(): string {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(FIREBASE_PROJECT_ID)}/databases/${encodeURIComponent(FIRESTORE_DATABASE_ID)}/documents`;
}

export async function fetchUserFirestoreDoc(
  uid: string,
  idToken?: string
): Promise<{
  role?: string;
  activePlanId?: string;
  paymentStatus?: string;
  isPremium?: boolean;
  premiumUntil?: string;
} | null> {
  if (!FIREBASE_PROJECT_ID || !uid) return null;
  const url = `${getFirestoreRestBase()}/users/${encodeURIComponent(uid)}`;
  try {
    const headers: Record<string, string> = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }
    const resp = await fetch(url, { headers });
    if (!resp.ok) return null;
    const json = (await resp.json()) as { fields?: Record<string, Record<string, unknown>> };
    const fields = json.fields || {};
    return {
      role: parseFirestoreField(fields.role) as string | undefined,
      activePlanId: parseFirestoreField(fields.activePlanId) as string | undefined,
      paymentStatus: parseFirestoreField(fields.paymentStatus) as string | undefined,
      isPremium: parseFirestoreField(fields.isPremium) as boolean | undefined,
      premiumUntil: parseFirestoreField(fields.premiumUntil) as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function authenticateFirebaseUser(req: Request): Promise<VerifiedFirebaseUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  if (!token || token.startsWith('auth_vesthub_')) {
    return null;
  }

  if (!FIREBASE_PROJECT_ID) return null;

  try {
    const { payload } = await jwtVerify(token, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });

    const uid = typeof payload.sub === 'string' ? payload.sub : '';
    const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
    const emailVerified = payload.email_verified === true;
    if (!uid) return null;

    const userDoc = await fetchUserFirestoreDoc(uid, token);
    const isAdmin = userDoc?.role === 'admin' || (email === ADMIN_EMAIL_FALLBACK && emailVerified);

    const activePlan = (userDoc?.activePlanId || '').toLowerCase();
    const notExpired = !userDoc?.premiumUntil || new Date(userDoc.premiumUntil).getTime() > Date.now();

    const hasActiveSubscription =
      isAdmin ||
      Boolean(userDoc?.isPremium && notExpired) ||
      userDoc?.paymentStatus === 'approved' ||
      (VALID_PLANS.has(activePlan) && notExpired);

    return {
      uid,
      email,
      role: isAdmin ? 'admin' : 'user',
      hasActiveSubscription,
      idToken: token,
    };
  } catch {
    return null;
  }
}

export type AuthenticatedRequest = Request & { authUser?: VerifiedFirebaseUser };

export function requireActiveSubscription(
  inactiveMessage = 'Sua assinatura não está ativa. Escolha um plano para continuar.'
): RequestHandler {
  return async (req, res, next) => {
    const user = await authenticateFirebaseUser(req);
    if (!user || !user.hasActiveSubscription) {
      return res.status(403).json({
        erro: inactiveMessage,
        code: 'SUBSCRIPTION_INACTIVE',
      });
    }
    (req as AuthenticatedRequest).authUser = user;
    next();
  };
}
