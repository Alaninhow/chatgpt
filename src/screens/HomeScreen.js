import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

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

  return (
    <View style={s.c}>
      <Text style={s.t}>Meus Tickets</Text>
      <FlatList
        data={tickets}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={s.row}>
            <Text>{item.type} — {item.redeemed ? 'Usado' : 'Ativo'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}>
              <Text style={{ color:'#06f', marginTop: 6 }}>Ver QR</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <View style={{ marginTop: 12 }}>
            <Button title="Abrir Portaria (scanner)" onPress={() => navigation.navigate('Portaria')} />
          </View>
        }
      />
    </View>
  );
}
const s = StyleSheet.create({ c:{flex:1,padding:20}, t:{fontSize:22,fontWeight:'700',marginBottom:10}, row:{paddingVertical:12,borderBottomWidth:1,borderColor:'#eee'} });
