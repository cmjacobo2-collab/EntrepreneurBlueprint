import React from 'react';
import { ScrollView, Text, Linking, StyleSheet } from 'react-native';
import { color, font } from '../../theme/tokens';
import { Eyebrow, H1, Muted, Button } from '../../components/ui';
import { useStore } from '../../state/store';

export default function ConsultScreen() {
  const { account } = useStore();
  const a = account!;
  const subject = `One-on-one consultation request — ${a.businessName || 'New client'}`;
  const body = [
    'Hi Across the Table,', '', 'I’d like to book a one-on-one consultation. Here are my details:', '',
    `Name: ${a.fullName}`, `Business name: ${a.businessName}`, `Industry: ${a.industry}`,
    `Business type: ${a.bizType}`, `Email: ${a.email}`, `Account #: ${a.accountNo}`,
    '', 'A few things I’d like help with:', '• ', '', 'Thank you,', a.fullName,
  ].join('\n');
  const href = `mailto:info@acrossthetable.biz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return (
    <ScrollView contentContainerStyle={st.wrap}>
      <Eyebrow>Book a consultation</Eyebrow>
      <H1 style={{ fontSize: 28, marginVertical: 8 }}>Sometimes you want a real person across the table.</H1>
      <Muted>One-on-one help tailored to your business. Tap below and we’ll pre-fill your details and account number.</Muted>
      <Button title="Request a consultation" variant="gold" style={{ marginVertical: 18, alignSelf: 'flex-start', paddingHorizontal: 24 }} onPress={() => Linking.openURL(href)} />
      <Text style={st.link} onPress={() => Linking.openURL('https://AcrosstheTable.biz')}>AcrosstheTable.biz</Text>
    </ScrollView>
  );
}
const st = StyleSheet.create({
  wrap: { padding: 22, maxWidth: 760, width: '100%', alignSelf: 'center' },
  link: { fontFamily: font.body, fontSize: 14, color: color.navy600, textDecorationLine: 'underline' },
});
