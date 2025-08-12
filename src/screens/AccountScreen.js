import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function AccountScreen() {
  const user = auth.currentUser;

  async function handleLogout() {
    try { await signOut(auth); Alert.alert('Você saiu'); }
    catch(e){ Alert.alert('Erro', e.message); }
  }

  return (
    <View style={s.c}>
      <Text style={s.t}>Minha Conta</Text>
      {user ? (
        <>
          <Text style={{ marginVertical: 8 }}>Email: {user.email}</Text>
          <Button title="Sair" onPress={handleLogout} />
        </>
      ) : <Text>Você não está logado</Text>}
    </View>
  );
}
const s = StyleSheet.create({ c:{flex:1,justifyContent:'center',alignItems:'center',padding:20}, t:{fontSize:22,fontWeight:'700',marginBottom:12} });
