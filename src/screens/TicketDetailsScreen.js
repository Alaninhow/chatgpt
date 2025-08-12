import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function TicketDetailsScreen({ route }) {
  const { ticketId } = route.params || {};
  const payload = JSON.stringify({ ticketId });
  return (
    <View style={s.c}>
      <Text style={s.t}>Ingresso #{ticketId}</Text>
      <View style={{ marginTop: 16 }}>
        <QRCode value={payload} size={240} />
      </View>
      <Text style={{ marginTop: 10, color: '#666' }}>Mostre este QR na portaria. Uso único.</Text>
    </View>
  );
}
const s = StyleSheet.create({ c:{flex:1,alignItems:'center',justifyContent:'center',padding:20}, t:{fontSize:20,fontWeight:'700'} });
