import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { color, font, radius } from '../theme/tokens';
import { useStore } from '../state/store';
import { sections, parts } from '../content';
import { isDone, pad2 } from '../logic/workbook';

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { step, view, answers, decision, openPart, setOpenPart, go, openView, resetWorkbook, account, logout } = useStore();
  const curPart = step >= 1 && step <= sections.length ? sections[step - 1].part : null;
  const effectiveOpen = openPart != null ? openPart : curPart;
  const nav = (fn: () => void) => () => { fn(); onNavigate?.(); };

  return (
    <View style={st.aside}>
      <View style={st.head}>
        <View style={st.logoRow}><View style={st.mk}><Text style={{ color: '#fff' }}>▦</Text></View><Text style={st.logo}>Across the Table</Text></View>
        <Text style={st.eyebrow}>FOUNDER’S WORKBOOK</Text>
      </View>
      <ScrollView style={st.nav}>
        <Row active={step === 0 && !view} label="Overview" onPress={nav(() => go(0))} />
        {parts.map((p) => {
          const secs = sections.map((s, i) => ({ s, i })).filter((x) => x.s.part === p.part);
          const done = secs.filter((x) => isDone(x.s, answers, decision)).length;
          const expanded = effectiveOpen === p.part;
          const complete = done === secs.length;
          return (
            <View key={p.part}>
              <Pressable onPress={() => setOpenPart(expanded ? -1 : p.part)} style={[st.ph, expanded && { backgroundColor: color.cream100 }]}>
                <View style={[st.badge, complete && { backgroundColor: color.forest600 }]}>
                  <Text style={[st.badgeText, complete && { color: '#fff' }]}>{complete ? '✓' : p.part}</Text>
                </View>
                <Text style={st.pname}>{p.name}</Text>
                <Text style={st.pcount}>{done}/{secs.length}</Text>
              </Pressable>
              {expanded && secs.map((x, n) => {
                const stepN = x.i + 1; const d = isDone(x.s, answers, decision); const cur = stepN === step;
                return (
                  <Pressable key={x.s.id} onPress={nav(() => go(stepN))} style={[st.srow, cur && { backgroundColor: color.cream100 }]}>
                    <View style={[st.circle, cur && st.circleCur, d && !cur && st.circleDone]}>
                      <Text style={[st.circleText, cur && { color: '#fff' }, d && !cur && { color: color.forest600 }]}>{d && !cur ? '✓' : pad2(n + 1)}</Text>
                    </View>
                    <Text style={[st.stitle, cur && { color: color.navy700, fontFamily: font.bodySemi }]}>{x.s.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          );
        })}

        <View style={st.group}>
          <ResRow active={view === 'consult'} label="Book a consultation" onPress={nav(() => openView('consult'))} />
          <ResRow active={view === 'howto'} label="How to use the app" onPress={nav(() => openView('howto'))} />
          <ResRow active={view === 'kb'} label="Knowledge base" onPress={nav(() => openView('kb'))} />
          <ResRow active={view === 'legal'} label="Legal & licensing" onPress={nav(() => openView('legal'))} />
        </View>
        <View style={st.group}>
          <Pressable onPress={() => Linking.openURL('https://AcrosstheTable.biz')} style={st.res}><Text style={st.resText}>AcrosstheTable.biz ↗</Text></Pressable>
          <Pressable onPress={nav(() => resetWorkbook())} style={st.res}><Text style={[st.resText, { color: color.red600 }]}>Start over</Text></Pressable>
        </View>
        <View style={[st.group, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }]}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={st.acctName}>{account?.fullName}</Text>
            <Text numberOfLines={1} style={st.pcount}>{account?.email}</Text>
          </View>
          <Pressable onPress={nav(() => logout())} style={st.res}><Text style={[st.resText, { color: color.navy600 }]}>Log out</Text></Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const Row = ({ active, label, onPress }: any) => (
  <Pressable onPress={onPress} style={[st.res, active && { backgroundColor: color.cream100 }]}><Text style={[st.resText, active && { color: color.navy700 }]}>{label}</Text></Pressable>
);
const ResRow = Row;

const st = StyleSheet.create({
  aside: { width: 300, backgroundColor: color.white, borderRightWidth: 1, borderRightColor: color.borderSubtle, height: '100%' },
  head: { padding: 18, paddingBottom: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mk: { width: 26, height: 26, borderRadius: 7, backgroundColor: color.navy700, alignItems: 'center', justifyContent: 'center' },
  logo: { fontFamily: font.display, fontSize: 17, color: color.navy700 },
  eyebrow: { fontFamily: font.mono, fontSize: 10, letterSpacing: 1.3, color: color.gold700, marginTop: 5 },
  nav: { paddingHorizontal: 12, paddingBottom: 20 },
  ph: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 11, borderRadius: radius.md },
  badge: { width: 26, height: 26, borderRadius: 999, backgroundColor: color.navy050, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: font.mono, fontSize: 11, color: color.navy700, fontWeight: '700' },
  pname: { flex: 1, fontFamily: font.bodySemi, fontSize: 13, color: color.navy700 },
  pcount: { fontFamily: font.mono, fontSize: 10, color: color.textFaint },
  srow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 8, paddingLeft: 16, paddingRight: 10, borderRadius: radius.sm },
  circle: { width: 22, height: 22, borderRadius: 999, borderWidth: 1, borderColor: color.borderDefault, alignItems: 'center', justifyContent: 'center' },
  circleCur: { backgroundColor: color.navy700, borderColor: color.navy700 },
  circleDone: { backgroundColor: color.forest050, borderColor: color.forest100 },
  circleText: { fontFamily: font.mono, fontSize: 10, color: color.textFaint },
  stitle: { flex: 1, fontFamily: font.bodyMed, fontSize: 13, color: color.ink600 },
  group: { marginTop: 14, borderTopWidth: 1, borderTopColor: color.borderSubtle, paddingTop: 10 },
  res: { padding: 10, borderRadius: radius.sm },
  resText: { fontFamily: font.bodySemi, fontSize: 13, color: color.ink600 },
  acctName: { fontFamily: font.bodySemi, fontSize: 12, color: color.navy700 },
});
