import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { createTicket } from '../services/tickets';
import theme from '../theme';
import { Card, PrimaryButton } from '../ui';

export default function BuyTicketScreen({ navigation }) {
  const [tipo, setTipo] = useState('Adulto');
  const [qtd, setQtd] = useState(1);
  const precos = { Adulto: 50, VIP: 120 };
  const total = (precos[tipo] * qtd).toFixed(2);

  async function handleBuy() {
    try {
      const u = auth.currentUser;
      if (!u) return Alert.alert('Login', 'Faça login para comprar.');
      const validUntil = new Date(); validUntil.setHours(23, 59, 59, 999);

      // cria 1 ticket por unidade (simples)
      let lastId = null;
      for (let i = 0; i < qtd; i++) {
        const { ok, ticketId } = await createTicket({
          ownerUid: u.uid,
          type: tipo,
          price: precos[tipo],
          validUntilMillis: validUntil.getTime(),
        });
        if (ok) lastId = ticketId;
      }
      Alert.alert('Sucesso', `Compra concluída (${qtd} x ${tipo})`);
      if (lastId) navigation.navigate('TicketDetails', { ticketId: lastId });
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível criar seus tickets.');
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Comprar Ingresso</Text>

      <Card style={{ marginTop: 12 }}>
        <Text style={styles.label}>Tipo de ingresso</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Option text="Adulto - R$ 50" selected={tipo === 'Adulto'} onPress={() => setTipo('Adulto')} />
          <Option text="VIP - R$ 120" selected={tipo === 'VIP'} onPress={() => setTipo('VIP')} />
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Quantidade</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQtd(q => Math.max(1, q - 1))}><Text style={styles.qtyText}>-</Text></TouchableOpacity>
          <Text style={styles.qtyValue}>{qtd}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQtd(q => q + 1)}><Text style={styles.qtyText}>+</Text></TouchableOpacity>
        </View>

        <Text style={styles.total}>Total: R$ {total}</Text>
        <PrimaryButton title="Confirmar Compra" icon="card" onPress={handleBuy} style={{ marginTop: 12 }} />
      </Card>
    </View>
  );
}

function Option({ text, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.option,
        selected && { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface },
      ]}
    >
      <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '800' },
  label: { color: theme.colors.subtext, marginBottom: 6, marginTop: 4 },
  option: {
    backgroundColor: theme.colors.card,
    borderWidth: 1, borderColor: theme.colors.border,
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyBtn: { backgroundColor: theme.colors.surface, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  qtyText: { color: theme.colors.text, fontSize: 18 },
  qtyValue: { color: theme.colors.text, fontSize: 16, marginHorizontal: 12, fontWeight: '700' },
  total: { color: theme.colors.text, fontSize: 16, fontWeight: '800', marginTop: 16 },
});
