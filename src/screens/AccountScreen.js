import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function AccountScreen() {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Sucesso', 'Você saiu da conta');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Conta</Text>
      {user ? (
        <>
          <Text>Email: {user.email}</Text>
          <Button title="Sair" onPress={handleLogout} />
        </>
      ) : (
        <Text>Você não está logado</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
