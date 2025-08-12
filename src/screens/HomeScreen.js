import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const tickets = [
    { id: '1', tipo: 'Adulto', data: '10/08/2025' },
    { id: '2', tipo: 'VIP', data: '11/08/2025' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Tickets</Text>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ticket}>
            <Text>{item.tipo}</Text>
            <Text>{item.data}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  ticket: { padding: 15, backgroundColor: '#eee', marginBottom: 10, borderRadius: 5 },
});
