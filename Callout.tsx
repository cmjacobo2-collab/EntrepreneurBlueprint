import React from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { color, radius, font, shadow } from '../theme/tokens';

export const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.eyebrow}>{children}</Text>
);
export const Tag = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.tag}>{children}</Text>
);
export const H1 = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.h1, style]}>{children}</Text>
);
export const Body = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.body, style]}>{children}</Text>
);
export const Muted = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.muted, style]}>{children}</Text>
);

export const Card = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export function Button({ title, onPress, variant = 'primary', disabled, style }:
  { title: string; onPress?: () => void; variant?: 'primary' | 'ghost' | 'gold'; disabled?: boolean; style?: ViewStyle }) {
  const bg = variant === 'primary' ? color.navy700 : variant === 'gold' ? color.gold500 : 'transparent';
  const fg = variant === 'gold' ? color.navy900 : variant === 'ghost' ? color.navy700 : color.white;
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.45 : 1, transform: [{ translateY: pressed ? 1 : 0 }] },
        variant === 'ghost' && { borderWidth: 1, borderColor: color.borderStrong },
        style,
      ]}>
      <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.fldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export function Input(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput placeholderTextColor={color.textFaint} {...props} style={[styles.input, props.multiline && styles.textarea, props.style]} />;
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle} style={[styles.toggle, { backgroundColor: on ? color.forest600 : color.borderStrong }]}>
      <View style={[styles.knob, { left: on ? 23 : 3 }]} />
    </Pressable>
  );
}

export function ProgressRing({ pct, size = 120 }: { pct: number; size?: number }) {
  const r = 54; const C = 2 * Math.PI * r; // ~339.292
  const off = C * (1 - pct / 100);
  const cx = 60, cy = 60;
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={color.cream100} strokeWidth={9} />
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={color.forest600} strokeWidth={9}
        strokeLinecap="round" strokeDasharray={`${C}`} strokeDashoffset={off}
        transform={`rotate(-90 ${cx} ${cy})`} />
      <SvgText x={cx} y={cy + 4} textAnchor="middle" fontSize={26} fontWeight="800" fill={color.navy700} fontFamily={font.display}>{`${pct}%`}</SvgText>
      <SvgText x={cx} y={cy + 20} textAnchor="middle" fontSize={9} fill={color.ink500} fontFamily={font.mono}>COMPLETE</SvgText>
    </Svg>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  return (
    <View style={styles.pbar}><View style={[styles.pbarFill, { width: `${pct}%` }]} /></View>
  );
}

export const styles = StyleSheet.create({
  eyebrow: { fontFamily: font.mono, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: color.gold700 },
  tag: { fontFamily: font.mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: color.gold700, marginBottom: 6 },
  h1: { fontFamily: font.display, fontSize: 28, color: color.navy700, letterSpacing: -0.5 },
  body: { fontFamily: font.body, fontSize: 16, lineHeight: 25, color: color.ink700 },
  muted: { fontFamily: font.body, fontSize: 15, lineHeight: 23, color: color.ink500 },
  card: { backgroundColor: color.white, borderWidth: 1, borderColor: color.borderSubtle, borderRadius: radius.lg, padding: 18, ...shadow.card },
  btn: { height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  btnText: { fontFamily: font.bodySemi, fontSize: 15 },
  fldLabel: { fontFamily: font.bodySemi, fontSize: 13, color: color.ink700, marginBottom: 6 },
  input: { fontFamily: font.body, fontSize: 15, color: color.ink900, backgroundColor: color.white, borderWidth: 1, borderColor: color.borderDefault, borderRadius: radius.md, paddingHorizontal: 13, paddingVertical: 12 },
  textarea: { minHeight: 84, textAlignVertical: 'top' },
  toggle: { width: 46, height: 26, borderRadius: 999, justifyContent: 'center' },
  knob: { position: 'absolute', top: 3, width: 20, height: 20, borderRadius: 999, backgroundColor: '#fff' },
  pbar: { height: 5, borderRadius: 999, backgroundColor: color.cream100, overflow: 'hidden', marginTop: 7 },
  pbarFill: { height: '100%', backgroundColor: color.forest600 },
});
