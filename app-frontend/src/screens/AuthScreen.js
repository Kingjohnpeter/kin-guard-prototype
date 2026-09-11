import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as api from '../services/mockApi';

export default function AuthScreen({ navigation, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = () => {
    const res = api.loginMock(username, password);
    if (res.ok) {
      onLogin(res.user);
    } else {
      alert('Échec authentification: ' + res.error + '\nComptes test: alice@citoyen / police1 / comm1 / general (mdp 1234)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KIN-GUARD Prototype</Text>
      <TextInput placeholder="username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Se connecter" onPress={doLogin} />
      <Text style={{marginTop:20}}>Comptes test: alice@citoyen, police1, comm1, general (mdp 1234)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:20},
  title:{fontSize:20,fontWeight:'bold',marginBottom:20,textAlign:'center'},
  input:{borderWidth:1,borderColor:'#ccc',padding:8,marginBottom:10,borderRadius:6}
});
