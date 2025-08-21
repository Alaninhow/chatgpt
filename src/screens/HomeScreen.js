import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../ui';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 Home</Text>
      <Text style={[styles.text, { fontSize: 14, color: theme.colors.muted }]}>
        Você está logado!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' },
  text: { color: theme.colors.text, fontSize: 18, fontWeight: '700' },
});
