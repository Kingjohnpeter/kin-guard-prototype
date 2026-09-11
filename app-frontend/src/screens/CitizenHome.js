import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import * as api from '../services/mockApi';

export default function CitizenHome({ navigation, user }) {
  const [incidents, setIncidents] = useState([]);

  useEffect(()=> {
    setIncidents(api.listIncidentsForUser(user));
  }, []);

  return (
    <View style={{flex:1,padding:16}}>
      <Text style={{fontSize:18,fontWeight:'bold'}}>Bienvenue, {user.username}</Text>
      <Button title="Nouveau signalement" onPress={() => navigation.navigate('Report', { user })} />
      <Text style={{marginTop:12,fontWeight:'bold'}}>Mes signalements</Text>
      <FlatList
        data={incidents}
        keyExtractor={i=>i.kg_id}
        renderItem={({item})=>(
          <View style={{padding:8,borderBottomWidth:1,borderColor:'#eee'}}>
            <Text>{item.kg_id} — {item.nature} — {item.status}</Text>
            <Text onPress={() => navigation.navigate('IncidentDetail', { kg_id: item.kg_id })} style={{color:'blue'}}>Voir détail</Text>
          </View>
        )}
      />
      <View style={{marginTop:20}}><Button title="Déconnexion" onPress={() => navigation.navigate('Logout')} /></View>
    </View>
  );
}
