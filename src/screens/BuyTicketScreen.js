import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { auth } from '../../firebaseConfig';
import { createTicket } from '../services/tickets';

export default function BuyTicketScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState('Adulto');

  async function handleBuy() {
    try {
      const u = auth.currentUser;
      if (!u) return Alert.alert('Login', 'Faça login para comprar.');
      setLoading(true);
      const validUntil = new Date(); validUntil.setHours(23,59,59,999);
      const { ok, ticketId } = await createTicket({
        ownerUid: u.uid,
        type: tipo,
        price: tipo === 'VIP' ? 120 : 50,
        validUntilMillis: validUntil.getTime(),
      });
      if (!ok) throw new Error('Falha ao criar ticket');
      Alert.alert('Sucesso', 'Ticket criado!');
      navigation.navigate('TicketDetails', { ticketId });
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível criar seu ticket.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.c}>
      <Text style={s.t}>Comprar Ticket</Text>
      <Button title="Tipo: Adulto" onPress={() => setTipo('Adulto')} />
      <Button title="Tipo: VIP" onPress={() => setTipo('VIP')} />
      <View style={{ height: 12 }} />
      <Button title={loading ? 'Gerando...' : 'Confirmar compra'} onPress={handleBuy} disabled={loading} />
    </View>
  );
}
const s = StyleSheet.create({ c:{flex:1,padding:20}, t:{fontSize:20,fontWeight:'700',marginBottom:12} });
