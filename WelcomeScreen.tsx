import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { color, font } from '../../theme/tokens';
import { Eyebrow, H1, Card, Muted } from '../../components/ui';
import { howtoSteps } from '../../content';

export default function HowToScreen() {
  return (
    <ScrollView contentContainerStyle={st.wrap}>
      <Eyebrow>How to use the app</Eyebrow>
      <H1 style={{ fontSize: 28, marginVertical: 12 }}>Seven simple steps.</H1>
      {howtoSteps.map((s) => (
        <Card key={s.n} style={{ marginBottom: 12, flexDirection: 'row', gap: 14 }}>
          <View style={st.badge}><Text style={st.badgeText}>{s.n}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={st.title}>{s.title}</Text>
            <Muted style={{ fontSize: 14, marginTop: 4 }}>{s.body}</Muted>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}
const st = StyleSheet.create({
  wrap: { padding: 22, maxWidth: 760, width: '100%', alignSelf: 'center' },
  badge: { width: 32, height: 32, borderRadius: 999, backgroundColor: color.navy050, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: font.mono, fontSize: 13, color: color.navy700, fontWeight: '700' },
  title: { fontFamily: font.bodySemi, fontSize: 15, color: color.navy700 },
});
