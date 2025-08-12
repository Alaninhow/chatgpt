import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import theme from '../theme';
import { Card, Chip, Row, PrimaryButton } from '../ui';

export default function HomeScreen({ navigation }) {
  const [tickets, setTickets] = React.useState([]);

  React.useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    const q = query(
      collection(db, 'tickets'),
      where('ownerUid', '==', u.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const ativos = tickets.filter(t => !t.redeemed);
  const usados = tickets.filter(t => t.redeemed);

  function TicketItem({ item }) {
    const tone = item.redeemed ? 'danger' : 'success';
    const expires =
      item.validUntil?.toDate?.()
        ? new Date(item.validUntil.toDate()).toLocaleDateString()
        : '—';

    return (
      <Card style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.cardTitle}>{item.type}</Text>
          <Chip text={item.redeemed ? 'Usado' : 'Ativo'} tone={tone} />
        </View>
        <Row left="Ticket ID" right={item.id} />
        <Row left="Válido até" right={expires} />
        <Row left="Preço" right={`R$ ${Number(item.price || 0).toFixed(2)}`} />
        <PrimaryButton
          title="Ver QR"
          icon="qr-code"
          onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}
          style={{ marginTop: 10 }}
        />
      </Card>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Meus Ingressos</Text>
      <Card style={{ marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.statsRow}>
          <Stat label="Ativos" value={ativos.length} />
          <Stat label="Usados" value={usados.length} />
          <Stat label="Total" value={tickets.length} />
        </View>
      </Card>

      <View style={{ marginTop: 12 }}>
        <FlatList
          data={tickets}
          keyExtractor={(i) => i.id}
          renderItem={TicketItem}
          ListEmptyComponent={
            <Card style={{ alignItems: 'center' }}>
              <Text style={{ color: theme.colors.subtext }}>Você ainda não tem ingressos.</Text>
              <PrimaryButton title="Comprar agora" icon="cart" onPress={() => navigation.navigate('Comprar')} style={{ marginTop: 10 }} />
            </Card>
          }
        />
      </View>

      <PrimaryButton
        title="Abrir Portaria"
        icon="scan"
        onPress={() => navigation.navigate('Portaria')}
        style={{ position: 'absolute', right: 16, bottom: 16 }}
      />
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '800' }}>{value}</Text>
      <Text style={{ color: theme.colors.subtext, marginTop: 4 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '800' },
  sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  cardTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '800', marginBottom: 10 },
  statsRow: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
});
