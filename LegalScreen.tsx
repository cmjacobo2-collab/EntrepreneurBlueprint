import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { persistence } from './persistence';
import type { Account, Commitment, Answers, Decision } from '../logic/types';

type View = null | 'consult' | 'howto' | 'kb' | 'legal';

interface StoreValue {
  ready: boolean;
  authed: boolean;
  account: Account | null;
  commitment: Commitment | null;
  step: number;
  answers: Answers;
  decision: Decision;
  view: View;
  openPart: number | null;
  /** Create account (after verify) and start a session. */
  registerAccount: (a: Account) => void;
  /** Returns null on success, or an error message string. */
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  setCommitment: (c: Commitment) => void;
  go: (step: number) => void;
  openView: (v: View) => void;
  setOpenPart: (p: number | null) => void;
  setAnswer: (id: string, val: string | boolean | number) => void;
  setDecision: (d: Decision) => void;
  resetWorkbook: () => void;
}

const Ctx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [account, setAccountState] = useState<Account | null>(null);
  const [commitment, setCommitmentState] = useState<Commitment | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [decision, setDecisionState] = useState<Decision>('');
  const [view, setView] = useState<View>(null);
  const [openPart, setOpenPart] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const [a, session, c, w] = await Promise.all([
        persistence.loadAccount(),
        persistence.loadSession(),
        persistence.loadCommitment(),
        persistence.loadWorkbook(),
      ]);
      if (a) setAccountState(a);
      if (a && session && session === a.accountNo) setAuthed(true);
      if (c) setCommitmentState(c);
      if (w) { setStep(w.step || 0); setAnswers(w.answers || {}); setDecisionState(w.decision || ''); }
      setReady(true);
    })();
  }, []);

  const persistWorkbook = useCallback((next: Partial<{ step: number; answers: Answers; decision: Decision }>) => {
    persistence.saveWorkbook({ step: next.step ?? step, answers: next.answers ?? answers, decision: next.decision ?? decision });
  }, [step, answers, decision]);

  const value: StoreValue = useMemo(() => ({
    ready, authed, account, commitment, step, answers, decision, view, openPart,
    registerAccount: (a) => {
      setAccountState(a); persistence.saveAccount(a);
      persistence.saveSession(a.accountNo); setAuthed(true);
    },
    login: async (email, password) => {
      const a = await persistence.verifyLogin(email, password);
      if (!a) return 'That email or password doesn’t match. Try again.';
      setAccountState(a); await persistence.saveSession(a.accountNo); setAuthed(true);
      return null;
    },
    logout: () => { persistence.clearSession(); setAuthed(false); setView(null); },
    setCommitment: (c) => { setCommitmentState(c); persistence.saveCommitment(c); },
    go: (s) => { setStep(s); setView(null); persistWorkbook({ step: s }); },
    openView: (v) => setView(v),
    setOpenPart,
    setAnswer: (id, val) => { setAnswers((prev) => { const a = { ...prev, [id]: val }; persistence.saveWorkbook({ step, answers: a, decision }); return a; }); },
    setDecision: (d) => { setDecisionState(d); persistWorkbook({ decision: d }); },
    resetWorkbook: () => { setStep(0); setAnswers({}); setDecisionState(''); persistence.clearWorkbook(); },
  }), [ready, authed, account, commitment, step, answers, decision, view, openPart, persistWorkbook]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be used within StoreProvider');
  return v;
}
