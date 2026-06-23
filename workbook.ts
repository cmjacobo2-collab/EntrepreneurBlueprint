import React from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { color, font, radius } from '../theme/tokens';
import { Input, Tag, Card, Muted } from './ui';
import type { Block, Section, Answers, StateInfo } from '../logic/types';

interface Props {
  section: Section;
  block: Block;
  bi: number;
  answers: Answers;
  setAnswer: (id: string, val: string | boolean | number) => void;
  stateInfo: StateInfo | null;
}

export default function BlockRenderer({ section, block: b, bi, answers: A, setAnswer, stateInfo }: Props) {
  const k = (ii: number | string) => `${section.id}:${bi}:${ii}`;
  const str = (key: string) => (A[key] ?? '').toString();

  const Label = b.label ? <Tag>{b.label}</Tag> : null;

  switch (b.t) {
    case 'points':
    case 'avoid':
    case 'resources':
      return <View style={s.block}>{Label}{(b.items || []).map((i, ix) => <Bullet key={ix} text={i} />)}</View>;
    case 'timeline':
    case 'steps':
      return <View style={s.block}>{Label}{(b.items || []).map((i, ix) => <Bullet key={ix} text={`${ix + 1}. ${i}`} />)}</View>;
    case 'note':
      return <View style={s.block}>{Label}<View style={s.note}><Text style={s.noteText}>{b.text || (b.items || []).join(' ')}</Text></View></View>;
    case 'fields':
      return <View style={s.block}>{Label}{(b.items || []).map((q, ii) => (
        <View key={ii} style={{ marginBottom: 12 }}>
          <Text style={s.q}>{q}</Text>
          <Input multiline value={str(k(ii))} onChangeText={(t) => setAnswer(k(ii), t)} />
        </View>
      ))}</View>;
    case 'numbered': {
      const cnt = b.count ?? (b.items ? b.items.length : 0);
      return <View style={s.block}>{Label}{Array.from({ length: cnt }).map((_, ii) => (
        <View key={ii} style={{ marginBottom: 12 }}>
          <Text style={s.q}>{`${ii + 1}. ${b.items ? b.items[ii] || '' : ''}`}</Text>
          <Input multiline value={str(k(ii))} onChangeText={(t) => setAnswer(k(ii), t)} />
        </View>
      ))}</View>;
    }
    case 'rating':
      return <View style={s.block}>{Label}{(b.items || []).map((q, ii) => (
        <View key={ii} style={s.ratingRow}>
          <Text style={s.ratingLabel}>{q}</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const sel = String(A[k(ii)]) === String(n);
              return (
                <Pressable key={n} onPress={() => setAnswer(k(ii), n)}
                  style={[s.rateBtn, sel ? { backgroundColor: color.navy700 } : { borderWidth: 1, borderColor: color.borderStrong }]}>
                  <Text style={{ color: sel ? '#fff' : color.ink600, fontFamily: font.bodySemi }}>{n}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}</View>;
    case 'checks':
      return <View style={s.block}>{Label}{(b.items || []).map((q, ii) => (
        <Check key={ii} on={!!A[k(ii)]} label={q} onPress={() => setAnswer(k(ii), !A[k(ii)])} />
      ))}</View>;
    case 'mark':
      return <View style={s.block}>{Label}<Check on={!!A[k(0)]} label={(b.items && b.items[0]) || b.text || 'Mark complete'} onPress={() => setAnswer(k(0), !A[k(0)])} /></View>;
    case 'table': {
      const cols = b.columns || []; const rows = b.rows || 0;
      return (
        <View style={s.block}>{Label}
          <View style={s.table}>
            <View style={[s.tr, { backgroundColor: color.cream100 }]}>
              {cols.map((c, ci) => <Text key={ci} style={[s.th, { flex: 1 }]}>{c}</Text>)}
            </View>
            {Array.from({ length: rows }).map((_, r) => (
              <View key={r} style={s.tr}>
                {cols.map((_, ci) => (
                  <View key={ci} style={[s.td, { flex: 1 }]}>
                    <Input value={str(`${section.id}:${bi}:${r}:${ci}`)} onChangeText={(t) => setAnswer(`${section.id}:${bi}:${r}:${ci}`, t)} style={{ borderWidth: 0, borderRadius: 0, paddingVertical: 8 }} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      );
    }
    case 'statelinks':
      if (!stateInfo) return <NoState />;
      return (
        <View style={s.block}>{Label}
          <Card>
            <Text style={s.linkName}>{stateInfo.regName}</Text>
            <Text style={s.link} onPress={() => Linking.openURL(stateInfo.regUrl)}>{stateInfo.regUrl}</Text>
            <Text style={[s.linkName, { marginTop: 10 }]}>{stateInfo.taxName}</Text>
            <Text style={s.link} onPress={() => Linking.openURL(stateInfo.taxUrl)}>{stateInfo.taxUrl}</Text>
          </Card>
        </View>
      );
    case 'statecost':
    case 'costs':
      if (!stateInfo) return <NoState />;
      return (
        <View style={s.block}>{Label}
          <Card>
            <CostRow k={`LLC filing (${stateInfo.name})`} v={stateInfo.cost.llc} />
            <CostRow k="DBA" v={stateInfo.cost.dbaCost} />
            <CostRow k={stateInfo.cost.salesLabel} v={stateInfo.cost.salesCost} />
            {!!stateInfo.cost.note && <View style={s.note}><Text style={s.noteText}>{stateInfo.cost.note}</Text></View>}
          </Card>
        </View>
      );
    default:
      return <View style={s.block}>{Label}{(b.items || []).map((i, ix) => <Bullet key={ix} text={i} />)}</View>;
  }
}

const Bullet = ({ text }: { text: string }) => (
  <View style={{ flexDirection: 'row', marginBottom: 5 }}>
    <Text style={{ color: color.gold600, marginRight: 8 }}>•</Text>
    <Text style={s.bulletText}>{text}</Text>
  </View>
);
const Check = ({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={s.checkRow}>
    <View style={[s.checkBox, { borderColor: on ? color.forest600 : color.borderStrong, backgroundColor: on ? color.forest600 : '#fff' }]}>
      {on && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
    </View>
    <Text style={s.checkLabel}>{label}</Text>
  </Pressable>
);
const NoState = () => (
  <View style={s.block}><View style={s.note}><Text style={s.noteText}>Choose your state on the commitment screen to see state-specific costs and official links.</Text></View></View>
);
const CostRow = ({ k, v }: { k: string; v: string }) => (
  <View style={s.costRow}><Muted style={{ flex: 1 }}>{k}</Muted><Text style={s.costVal}>{v}</Text></View>
);

const s = StyleSheet.create({
  block: { marginVertical: 14 },
  q: { fontFamily: font.bodySemi, fontSize: 15, color: color.navy700, marginBottom: 7 },
  bulletText: { flex: 1, fontFamily: font.body, fontSize: 15, color: color.ink700, lineHeight: 22 },
  note: { backgroundColor: color.cream100, borderWidth: 1, borderColor: color.borderDefault, borderRadius: radius.md, padding: 14, marginTop: 8 },
  noteText: { fontFamily: font.body, fontSize: 14, color: color.ink700, lineHeight: 21 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: color.borderSubtle },
  ratingLabel: { flex: 1, fontFamily: font.body, fontSize: 14, color: color.ink700 },
  rateBtn: { width: 38, height: 38, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  checkRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: color.borderDefault, borderRadius: radius.sm, padding: 10, marginBottom: 6, gap: 10 },
  checkBox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkLabel: { flex: 1, fontFamily: font.body, fontSize: 14, color: color.ink700 },
  table: { borderWidth: 1, borderColor: color.borderDefault, borderRadius: radius.sm, overflow: 'hidden' },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: color.borderDefault },
  th: { fontFamily: font.mono, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: color.ink600, padding: 8 },
  td: { borderLeftWidth: 1, borderLeftColor: color.borderDefault },
  linkName: { fontFamily: font.bodySemi, fontSize: 14, color: color.navy700 },
  link: { fontFamily: font.body, fontSize: 13, color: color.navy600, textDecorationLine: 'underline' },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  costVal: { fontFamily: font.bodySemi, fontSize: 14, color: color.navy700 },
});
