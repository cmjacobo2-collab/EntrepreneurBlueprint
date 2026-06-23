import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { color, font, radius } from '../theme/tokens';
import { Button, H1, Tag } from '../components/ui';
import { Callout } from '../components/Callout';
import BlockRenderer from '../components/BlockRenderer';
import { Input } from '../components/ui';
import { useStore } from '../state/store';
import { sections, parts, decisionDefs, states } from '../content';
import type { Decision } from '../logic/types';

export default function SectionScreen({ step }: { step: number }) {
  const { answers, setAnswer, decision, setDecision, commitment, go } = useStore();
  const N = sections.length;
  const sec = sections[step - 1];
  const partMeta = parts.find((p) => p.part === sec.part)!;
  const stateInfo = commitment?.state ? states.find((x) => x.abbr === commitment.state) || null : null;

  const Bullets = ({ tag, items }: { tag: string; items: string[] }) => (
    <View style={{ marginVertical: 8 }}>
      <Tag>{tag}</Tag>
      {items.map((i, ix) => (
        <View key={ix} style={{ flexDirection: 'row', marginBottom: 5 }}>
          <Text style={{ color: color.gold600, marginRight: 8 }}>•</Text>
          <Text style={st.bul}>{i}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={st.wrap} keyboardShouldPersistTaps="handled">
      <View style={st.chipRow}>
        <Text style={st.chip}>Part {sec.part} · {partMeta.name}{sec.stage ? ` · ${sec.stage}` : ''}</Text>
        <Text style={st.count}>{step} / {N}</Text>
      </View>
      <H1 style={{ fontSize: 26, marginVertical: 4 }}>{sec.title}</H1>
      {!!sec.lead && <Text style={st.lead}>{sec.lead}</Text>}

      {!!sec.teach && <Text style={st.p}>{sec.teach}</Text>}
      {!!sec.learn && <Callout label="You’ll learn:" text={sec.learn} />}
      {!!sec.why && <Callout label="Why it matters:" text={sec.why} />}
      {!!sec.includes && <Bullets tag="Includes" items={sec.includes} />}
      {!!sec.whyItems && <Bullets tag="Why it matters" items={sec.whyItems} />}
      {!!sec.overlook && <Bullets tag="If you overlook it" items={sec.overlook} />}
      {!!sec.methods && <Bullets tag="Methods" items={sec.methods} />}
      {!!sec.mistakes && <Callout label="Common mistakes:" text={sec.mistakes} />}
      {!!sec.example && <Callout label="Example:" text={sec.example} />}
      {!!sec.quote && <Callout quote text={sec.quote} />}
      {!!sec.exercise && <Callout label="Exercise:" text={sec.exercise} />}

      {(sec.questions || []).map((q, i) => {
        const id = `${sec.id}q${i}`;
        return (
          <View key={i} style={{ marginVertical: 10 }}>
            <Text style={st.q}>{q}</Text>
            <Input multiline value={(answers[id] ?? '').toString()} onChangeText={(t) => setAnswer(id, t)} />
          </View>
        );
      })}

      {(sec.blocks || []).map((b, bi) => (
        <BlockRenderer key={bi} section={sec} block={b} bi={bi} answers={answers} setAnswer={setAnswer} stateInfo={stateInfo} />
      ))}

      {sec.isPledge && (
        <Pledge id={`${sec.id}pledge`} text={sec.pledge!} on={!!answers[`${sec.id}pledge`]} onToggle={() => setAnswer(`${sec.id}pledge`, !answers[`${sec.id}pledge`])} />
      )}

      {sec.isDecision && (
        <View style={{ marginTop: 18 }}>
          <Text style={[st.q, { fontSize: 17, marginBottom: 10 }]}>Your call</Text>
          {decisionDefs.map((d) => {
            const sel = decision === d.val;
            return (
              <View key={d.val} style={[st.dopt, sel && { borderColor: color.navy700, backgroundColor: color.cream100 }]}
                onTouchEnd={() => setDecision(d.val as Decision)}>
                <View style={[st.dot, sel && { backgroundColor: color.navy700, borderColor: color.navy700 }]} />
                <View style={{ flex: 1 }}>
                  <Text style={st.doptTitle}>{d.label}</Text>
                  <Text style={st.doptDesc}>{d.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View style={st.nav}>
        <Button title={step <= 1 ? 'Overview' : 'Previous'} variant="ghost" style={{ flex: 1 }} onPress={() => go(step <= 1 ? 0 : step - 1)} />
        <View style={{ width: 12 }} />
        <Button title={step === N ? 'Review & finish' : 'Next section'} style={{ flex: 1 }} onPress={() => go(step >= N ? N + 1 : step + 1)} />
      </View>
    </ScrollView>
  );
}

function Pledge({ id, text, on, onToggle }: { id: string; text: string; on: boolean; onToggle: () => void }) {
  return (
    <View style={[st.pledge, { borderColor: on ? color.forest600 : color.borderDefault, backgroundColor: on ? color.forest050 : color.white }]} onTouchEnd={onToggle}>
      <View style={[st.pledgeBox, { borderColor: on ? color.forest600 : color.borderStrong, backgroundColor: on ? color.forest600 : '#fff' }]}>
        {on && <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text>}
      </View>
      <Text style={st.pledgeText}>{text}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { padding: 22, paddingBottom: 80, maxWidth: 760, width: '100%', alignSelf: 'center' },
  chipRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  chip: { fontFamily: font.mono, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: color.ink500, backgroundColor: color.cream100, borderWidth: 1, borderColor: color.borderDefault, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, overflow: 'hidden' },
  count: { fontFamily: font.mono, fontSize: 11, color: color.textFaint },
  lead: { fontFamily: font.body, fontSize: 17, color: color.ink600, marginBottom: 12 },
  p: { fontFamily: font.body, fontSize: 16, color: color.ink700, lineHeight: 25, marginBottom: 12 },
  q: { fontFamily: font.bodySemi, fontSize: 15, color: color.navy700, marginBottom: 7 },
  bul: { flex: 1, fontFamily: font.body, fontSize: 15, color: color.ink700, lineHeight: 22 },
  dopt: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.md, backgroundColor: color.white, borderWidth: 1, borderColor: color.borderDefault, marginBottom: 10 },
  dot: { width: 20, height: 20, borderRadius: 999, borderWidth: 2, borderColor: color.borderStrong },
  doptTitle: { fontFamily: font.bodySemi, color: color.navy700, fontSize: 15 },
  doptDesc: { fontFamily: font.body, color: color.ink500, fontSize: 14 },
  pledge: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', borderWidth: 1.5, borderRadius: radius.lg, padding: 18, marginTop: 8 },
  pledgeBox: { width: 26, height: 26, borderRadius: 7, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  pledgeText: { flex: 1, fontFamily: font.bodySemi, fontSize: 16, color: color.navy700, lineHeight: 23 },
  nav: { flexDirection: 'row', marginTop: 28 },
});
