import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title, Button, theme } from '../ui';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function ForgotPassword({ route, navigation }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (route?.params?.emailPrefill) setEmail(route.params.emailPrefill);
  }, [route?.params?.emailPrefill]);

  async function handleReset() {
    try {
      if (!email) return Alert.alert('Atenção', 'Informe seu e-mail.');
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Pronto!', 'Enviamos um link de redefinição para o seu e-mail.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Não foi possível enviar o e-mail de redefinição.');
    }
  }

  return (
    <SafeAreaView style={styles.safeRoot} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card style={styles.card}>
            <Title>Redefinir senha</Title>
            <Text style={styles.text}>Informe o e-mail cadastrado para enviarmos o link de redefinição.</Text>

            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={18} color={theme.colors.muted} style={{ marginRight: 8 }} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="voce@exemplo.com"
                placeholderTextColor={theme.colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <Button label="Enviar link" onPress={handleReset} style={{ marginTop: theme.spacing(2) }} />
            <Button label="Voltar" onPress={() => navigation.goBack()} style={{ marginTop: theme.spacing(1) }} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeRoot: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(6),
    gap: theme.spacing(2),
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: { width: '100%', maxWidth: 520, alignSelf: 'center' },
  text: { color: theme.colors.muted, marginTop: theme.spacing(1) },
  inputWrapper: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: theme.radius.md, paddingVertical: 10, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing(2),
  },
  input: { flex: 1, color: theme.colors.text, fontSize: theme.typography.body },
});
