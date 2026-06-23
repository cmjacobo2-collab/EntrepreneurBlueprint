import React, { useState } from 'react';
import { ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { color, font } from '../../theme/tokens';
import { Eyebrow, H1, Card, Muted } from '../../components/ui';
import { kbArticles } from '../../content';

export default function KbScreen() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ScrollView contentContainerStyle={st.wrap}>
      <Eyebrow>Knowledge base</Eyebrow>
      <H1 style={{ fontSize: 28, marginVertical: 12 }}>Questions, answered.</H1>
      {kbArticles.map((qa, i) => (
        <Pressable key={i} onPress={() => setOpen(open === i ? null : i)}>
          <Card style={{ marginBottom: 10 }}>
            <Text style={st.q}>{qa.q}</Text>
            {open === i && <Muted style={{ fontSize: 14, marginTop: 8 }}>{qa.a}</Muted>}
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  );
}
const st = StyleSheet.create({
  wrap: { padding: 22, maxWidth: 760, width: '100%', alignSelf: 'center' },
  q: { fontFamily: font.bodySemi, fontSize: 15, color: color.navy700 },
});
