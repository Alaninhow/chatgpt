import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import theme from '../theme';
import { Card, Row, Chip } from '../ui';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function TicketDetailsScreen({ route }) {
  const { ticketId } = route.params || {};
  const [ticket, setTicket] = React.useState(null);
  const payload = JSON.stringify({ ticketId });

  React.useEffect(() => {
    let active = true;
    (async () => {
      const snap = await getDoc(doc(db, 'tickets', ticketId));
      if (active && snap.exists()) setTicket({ id: ticketId, ...snap.data() });
    })();
    return () => { active = false; };
  }, [ticketId]);

  const expiresAt = ticket?.validUntil?.toDate?.();
  const left = expiresAt ? expiresAt.getTime() - Date.now() : null;
  const leftLabel = left != null
    ? (left > 0 ? msToText(left) : 'Expirado')
    : '—';

  const tone = ticket?.redeemed ? 'danger' : 'success';

  return (
    <View style={s.screen}>
      <Text style={s.title}>Ingresso #{ticketId}</Text>

      <Card style={{ marginTop: 12, alignItems: 'center' }}>
        <QRCode value={payload} size={240} />
        <Text style={{ color: theme.colors.subtext, marginTop: 10 }}>
          Mostre este QR na portaria. Uso único.
        </Text>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={s.sectionTitle}>Detalhes</Text>
          <Chip text={ticket?.redeemed ? 'Usado' : 'Ativo'} tone={tone} />
        </View>
        <Row left="Tipo" right={ticket?.type || '—'} />
        <Row left="Preço" right={ticket ? `R$ ${Number(ticket.price || 0).toFixed(2)}` : '—'} />
        <Row left="Válido até" right={expiresAt ? expiresAt.toLocaleString() : '—'} />
        <Row left="Tempo restante" right={leftLabel} />
      </Card>
    </View>
  );
}

function msToText(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${ss}s`;
  return `${ss}s`;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '800' },
  sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '700', marginBottom: 10 },
});
