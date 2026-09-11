import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import * as api from '../services/mockApi';

export default function CommissaireDashboard({ navigation, user }) {
  const [missions, setMissions] = useState([]);

  useEffect(()=>{
    setMissions(api.listIncidentsForUser(user));
  }, []);

  const doAutoAssign = (kg_id) => {
    api.autoAssign(kg_id);
    setMissions(api.listIncidentsForUser(user));
    alert('Affectation automatique effectuée (audit journalisé)');
  };

  return (
    <View style={{flex:1,padding:16}}>
      <Text style={{fontSize:18,fontWeight:'bold'}}>Commissaire — Commune: {user.commune_id}</Text>
      <Text style={{marginTop:12,fontWeight:'bold'}}>Missions (commune)</Text>
      <FlatList
        data={missions}
        keyExtractor={i=>i.kg_id}
        renderItem={({item})=>(
          <View style={{padding:8,borderBottomWidth:1,borderColor:'#eee'}}>
            <Text>{item.kg_id} — {item.nature} — {item.status}</Text>
            <Button title="Voir détail" onPress={() => navigation.navigate('IncidentDetail', { kg_id: item.kg_id })} />
            <View style={{height:6}}/>
            <Button title="Affectation auto" onPress={() => doAutoAssign(item.kg_id)} />
          </View>
        )}
      />
      <View style={{marginTop:20}}><Button title="Déconnexion" onPress={() => navigation.navigate('Logout')} /></View>
    </View>
  );
}
