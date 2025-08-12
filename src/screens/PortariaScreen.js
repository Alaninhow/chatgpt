import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { validateTicket } from '../services/tickets';

export default function PortariaScreen() {
  const [hasPerm, setHasPerm] = React.useState(null);
  const [scanning, setScanning] = React.useState(false);

  React.useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({ status }) => setHasPerm(status === 'granted'));
  }, []);

  async function onScan({ data }) {
    try {
      setScanning(false);
      const payload = JSON.parse(data); // { ticketId }
      await validateTicket(payload.ticketId);
      Alert.alert('Sucesso', 'Ticket válido. Entrada liberada!');
    } catch (e) {
      Alert.alert('Falha', e.message || 'Ticket inválido/expirado/ja usado.');
    }
  }

  if (hasPerm === null) return <Text>Solicitando permissão...</Text>;
  if (!hasPerm) return <Text>Sem permissão de câmera.</Text>;

  return (
    <View style={{ flex:1 }}>
      {scanning ? (
        <BarCodeScanner onBarCodeScanned={onScan} style={{ flex: 1 }} />
      ) : (
        <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
          <Button title="Ler QR" onPress={() => setScanning(true)} />
        </View>
      )}
    </View>
  );
}
