import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Pressable, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, SchibstedGrotesk_700Bold, SchibstedGrotesk_800ExtraBold } from '@expo-google-fonts/schibsted-grotesk';
import { HankenGrotesk_400Regular, HankenGrotesk_500Medium, HankenGrotesk_600SemiBold } from '@expo-google-fonts/hanken-grotesk';
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';
import { color, font } from './src/theme/tokens';
import { StoreProvider, useStore } from './src/state/store';
import { sections } from './src/content';
import type { Account } from './src/logic/types';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import AccountFormScreen, { AcctDraft } from './src/screens/AccountFormScreen';
import AccountVerifyScreen from './src/screens/AccountVerifyScreen';
import CommitmentScreen from './src/screens/CommitmentScreen';
import IntroScreen from './src/screens/IntroScreen';
import SectionScreen from './src/screens/SectionScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import ConsultScreen from './src/screens/resources/ConsultScreen';
import HowToScreen from './src/screens/resources/HowToScreen';
import KbScreen from './src/screens/resources/KbScreen';
import LegalScreen from './src/screens/resources/LegalScreen';
import Sidebar from './src/components/Sidebar';

function makeAccount(a: AcctDraft): Account {
  const accountNo = 'ATT-' + Date.now().toString(36).toUpperCase().slice(-6) + '-' + Math.floor(Math.random() * 9000 + 1000);
  const first = a.firstName.trim(); const last = a.lastName.trim();
  return {
    firstName: first, lastName: last, fullName: `${first} ${last}`.trim(),
    businessName: a.businessName.trim(), industry: a.industry, bizType: a.bizType,
    email: a.email.trim(), password: a.password,
    accountNo, verified: true, createdAt: Date.now(),
  };
}

/** Auth flow shown until the user is signed in. */
function AuthFlow() {
  const { account, registerAccount, login } = useStore();
  const [screen, setScreen] = useState<'welcome' | 'login' | 'signup'>(account ? 'login' : 'welcome');
  const [draft, setDraft] = useState<AcctDraft | null>(null); // preserves entered values
  const [reviewing, setReviewing] = useState(false);

  if (screen === 'welcome') return <WelcomeScreen onLogin={() => setScreen('login')} onSignup={() => setScreen('signup')} />;
  if (screen === 'login') return <LoginScreen initialEmail={account?.email || ''} onLogin={login} onSignup={() => setScreen('signup')} />;
  // signup
  if (reviewing && draft) {
    return <AccountVerifyScreen draft={draft} onBack={() => setReviewing(false)} onConfirm={() => registerAccount(makeAccount(draft))} />;
  }
  return <AccountFormScreen initial={draft || undefined} onReview={(a) => { setDraft(a); setReviewing(true); }} onLogin={() => setScreen('login')} />;
}

function MainContent() {
  const { step, view } = useStore();
  if (view === 'consult') return <ConsultScreen />;
  if (view === 'howto') return <HowToScreen />;
  if (view === 'kb') return <KbScreen />;
  if (view === 'legal') return <LegalScreen />;
  if (step === 0) return <IntroScreen />;
  if (step === sections.length + 1) return <SummaryScreen />;
  return <SectionScreen step={step} />;
}

function AppShell() {
  const { width } = useWindowDimensions();
  const wide = width >= 980;
  const [drawer, setDrawer] = useState(false);
  if (wide) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Sidebar />
        <View style={{ flex: 1 }}><MainContent /></View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={st.topbar}>
        <Pressable onPress={() => setDrawer(true)} style={st.hamb}><Text style={{ fontSize: 18 }}>☰</Text></Pressable>
        <Text style={st.topTitle}>Founder’s workbook</Text>
      </View>
      <MainContent />
      <Modal visible={drawer} transparent animationType="fade" onRequestClose={() => setDrawer(false)}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Sidebar onNavigate={() => setDrawer(false)} />
          <Pressable style={st.scrim} onPress={() => setDrawer(false)} />
        </View>
      </Modal>
    </View>
  );
}

function Gate() {
  const { ready, authed, commitment, setCommitment, go } = useStore();
  if (!ready) return <Center><ActivityIndicator color={color.navy700} /></Center>;
  if (!authed) return <AuthFlow />;
  if (!commitment) return <CommitmentScreen onStart={(c) => { setCommitment(c); go(1); }} />;
  return <AppShell />;
}

const Center = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{children}</View>
);

export default function App() {
  const [loaded] = useFonts({
    SchibstedGrotesk_700Bold, SchibstedGrotesk_800ExtraBold,
    HankenGrotesk_400Regular, HankenGrotesk_500Medium, HankenGrotesk_600SemiBold,
    IBMPlexMono_500Medium,
  });
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: color.cream50 }}>
        <StatusBar style="dark" />
        {!loaded ? <Center><ActivityIndicator color={color.navy700} /></Center> : (
          <StoreProvider><Gate /></StoreProvider>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const st = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: color.borderSubtle, backgroundColor: color.white },
  hamb: { width: 42, height: 42, borderRadius: 10, borderWidth: 1, borderColor: color.borderDefault, alignItems: 'center', justifyC