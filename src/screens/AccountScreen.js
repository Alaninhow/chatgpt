import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import theme from '../theme';
import { Card, PrimaryButton, Row } from '../ui';

export default function AccountScreen() {
  const user = auth.currentUser;
  const meta = user?.metadata;
  const last = meta?.lastSignInTime ? new Date(meta.lastSignInTime).toLocaleString() : '—';
  const created = meta?.creationTime ? new Date(meta.creationTime).toLocaleString() : '—';

  async function handleLogout() {
    try { await signOut(auth); Alert.alert('Você saiu'); }
    catch (e) { Alert.alert('Erro', e.message); }
  }

  return (
    <View style={s.screen}>
      <Text style={s.title}>Minha Conta</Text>

      <Card style={{ marginTop: 12 }}>
        <Row left="Email" right={user?.email || '—'} />
        <Row left="UID" right={user?.uid || '—'} />
        <Row left="Criado em" right={created} />
        <Row left="Último login" right={last} />
        <PrimaryButton title="Sair" icon="log-out" onPress={handleLogout} style={{ marginTop: 12 }} />
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '800' },
});
