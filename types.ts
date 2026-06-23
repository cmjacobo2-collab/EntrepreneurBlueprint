import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { color, font, radius } from '../theme/tokens';

export function Callout({ label, text, quote }: { label?: string; text: string; quote?: boolean }) {
  return (
    <View style={[s.box, quote && s.quote]}>
      <Text style={quote ? s.quoteText : s.text}>
        {label ? <Text style={s.label}>{label} </Text> : null}{quote ? `“${text}”` : text}
      </Text>
    </View>
  );
}
const s = StyleSheet.create({
  box: { borderLeftWidth: 3, borderLeftColor: color.gold500, backgroundColor: color.gold050, padding: 14, borderTopRightRadius: radius.md, borderBottomRightRadius: radius.md, marginVertical: 10 },
  quote: { borderLeftColor: color.navy700, backgroundColor: color.cream100 },
  label: { fontFamily: font.bodySemi, color: color.navy700 },
  text: { fontFamily: font.body, fontSize: 15, color: color.ink700, lineHeight: 22 },
  quoteText: { fontFamily: font.display, fontSize: 17, color: color.navy700, lineHeight: 24 },
});
