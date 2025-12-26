import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import CatalogueScreen from './screens/Catalogue';
import HomeScreen from './screens/HomeScreen';

enableScreens();

export type RootStackParamList = {
    Home: undefined;
    Catalogue: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: true, }}>
          <Stack.Screen
            name = "Home"
            component={HomeScreen}
            options={{ title: 'Home' }}/>
          <Stack.Screen
            name = "Catalogue"
            component={CatalogueScreen}
            options={{ title: 'Catalogue' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
