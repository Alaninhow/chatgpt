import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert,
  ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title, Button, theme } from '../ui';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function SignUp({ route, navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(route?.params?.emailPrefill || '');
  const [senha, setSenha] = useState('');
  const [confirm, setConfirm] = useState('');

  const { width } = useWindowDimensions();
  const isWide = width >= 640; // breakpoint simples

  async function handleSignUp() {
    try {
      if (!email || !senha || !confirm) return Alert.alert('Atenção', 'Preencha todos os campos.');
      if (senha.length < 6) return Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      if (senha !== confirm) return Alert.alert('Atenção', 'As senhas não conferem.');
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      if (name) await updateProfile(cred.user, { displayName: name });
      Alert.alert('Sucesso!', 'Conta criada com sucesso.');
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Erro ao criar conta', e?.message || 'Tente novamente.');
    }
  }

  return (
    <SafeAreaView style={styles.safeRoot} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 12, android: 0 })}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card do formulário */}
          <Card style={styles.card}>
            <Title style={{ marginBottom: theme.spacing(1) }}>Criar conta</Title>
            <Text style={styles.text}>Preencha seus dados para começar.</Text>

            <LabeledInput
              icon="person" label="Nome (opcional)" value={name} onChangeText={setName}
              placeholder="Seu nome"
            />
            <LabeledInput
              icon="mail" label="E-mail" value={email} onChangeText={setEmail}
              placeholder="voce@exemplo.com" keyboardType="email-address" autoCapitalize="none"
            />
            <LabeledInput
              icon="lock-closed" label="Senha" value={senha} onChangeText={setSenha}
              placeholder="Crie uma senha" secureTextEntry
            />
            <LabeledInput
              icon="lock-closed" label="Confirmar senha" value={confirm} onChangeText={setConfirm}
              placeholder="Repita a senha" secureTextEntry
            />

            <Button label="Cadastrar" onPress={handleSignUp} style={{ marginTop: theme.spacing(2) }} />
            <Button label="Já tenho conta" onPress={() => navigation.replace('Login')} style={{ marginTop: theme.spacing(1) }} />
          </Card>

          {/* Rodapé: apenas 2 itens, sem “Acesso rápido” */}
          <View
            style={[
              styles.footerGrid,
              { flexDirection: isWide ? 'row' : 'column' }
            ]}
          >
            <FooterItem
              icon="shield-checkmark"
              title="Autenticação segura"
              text="Padrões modernos de segurança para proteger sua conta."
              isWide={isWide}
            />
            <FooterItem
              icon="lock-closed"
              title="Dados criptografados"
              text="Informações trafegam com criptografia ponta a ponta."
              isWide={isWide}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function LabeledInput({ icon, label, style, ...props }) {
  return (
    <View style={[styles.inputGroup, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={18} color={theme.colors.muted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.muted}
          {...props}
        />
      </View>
    </View>
  );
}

function FooterItem({ icon, title, text, isWide }) {
  return (
    <View
      style={[
        styles.footerItem,
        isWide ? { flexBasis: '49%' } : { width: '100%' } // 2 colunas no wide, 1 coluna no mobile
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <Ionicons name={icon} size={18} color={theme.colors.text} style={{ marginRight: 8 }} />
        <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{title}</Text>
      </View>
      <Text style={{ color: theme.colors.muted, fontSize: 12, lineHeight: 18 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeRoot: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(6),
    gap: theme.spacing(2),
    flexGrow: 1,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    gap: theme.spacing(1.5),
  },
  text: { color: theme.colors.muted, marginTop: theme.spacing(1) },

  inputGroup: { marginTop: theme.spacing(1) },
  label: { color: theme.colors.muted, fontSize: 13, marginBottom: 6 },
  inputWrapper: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, color: theme.colors.text, fontSize: theme.typography.body },

  footerGrid: {
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
    padding: theme.spacing(1.5),
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#0e1629',
    marginTop: theme.spacing(1.5),
  },
  footerItem: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing(1.5),
  },
});
