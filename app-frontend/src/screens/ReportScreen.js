import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import * as api from '../services/mockApi';

export default function ReportScreen({ navigation, route }) {
  const reporter = route.params?.user || null;
  const [desc, setDesc] = useState('');
  const fakeLocation = { lat: -4.345, lon: 15.266 };

  const submit = () => {
    if (!reporter) {
      alert('Aucun utilisateur détecté.');
      return;
    }
    const incident = api.createIncident(reporter.userId, fakeLocation, desc || 'Demande d\'aide', 'urgent');
    api.autoAssign(incident.kg_id);
    alert('Signalement créé: ' + incident.kg_id);
    navigation.navigate('CitizenHome');
  };

  return (
    <View style={{flex:1,padding:16}}>
      <Text style={{fontWeight:'bold'}}>Nouveau signalement</Text>
      <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={{borderWidth:1,borderColor:'#ccc',padding:8,marginVertical:12}} />
      <Text>Localisation: position actuelle (simulée)</Text>
      <Button title="Envoyer" onPress={submit} />
    </View>
  );
}
