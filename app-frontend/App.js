import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './src/screens/AuthScreen';
import CitizenHome from './src/screens/CitizenHome';
import PolicierHome from './src/screens/PolicierHome';
import CommissaireDashboard from './src/screens/CommissaireDashboard';
import CommissaireGeneralDashboard from './src/screens/CommissaireGeneralDashboard';
import IncidentDetail from './src/screens/IncidentDetail';
import ReportScreen from './src/screens/ReportScreen';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null); // { userId, role, username, commune_id, unit_id }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Auth">
            {props => <AuthScreen {...props} onLogin={setUser} />}
          </Stack.Screen>
        ) : (
          <>
            {user.role === 'citoyen' && (
              <>
                <Stack.Screen name="CitizenHome">
                  {props => <CitizenHome {...props} user={user} />}
                </Stack.Screen>
                <Stack.Screen name="Report">
                  {props => <ReportScreen {...props} user={user} />}
                </Stack.Screen>
                <Stack.Screen name="IncidentDetail">
                  {props => <IncidentDetail {...props} user={user} />}
                </Stack.Screen>
              </>
            )}
            {user.role === 'policier' && (
              <>
                <Stack.Screen name="PolicierHome">
                  {props => <PolicierHome {...props} user={user} />}
                </Stack.Screen>
                <Stack.Screen name="IncidentDetail">
                  {props => <IncidentDetail {...props} user={user} />}
                </Stack.Screen>
              </>
            )}
            {user.role === 'commissaire' && (
              <>
                <Stack.Screen name="CommissaireDashboard">
                  {props => <CommissaireDashboard {...props} user={user} />}
                </Stack.Screen>
                <Stack.Screen name="IncidentDetail">
                  {props => <IncidentDetail {...props} user={user} />}
                </Stack.Screen>
              </>
            )}
            {user.role === 'commissaire_general' && (
              <>
                <Stack.Screen name="CommissaireGeneral">
                  {props => <CommissaireGeneralDashboard {...props} user={user} />}
                </Stack.Screen>
                <Stack.Screen name="IncidentDetail">
                  {props => <IncidentDetail {...props} user={user} />}
                </Stack.Screen>
              </>
            )}
            <Stack.Screen name="Logout" options={{ headerShown: false }}>
              {() => (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text onPress={() => setUser(null)}>Déconnexion (appuyer pour revenir)</Text>
                </View>
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
