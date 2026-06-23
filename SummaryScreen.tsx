import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Account, Commitment, Answers, Decision } from '../logic/types';

/**
 * Persistence abstraction. Today this is device-local (AsyncStorage), matching the
 * prototype's localStorage behavior. For production, implement the same interface
 * against your backend (Supabase/Firebase) so account, commitment, and workbook
 * answers sync across devices, the one-account-one-business rule is enforced, and
 * — critically — authentication is real (hash passwords server-side; issue a
 * session token instead of storing the account number). Screens depend only on
 * this interface, not on storage details.
 */
export interface WorkbookState { step: number; answers: Answers; decision: Decision; }

export interface PersistenceAdapter {
  loadAccount(): Promise<Account | null>;
  saveAccount(a: Account): Promise<void>;
  /** Returns the account if email+password match, else null. STUB — replace with a real auth call. */
  verifyLogin(email: string, password: string): Promise<Account | null>;
  loadSession(): Promise<string | null>;     // accountNo (stub) or token
  saveSession(token: string): Promise<void>;
  clearSession(): Promise<void>;
  loadCommitment(): Promise<Commitment | null>;
  saveCommitment(c: Commitment): Promise<void>;
  loadWorkbook(): Promise<WorkbookState | null>;
  saveWorkbook(w: WorkbookState): Promise<void>;
  clearWorkbook(): Promise<void>;
}

const AKEY = 'attable-account-v1';
const CKEY = 'attable-commitment-v1';
const KEY = 'attable-founder-workbook-v1';
const SKEY = 'attable-session-v1';

async function get<T>(k: string): Promise<T | null> {
  try { const raw = await AsyncStorage.getItem(k); return raw ? (JSON.parse(raw) as T) : null; }
  catch { return null; }
}
async function set(k: string, v: unknown) {
  try { await AsyncStorage.setItem(k, JSON.stringify(v)); } catch {}
}

export const localAdapter: PersistenceAdapter = {
  async loadAccount() { const a = await get<Account>(AKEY); return a && a.verified ? a : null; },
  saveAccount(a) { return set(AKEY, a); },
  async verifyLogin(email, password) {
    const a = await get<Account>(AKEY);
    if (!a || !a.verified) return null;
    const match = a.email.trim().toLowerCase() === email.trim().toLowerCase() && a.password === password;
    return match ? a : null;
  },
  loadSession() { return get<string>(SKEY); },
  saveSession(token) { return set(SKEY, token); },
  async clearSession() { try { await AsyncStorage.removeItem(SKEY); } catch {} },
  loadCommitment() { return get<Commitment>(CKEY); },
  saveCommitment(c) { return set(CKEY, c); },
  loadWorkbook() { return get<WorkbookState>(KEY); },
  saveWorkbook(w) { return set(KEY, w); },
  async clearWorkbook() { try { await AsyncStorage.removeItem(KEY); } catch {} },
};

// Swap this line for `backendAdapter` once the server is built.
export const persistence: PersistenceAdapter = localAdapter;
