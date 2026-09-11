import React from 'react';
import { View, Text, Button } from 'react-native';
import * as api from '../services/mockApi';

export default function IncidentDetail({ route, navigation, user }) {
  const { kg_id } = route.params;
  const inc = api.getIncident(kg_id);
  if (!inc) return <View><Text>Incident introuvable</Text></View>;

  const canView = (() => {
    if (user.role === 'commissaire_general') return true;
    if (user.role === 'citoyen') return inc.reporter_user_id === user.userId;
    if (user.role === 'policier') return inc.assignment && inc.assignment.unit_id === user.unit_id;
    if (user.role === 'commissaire') return inc.assignment && true;
    return false;
  })();

  if (!canView) return <View style={{padding:16}}><Text>Accès refusé à ce dossier.</Text></View>;

  return (
    <View style={{padding:16}}>
      <Text style={{fontWeight:'bold'}}>{inc.kg_id} — {inc.nature}</Text>
      <Text>Status: {inc.status}</Text>
      <Text>Localisation: {inc.location.lat}, {inc.location.lon}</Text>
      <Text style={{marginTop:12,fontWeight:'bold'}}>Chronologie (KG-TRACKS)</Text>
      {inc.tracks.map((t,i)=>(
        <View key={i} style={{paddingVertical:4}}>
          <Text>{t.timestamp} — {t.action} {t.details ? JSON.stringify(t.details): ''}</Text>
        </View>
      ))}
      <Text style={{marginTop:12}}>Affectation: {inc.assignment ? inc.assignment.unit_id + ' ('+inc.assignment.method+')' : 'aucune'}</Text>
      <View style={{marginTop:12}}><Button title="Fermer" onPress={() => navigation.goBack()} /></View>
    </View>
  );
}
