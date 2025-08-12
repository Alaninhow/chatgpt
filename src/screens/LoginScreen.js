import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function onLogin() {
    try { await signInWithEmailAndPassword(auth, email.trim(), senha); }
    catch (e) { Alert.alert('Erro', e.message); }
  }
  async function onRegister() {
    try { await createUserWithEmailAndPassword(auth, email.trim(), senha); }
    catch (e) { Alert.alert('Erro', e.message); }
  }

  return (
    <View style={s.c}>
      <Text style={s.t}>Login</Text>
      <TextInput style={s.i} placeholder="email" autoCapitalize="none" onChangeText={setEmail} value={email} />
      <TextInput style={s.i} placeholder="senha" secureTextEntry onChangeText={setSenha} value={senha} />
      <Button title="Entrar" onPress={onLogin} />
      <View style={{ height: 8 }} />
      <Button title="Criar conta" onPress={onRegister} />
    </View>
  );
}
const s = StyleSheet.create({ c:{flex:1,justifyContent:'center',padding:20}, t:{fontSize:22,fontWeight:'700',marginBottom:12}, i:{borderWidth:1,padding:10,marginBottom:10,borderRadius:6} });
