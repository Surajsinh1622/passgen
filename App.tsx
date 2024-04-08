import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GeneratedPassword from './src/generat-password';
import PasswordList from './src/pass-list';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="passlist">
        <Stack.Screen name="passgen" component={GeneratedPassword} />
        <Stack.Screen name="passlist" component={PasswordList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
