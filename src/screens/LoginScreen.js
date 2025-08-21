import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Card, Title, Button, theme } from '../ui';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const STORAGE_EMAIL_KEY = '@login_email';
const STORAGE_REMEMBER_KEY = '@login_remember';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, senha: false });
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [storedEmail, storedRemember] = await Promise.all([
          AsyncStorage.getItem(STORAGE_EMAIL_KEY),
          AsyncStorage.getItem(STORAGE_REMEMBER_KEY),
        ]);
        if (storedRemember !== null) setRemember(storedRemember === 'true');
        if (storedEmail && storedRemember === 'true') setEmail(storedEmail);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_REMEMBER_KEY, String(remember));
        if (!remember) await AsyncStorage.removeItem(STORAGE_EMAIL_KEY);
        else if (email) await AsyncStorage.setItem(STORAGE_EMAIL_KEY, email);
      } catch {}
    })();
  }, [remember]);

  useEffect(() => {
    (async () => {
      try {
        if (remember) {
          if (email) await AsyncStorage.setItem(STORAGE_EMAIL_KEY, email);
          else await AsyncStorage.removeItem(STORAGE_EMAIL_KEY);
        }
      } catch {}
    })();
  }, [email, remember]);

  const emailError = useMemo(() => {
    if (!touched.email) return '';
    if (!email) return 'Informe seu e-mail';
    if (!emailRegex.test(email)) return 'Formato de e-mail inválido';
    return '';
  }, [email, touched.email]);

  const pwdError = useMemo(() => {
    if (!touched.senha) return '';
    if (!senha) return 'Informe sua senha';
    if (senha.length < 6) return 'A senha deve ter pelo menos 6 caracteres';
    return '';
  }, [senha, touched.senha]);

  const formValid = !emailError && !pwdError && email && senha;

  async function handleLogin() {
    try {
      setTouched({ email: true, senha: true });
      setError('');
      if (!formValid) return;
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, senha);
      if (remember && email) await AsyncStorage.setItem(STORAGE_EMAIL_KEY, email);
      navigation?.replace?.('Home');
    } catch (e) {
      const msg = e?.message || 'Falha no login. Verifique suas credenciais.';
      setError(msg);
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  function handleForgot() {
    navigation?.navigate?.('ForgotPassword', { emailPrefill: email || '' });
  }
  function handleSignUp() {
    navigation?.navigate?.('SignUp', { emailPrefill: email || '' });
  }

  return (
    <SafeAreaView style={styles.safeRoot} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[theme.colors.background, '#0B1222', '#0A0F1A']}
        style={styles.hero}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Ionicons name="chatbubbles" size={26} color="#fff" />
          </View>
          <Text style={styles.brand}>Recanto</Text>
        </View>
        <Text style={styles.heroTitle}>Bem-vindo de volta</Text>
        <Text style={styles.heroSubtitle}>Acesse sua conta para continuar</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 12, android: 0 })}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.card}>
            <Title style={styles.cardTitle}>Login</Title>

            {/* E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
                <Ionicons name="mail" size={18} color={theme.colors.muted} style={styles.leftIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  placeholder="voce@exemplo.com"
                  placeholderTextColor={theme.colors.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  returnKeyType="next"
                />
              </View>
              {!!emailError && <Text style={styles.helperText}>{emailError}</Text>}
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={[styles.inputWrapper, pwdError ? styles.inputError : null]}>
                <Ionicons name="lock-closed" size={18} color={theme.colors.muted} style={styles.leftIcon} />
                <TextInput
                  value={senha}
                  onChangeText={setSenha}
                  onBlur={() => setTouched(t => ({ ...t, senha: true }))}
                  placeholder="Sua senha"
                  placeholderTextColor={theme.colors.muted}
                  secureTextEntry={!showPwd}
                  style={styles.input}
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPwd(s => !s)}
                  style={styles.rightIconBtn}
                  accessibilityLabel={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <Ionicons name={showPwd ? 'eye-off' : 'eye'} size={18} color={theme.colors.muted} />
                </TouchableOpacity>
              </View>
              {!!pwdError && <Text style={styles.helperText}>{pwdError}</Text>}
            </View>

            {/* Opções */}
            <View style={styles.rowBetween}>
              <View style={styles.row}>
                <Switch
                  value={remember}
                  onValueChange={setRemember}
                  thumbColor={remember ? theme.colors.primary : '#ccc'}
                  trackColor={{ true: '#3b82f64d', false: '#00000020' }}
                />
                <Text style={styles.switchLabel}>Lembrar-me</Text>
              </View>
              <TouchableOpacity onPress={handleForgot}>
                <Text style={styles.link}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </View>

            {/* Entrar */}
            <Button
              label={loading ? '' : 'Entrar'}
              onPress={handleLogin}
              style={[styles.submitBtn, !formValid && styles.btnDisabled]}
              textStyle={{ fontWeight: '700' }}
              disabled={!formValid || loading}
            />
            {loading && <ActivityIndicator style={{ marginTop: -32, marginBottom: 8 }} />}

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            {/* Cadastro */}
            <View style={[styles.rowCenter, { marginTop: theme.spacing(2) }]}>
              <Text style={{ color: theme.colors.muted }}>Novo por aqui? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.link}>Crie sua conta</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Informativo */}
          <View style={styles.infoStrip}>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark" size={18} />
              <Text style={styles.infoText}>Autenticação segura</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="lock-closed" size={18} />
              <Text style={styles.infoText}>Dados criptografados</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={18} />
              <Text style={styles.infoText}>Acesso rápido</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeRoot: { flex: 1, backgroundColor: theme.colors.background },

  hero: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: theme.spacing(2),
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing(1) },
  logoCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#ffffff22',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
    borderWidth: 1, borderColor: '#ffffff33',
  },
  brand: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  heroSubtitle: { color: theme.colors.muted, fontSize: 13 },

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
  cardTitle: { marginBottom: theme.spacing(1) },

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
  inputError: { borderColor: theme.colors.danger },
  leftIcon: { marginRight: 8 },
  rightIconBtn: { padding: 6, marginLeft: 6 },
  input: { flex: 1, color: theme.colors.text, fontSize: theme.typography.body, paddingVertical: 0 },
  helperText: { color: theme.colors.danger, fontSize: 12, marginTop: 6 },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: theme.spacing(1) },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },

  switchLabel: { color: theme.colors.text, marginLeft: 8 },
  link: { color: theme.colors.primary, fontWeight: '700' },

  submitBtn: { marginTop: theme.spacing(2) },
  btnDisabled: { opacity: 0.5 },
  errorText: { color: theme.colors.danger, marginTop: theme.spacing(1) },

  infoStrip: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: theme.spacing(1.5),
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#0e1629',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { color: theme.colors.muted, fontSize: 12 },
});
