import themeBase from '../theme';
const theme = themeBase || { colors: {}, radius: 12, spacing: 12 };
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({ title, onPress, icon, style, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      disabled={disabled}
      style={[styles.btn, disabled && { opacity: 0.6 }, style]}
    >
      {icon ? <Ionicons name={icon} size={18} color="#fff" style={{ marginRight: 8 }} /> : null}
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Chip({ text, tone = 'default', style }) {
  const colors = {
    default: { bc: theme.colors.border, fg: theme.colors.subtext },
    success: { bc: theme.colors.success, fg: theme.colors.success },
    danger: { bc: theme.colors.danger, fg: theme.colors.danger },
    warning: { bc: theme.colors.warning, fg: theme.colors.warning },
  };
  const c = colors[tone] || colors.default;
  return (
    <View style={[styles.chip, { borderColor: c.bc, backgroundColor: c.fg + '22' }, style]}>
      <Text style={{ color: c.fg, fontWeight: '700', fontSize: 12 }}>{text}</Text>
    </View>
  );
}

export function Row({ left, right }) {
  return (
    <View style={styles.row}>
      <Text style={styles.left}>{left}</Text>
      <Text style={styles.right}>{right}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius,
    padding: theme.spacing,
  },
  btn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  btnText: { color: '#fff', fontWeight: '700' },
  chip: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  row: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    paddingBottom: 6,
  },
  left: { color: theme.colors.subtext, fontSize: 13 },
  right: { color: theme.colors.text, fontSize: 14, fontWeight: '600' },
});
