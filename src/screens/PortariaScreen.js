// src/screens/PortariaScreen.js (fallback sem câmera)
import React from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { validateTicket } from '../services/tickets';

export default function PortariaScreen() {
  const [ticketId, setTicketId] = React.useState('');

  async function onValidate() {
    try {
      if (!ticketId.trim()) return Alert.alert('Atenção', 'Digite um ticketId.');
      await validateTicket(ticketId.trim());
      Alert.alert('Sucesso', 'Ticket válido. Entrada liberada!');
      setTicketId('');
    } catch (e) {
      Alert.alert('Falha', e.message || 'Ticket inválido/expirado/ja usado.');
    }
  }

  return (
    <View style={s.c}>
      <Text style={s.t}>Validação Manual</Text>
      <Text style={{ color:'#666', marginBottom: 8 }}>Digite o ticketId (ou cole do QR):</Text>
      <TextInput
        style={s.i}
        placeholder="ex: 5a4e1f4c-...."
        value={ticketId}
        onChangeText={setTicketId}
        autoCapitalize="none"
      />
      <Button title="Validar" onPress={onValidate} />
      <Text style={{ color:'#666', marginTop: 16 }}>
        Depois que a câmera estiver ok, voltamos ao leitor de QR.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  c:{ flex:1, padding:20, justifyContent:'center' },
  t:{ fontSize:22, fontWeight:'700', marginBottom:12 },
  i:{ borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:10, marginBottom:12 }
});
