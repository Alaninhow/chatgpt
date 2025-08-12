import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { createTicket } from '../services/tickets';

export default function BuyTicketScreen() {
  const [tipo, setTipo] = useState('Adulto');

  const handleBuy = async () => {
    try {
      if (!auth.currentUser) {
        Alert.alert('Erro', 'Você precisa estar logado para comprar');
        return;
      }
      await createTicket({ ownerUid: auth.currentUser.uid, type: tipo, price: 50, validUntilMillis: Date.now() + 86400000 });
      Alert.alert('Sucesso', 'Ticket gerado com QR Code!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comprar Ticket</Text>
      <Button title="Comprar Adulto" onPress={() => { setTipo('Adulto'); handleBuy(); }} />
      <Button title="Comprar VIP" onPress={() => { setTipo('VIP'); handleBuy(); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
